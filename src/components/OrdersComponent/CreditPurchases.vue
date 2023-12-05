<template>
  <div>
    <div v-if="loading">
      <SkeletonText />
    </div>
    <div v-else>
      <div class="alert alert-info mt-4" style="line-height: 1.8; font-size: 15px">
        <b>Note:</b> All items purchased on credit are expected to be paid fourteen
        (14) days after delivery. Failure to do so leads to termination of
        Membership subscription
      </div>
      <div class="mt-2" v-if="creditOrders.length">
        <div v-for="(order, i) in creditOrders" :key="i">
          <div
            class="order-bg"
            @click="setCurrent(order); creditOrderDetails();">
            <i class="mdi mdi-chevron-right float-right"></i>
            <ion-button
              size="small"
              color="success"
              class="float-right mr-2 text-white"
              v-if="order.status == 'unpaid'"
              @click="setCurrent(order); payNow();">
              PAY NOW
            </ion-button>
            <div>
              <h6 style="margin-top: 0 !important; color: #000000">Order Number</h6>
              <p class="mb-2" style="font-size: 15px; margin-top: 2px !important; color: #222222">{{ order.order_id }}</p>
              <span style="font-size: 13px !important"
                class="badge mt-1 text-uppercase"
                :class="{
                  'badge-success': order.status == 'paid',
                  'badge-danger': order.status == 'unpaid',
                }"
              >
                {{ order.status }}
              </span>
              <small class="ml-2" style="font-size: 14px; color: #333333"
                >Ordered on: {{ formatDate(order.created_at) }}</small
              >
            </div>
          </div>
        </div>
      </div>
      <div v-else class="alert alert-info text-center text-uppercase mt-4 font-weight-bold">
        No orders made on credit
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { mapActions, mapGetters } from "vuex";
import  { alertController, modalController, IonButton } from '@ionic/vue'
import axios from "axios";
import moment from 'moment';
import CreditOrderDetails from '@/components/OrdersComponent/CreditOrderDetails'
import SkeletonText from '@/components/SkeletonText'
export default defineComponent({
  components: {
    IonButton,
    SkeletonText,
  },
  data() {
    return {
      creditOrders: {},
      currentOrder: {},
      loading: false
    };
  },
  mounted() {
    this.getAuthData();
    this.fetchCreditOrders();
  },
  computed: {
    ...mapGetters(["auth_token", "auth_user"]),
  },
  methods: {
    ...mapActions(["getAuthData"]),
    fetchCreditOrders() {
      this.loading = true
      const form = new FormData();
      form.append("userId", this.auth_user.id);
      axios
        .post(this.dynamic_route("products/orders/credit/fetch"), form, {
          headers: {
            authorization: `Bearer ${this.auth_token}`,
          },
        })
        .then((res) => {
          this.creditOrders = res.data;
        })
        .catch((error) => {
          this.openToast("AN error occured. Please, try again.", 'danger');
          this.tokenExpired(error);
        })
        .finally(() => this.loading=false);
    },
    setCurrent(data) {
      this.currentOrder = data;
    },
    formatDate(date) {
        return moment(date).format("D-MM-YYYY");
    },
    async presentAlertConfirm() {
      const alert = await alertController
        .create({
          cssClass: 'my-custom-class',
          header: 'Cancel Order?',
          message: 'Are you sure you want to cancel order',
          buttons: [
            {
              text: 'No, exit',
              role: 'cancel',
              cssClass: 'secondary',
              id: 'cancel-button',
              handler: () => {
              },
            },
            {
              text: 'Yes, continue',
              id: 'confirm-button',
              handler: () => {
                this.cancelOrder()
              },
            },
          ],
        });
      return alert.present();
    },
    async dismissAlert() {
        await alertController.dismiss();
    },
    async creditOrderDetails() {
        const modal = await modalController.create({
            component: CreditOrderDetails,
            cssClass: 'my-custom-class',
            componentProps: {
                title: 'Products on credit',
                productOrder: this.currentOrder
            },
        });
        return modal.present();
    },
    payNow() {
      let ref = Math.random().toString(36).substr(2, 6);
      const userId = this.auth_user.id;
      const orderId = this.currentOrder.id;
      const route = this.dynamic_route("products/orders/credit/payment/verify");
      const header = {
        headers: {
          authorization: `Bearer ${this.auth_token}`,
        },
      };
      // eslint-disable-next-line no-undef
      FlutterwaveCheckout({
        public_key: "FLWPUBK-049a53774a1dd9ca29dd26a6d3c23fa4-X",
        tx_ref: ref,
        amount: this.currentOrder.amount_paid,
        currency: "NGN",
        country: "NG",
        payment_options: " ",
        customer: {
          email: this.auth_user.email,
          phone_number: this.auth_user.phone,
          name: this.auth_user.name,
        },
        callback: function (data) {
          // specified callback function
          let form = new FormData();
          form.append("transRef", data.transaction_id);
          form.append("userId", userId);
          form.append("orderId", orderId);
          axios
            .post(route, form, header)
            .then(() => {
              location.reload();
            })
            .catch(() => {});
        },
        customizations: {
          title: "Marketcenta",
          description: "Payment for items purchased on credit",
          logo: "https://res.cloudinary.com/adetayoapplication/image/upload/v1636387496/marketlogosm_e7obw7.png",
        },
      });
    },
  },
});
</script>

<style scoped>
.order-bg {
  border: 1px solid #777777;
  border-radius: 4px;
  border: 1px solid #ededed;
  padding: 8px;
  word-break: break-all;
  margin-bottom: 20px;
}
.mobile-product {
  align-items: flex-start;
}
.product-image-inner {
  min-height: auto;
  color: #333333;
}
.products-img-wrapper {
  box-shadow: 0 0 1px 1px hsl(0deg 0% 0% / 5%);
  border-radius: 5px;
}
.mobile-product .products-img-wrapper,
#mobile-recommended .mobile-product .products-img-wrapper {
  width: 125px !important;
  height: 120px;
}
.item-img {
  border-bottom: 2px solid #f1f1f1;
}
.item-name {
  margin-top: 0 !important;
}
.mobile-product .product-img,
#mobile-recommended .mobile-product .product-img {
  max-height: 152px;
  min-height: 120px;
}

.product-img {
  object-fit: cover;
  max-width: 100%;
  max-height: 180px;
  width: 100%;
  margin-bottom: 0 !important;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}

.item-name a {
  font-weight: 600;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  text-decoration: none;
  color: #5f5d5d !important;
}

.product-content {
  position: relative;
}
.product-content h5 {
  font-size: 14px !important;
  margin-top: 2px !important;
}

.product-content h6 {
  font-size: 13px !important;
  font-weight: 500;
  color: #555555;
  margin-top: 0 !important;
  margin-bottom: 5px !important;
}

.item-count h5 {
  font-weight: 600;
  opacity: 0.8;
}
</style>
