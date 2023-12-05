<template>
  <div>
    <div v-if="loading">
      <SkeletonText />
    </div>
    <div v-else>
      <div class="mt-2" v-if="openOrders.length">
          <div v-for="(order, i) in openOrders" :key="i">
              <div class="order-bg">
                  <i class="mdi mdi-chevron-right float-right"></i>
                  <div class="d-flex mobile-product">
                      <div class="justify-content-start">
                          <div class="product-image-inner">
                              <div class="products-img-wrapper">
                              <img
                                  :src="order.image[0].image"
                                  :alt="order.name"
                                  class="product-img img-fluid"
                              />
                              </div>
                          </div>
                      </div>
                      <div class="justify-content-end ml-2">
                          <div
                              class="product-content"
                              @click="
                              setCurrent(order);
                              orderDetails();
                              "
                          >
                              <h5 class="mb-2" style="color: #111111 !important; font-weight: 600; font-size: 14px;
                              margin-top: 0 !important">
                                  {{ order.name }}
                              </h5>
                              <h6>Order No. {{ order.order_number }}</h6>
                              <div class="badge mt-1 text-uppercase"
                              :class="{
                                  'badge-success': order.status == 'delivered',
                                  'badge-warning': order.status == 'shipped',
                                  'badge-info': order.status == 'pending',
                                  'badge-danger': order.status == 'cancelled',
                              }"
                              >
                                  {{ order.status }}
                              </div>
                              <h5 v-if="order.status == 'delivered'">
                                  Delivered: {{ formatDate(order.delivered_on) }}
                              </h5>
                              <h5 v-else>
                                  Ordered: {{ formatDate(order.created_at) }}
                              </h5>
                          </div>
                          <h6 v-if="order.status == 'pending'" class="text-danger ml-2" style="margin-top: 0 !important" @click="setCurrent(order);presentAlertConfirm()">
                              Cancel Order
                          </h6>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      <div v-else class="alert alert-info text-center text-uppercase mt-4 font-weight-bold">
          No open orders
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import { mapActions, mapGetters } from "vuex";
import  { alertController, modalController } from '@ionic/vue'
import axios from "axios";
import moment from 'moment';
import ProductOrderDetails from '@/components/OrdersComponent/ProductOrderDetails'
import SkeletonText from '@/components/SkeletonText'

export default defineComponent({
  components: {
    SkeletonText
  },
  data() {
    return {
      openOrders: {},
      currentOrder: {},
      loading: false,
    };
  },
  mounted() {
    this.getAuthData();
    this.fetchOpenOrders();
  },
  computed: {
    ...mapGetters(["auth_token", "auth_user"]),
  },
  methods: {
    ...mapActions(["getAuthData"]),
    fetchOpenOrders() {
      this.loading = true
      const form = new FormData();
      form.append("userId", this.auth_user.id);
      axios
        .post(this.dynamic_route("products/orders/open/fetch"), form, {
          headers: {
            authorization: `Bearer ${this.auth_token}`,
          },
        })
        .then((res) => {
          this.openOrders = res.data;
        })
        .catch((error) => {
          this.tokenExpired(error);
        })
        .finally(() => this.loading = false);
    },
    setCurrent(data) {
      this.currentOrder = data;
    },
    cancelOrder() {
      this.presentLoading('Cancelling Order');
      axios
        .post(this.dynamic_route("products/orders/cancel"), this.currentOrder, {
          headers: {
            authorization: `Bearer ${this.auth_token}`,
          },
        })
        .then((res) => {
          this.openToast(res.data.message, 'success');
          this.dismissAlert();
          this.fetchOpenOrders();
        })
        .catch((error) => {
            this.openToast("An error occured. Please, try again.", 'danger');
            this.tokenExpired(error);
        })
        .finally(() => (this.dismissLoading()));
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
    async orderDetails() {
        const modal = await modalController.create({
            component: ProductOrderDetails,
            cssClass: 'my-custom-class',
            componentProps: {
                title: 'Order details',
                details: this.currentOrder
            },
        });
        return modal.present();
    },
  },
})
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
