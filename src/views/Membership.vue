<template>
    <ion-page>
        <BaseLayout>
            <ion-card class="wallet-card">
                <ion-card-content>
                    <div v-if="subscriptions.length">
                        <h5 class="header-title">MEMBERSHIP</h5>
                        <div
                            class="card shadow-sm p-4"
                            style="border-radius: 20px !important"
                        >
                            <div class="text-center" v-if="membership">
                                <img
                                    :src="membership.subscription_image"
                                    alt=""
                                    width="80"
                                    height="80"
                                    class="mb-2"
                                />
                                <p
                                    style="
                                    margin-bottom: 5px !important;
                                    font-size: 13px;
                                    color: #666666;
                                    "
                                >
                                    You are currently on:
                                </p>
                                <h5 style="font-weight: 600; font-size: 20px; color: #333333; line-height: 1.5">
                                    {{ membership.name }} (&#8358;{{
                                    Number(membership.amount).toLocaleString()
                                    }})
                                </h5>
                                <div class="mt-3">
                                    <ion-button
                                    color="success"
                                    size="sm"
                                    class="rounded-lg px-3"
                                    style="color: white"
                                    @click="upgradePlan"
                                    >
                                    UPGRADE
                                    </ion-button>
                                </div>
                            </div>
                            <div v-else>
                            <div class="alert alert-info">
                                <h6>No Active Subscription</h6>
                            </div>
                            <ion-button
                                color="secondary"
                                size="sm"
                                class="rounded-lg mt-3 px-3"
                                style="color: white"
                                @click="upgradePlan"
                                >Subscribe</ion-button
                            >
                            </div>
                        </div>
                        <div>
                            <h5 class="trans">Subscription History</h5>
                        </div>
                        <div class="transaction-item mb-3 table-responsive-sm">
                            <table class="table table-sm table-striped table-hover">
                            <thead>
                                <tr>
                                <th>#</th>
                                <th>Plan</th>
                                <th>Amount (&#8358;)</th>
                                <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(sub, index) in subscriptions" :key="index">
                                <td>{{ index + 1 }}</td>
                                <td>{{ sub.name }}</td>
                                <td>{{ Number(sub.amount_paid).toLocaleString() }}</td>
                                <td>{{ formatDate(sub.created_at) }}</td>
                                </tr>
                            </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="text-center" v-else>
                        <b-avatar variant="light-danger" size="100">
                        <i class="mdi mdi-shield-star"></i>
                        </b-avatar>
                        <h4 class="my-3" style="color: #444444">No Membership Subscription</h4>
                        <div>
                        <ion-button
                            color="primary"
                            class="rounded-lg mt-4 mb-3 px-5"
                            style="color: white"
                            @click="upgradePlan"
                        >
                            SUBSCRIBE
                        </ion-button>
                        </div>
                    </div>
                </ion-card-content>
            </ion-card>
        </BaseLayout>
    </ion-page>
</template>

<script>
import { defineComponent } from 'vue'
import { IonPage, IonCard, IonCardContent, IonButton, modalController } from '@ionic/vue'
import axios from 'axios'
import { mapActions, mapGetters } from 'vuex'
import BaseLayout from '@/components/BaseLayout'
import UpgradePlan from '@/components/UpgradePlan'
import moment from 'moment';

export default defineComponent({
    components: {
        IonPage,
        IonCard,
        IonCardContent,
        IonButton,
        BaseLayout
    },
    data() {
        return {
            membership: {},
            subscriptions: {},
        };
    },
    computed: mapGetters(["auth_token"]),
    mounted() {
        this.getAuthData();
        this.fetchUserSubscriptions();
        this.fetchActiveSubscriptions();
    },
    methods: {
        ...mapActions(["getAuthData"]),
        fetchUserSubscriptions() {
            const userId = this.$store.state.user.id;
            this.presentLoading('Loading');
            axios
                .get(this.dynamic_auth_route("membership/fetch/" + userId), {
                headers: {
                    authorization: `Bearer ${this.auth_token}`,
                },
                })
                .then((res) => {
                    this.subscriptions = res.data;
                })
                .catch((error) => {
                    this.openToast("An error occured. Please, try again.", 'danger');
                    this.tokenExpired(error);
                })
                .finally(() => {
                    this.dismissLoading();
                });
        },
        fetchActiveSubscriptions() {
        const userId = this.$store.state.user.id;
        // this.presentLoading('Loading');
        axios
            .get(this.dynamic_auth_route("membership/active/fetch/" + userId), {
            headers: {
                authorization: `Bearer ${this.auth_token}`,
            },
            })
            .then((res) => {
                this.membership = res.data;
            })
            .catch((error) => {
                this.openToast("An error occured. Please, try again.", 'danger');
                this.tokenExpired(error);
            })
            .finally(() => {
                // this.dismissLoading();
            });
        },
        formatDate(date) {
            return moment(date).format("D MMM, YYYY");
        },
        async upgradePlan() {
            const modal = await modalController.create({
                component: UpgradePlan,
                cssClass: 'my-custom-class',
                componentProps: {
                    title: 'Membership plans',
                    membership: this.membership
                },
            });
            return modal.present();
        },
    },
})
</script>
<style scoped>
.transaction-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.wallet-card {
    margin-top: 35px;
}
.bg-gradient-danger,
[dir="ltr"] .btn-gradient-danger {
  background-image: linear-gradient(47deg, #f26b31, #4c1c80);
  color: #ffffff;
}
.wallet-body p {
  margin-bottom: 2px !important;
  font-size: 13px;
  opacity: 0.9;
}
.wallet-body .wallet-border {
  border-right: 2px solid #ffffff;
  margin-left: 18px;
}
.header-title {
  font-weight: 700;
  font-size: 18px;
  margin-bottom: 20px;
  margin-left: 10px;
  color: #444444;
}
.wallet-body h4 {
    font-size: 1.5rem !important;
}
.trans {
    font-size: 16px;
    font-weight: 500;
    line-height: 1.2;
    color: #111111 !important;
    margin-top: 30px;
    margin-bottom: 20px;
}
.font-weight-bolder {
    font-weight: bolder !important;
}
</style>
``