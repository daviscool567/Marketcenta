<template>
  <ion-content>
    <ion-header>
        <ion-toolbar>
            <ion-title>{{ title }}</ion-title>
            <ion-buttons slot="end">
                <ion-button color="dark" @click="dismissModal">
                    <ion-icon slot="icon-only" :icon="closeOutline"></ion-icon>
                </ion-button>
            </ion-buttons>
        </ion-toolbar>
    </ion-header>
    <div class="d-flex ion-padding mb-3">
      <h5 style="margin-bottom: 0 !important">Membership Plans</h5>
    </div>
    <div>
      <div v-if="plans.length">
        <div v-for="(plan, index) in plans" :key="index">
            <div class="bg-address">
                <div class="d-flex">
                    <ion-list>
                        <ion-radio-group v-model="selectedPlan">
                            <ion-item class="border-none">
                                <ion-label class="address-content">
                                    <h5>{{ plan.name }}</h5>
                                    <h6>&#8358;{{ Number(plan.amount).toLocaleString() }}</h6>
                                    <div class="alert alert-info py-1">
                                        <!-- <i class="mdi mdi-information mr-2"></i> -->
                                        <p style="font-size: 12px" class="ml-auto">
                                            30 days payback on <br />
                                            credit purchases
                                        </p>
                                    </div>
                                </ion-label>
                                <ion-radio slot="start" :value="plan" :checked="plan == selectedPlan"></ion-radio>
                            </ion-item>
                        </ion-radio-group>
                    </ion-list>
                    <div class="ml-auto">
                        <img
                            :src="plan.subscription_image"
                            alt=""
                            width="80"
                            height="80"
                            class="img-fluid"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="order-btn">
            <ion-button
                class="mb-3"
                color="primary"
                expand="block"
                @click="subscribe"
            >
                SELECT PLAN
            </ion-button>
            <ion-button type="button" style="margin-top: 15px" color="light" @click="dismissModal" expand="block">
                CANCEL
            </ion-button>
        </div>
      </div>
      <div v-else class="alert alert-info" style="margin: 10px">
        <h6>No Subscription plans created yet</h6>
      </div>
    </div>
  </ion-content>
</template>
<script>
import { defineComponent } from 'vue'
import  { IonItem, IonHeader, IonToolbar, IonTitle, IonList,
IonLabel, IonButton, IonButtons, IonRadio, IonRadioGroup, IonContent, IonIcon } from '@ionic/vue'
import { closeOutline } from 'ionicons/icons';
import { modalController } from "@ionic/vue";
import axios from "axios";
import { mapActions, mapGetters } from "vuex";
export default defineComponent({
  components: {
    IonItem,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonLabel,
    IonButton,
    IonButtons,
    IonRadioGroup,
    IonRadio, 
    IonList,
    IonContent,
    IonIcon
  },
  props: {
      title: String,
      membership: Object
  },
  computed: mapGetters(["auth_token"]),
  data() {
    return {
      plans: {},
      selectedPlan: this.membership,
      closeOutline
    };
  },
  mounted() {
    this.getAuthData();
    this.fetchPlans();
  },
  methods: {
    ...mapActions(["getAuthData"]),
    fetchPlans() {
      this.presentLoading('Loading');
      axios
        .get(this.dynamic_auth_route("membership/plans/fetch"), {
          headers: {
            authorization: `Bearer ${this.auth_token}`,
          },
        })
        .then((res) => {
          this.plans = res.data;
        })
        .catch((error) => {
            this.openToast("An error occured. Please, try again.", 'danger');
            this.tokenExpired(error);
        })
        .finally(() => {
          this.dismissLoading();
        });
    },
    subscribe() {
      let ref = Math.random().toString(36).substr(2, 6);
      const userId = this.$store.state.user.id;
      const route = this.dynamic_auth_route("membership/payment/verify");
      const planID = this.selectedPlan.id;
      let amount = 0;
      if (this.membership != "") {
        amount = Math.abs(this.selectedPlan.amount - this.membership.amount);
      } else {
        amount = this.selectedPlan.amount;
      }

      if (
        this.membership != "" &&
        this.membership.amount > this.selectedPlan.amount
      ) {
          this.openToast("You cannot downgrade subscription plan.", 'danger');
            return;
      }
      const header = {
        headers: {
          authorization: `Bearer ${this.auth_token}`,
        },
      };
      // eslint-disable-next-line no-undef
      FlutterwaveCheckout({
        public_key: "FLWPUBK-049a53774a1dd9ca29dd26a6d3c23fa4-X",
        tx_ref: ref,
        amount: amount,
        currency: "NGN",
        country: "NG",
        payment_options: " ",
        customer: {
          email: this.$store.state.user.email,
          phone_number: this.$store.state.user.phone,
          name: this.$store.state.user.name,
        },
        callback: function (data) {
          // specified callback function
          let form = new FormData();
          form.append("transRef", data.transaction_id);
          form.append("userId", userId);
          form.append("subscriptionId", planID);
          axios
            .post(route, form, header)
            .then(() => {
              location.reload();
            })
            .catch((error) => {
              this.tokenExpired(error);
            });
        },
        customizations: {
          title: "Marketcenta",
          description: "Membership Subscription",
          logo: "https://res.cloudinary.com/adetayoapplication/image/upload/v1636387496/marketlogosm_e7obw7.png",
        },
      });
    },
    async dismissModal() {
        await modalController.dismiss();
    }
  },
});
</script>
<style scoped>
.add-address {
  font-size: 13px !important;
  font-weight: 600;
  color: #f26b31;
}
.add-address:hover {
  color: #ffffff !important;
}
.bg-address {
  border-radius: 4px;
  border: 1px solid #ededed;
  padding: 8px 15px 8px 1px;
  word-break: break-all;
}
.address-content{
    width: 165px;
    white-space: normal !important;
}
.address-content h5 {
  font-size: 18px;
  font-weight: 500;
  line-height: 1.8;
}
.address-content h6 {
  font-size: 16px;
  font-weight: 450;
  line-height: 2.0;
}
.address-content p {
  font-size: 14px;
  line-height: 1.6 !important;
}
.border-none {
    --border-color: transparent !important;
}
.order-btn {
    padding: 20px 10px 20px;
}
</style>
