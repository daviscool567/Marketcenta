<template>
    <ion-page>
        <BaseLayout>
            <ion-card class="wallet-card">
                <ion-card-content>
                    <h5 class="header-title">WALLET</h5>
                    <div
                        class="card bg-gradient-danger p-4"
                        style="border-radius: 20px !important"
                    >
                        <div class="d-flex wallet-body">
                            <span>
                                <p>Wallet Balance</p>
                                <h4 v-if="wallet.total">
                                    &#8358;{{ Number(wallet.total).toLocaleString() }}
                                </h4>
                                <h4 v-else>&#8358;0</h4>
                            </span>
                            <center class="wallet-border"></center>
                            <span class="ml-auto">
                                <p>Subscription Balance</p>
                                <h4 v-if="wallet.available">
                                    &#8358;{{ Number(wallet.available).toLocaleString() }}
                                </h4>
                                <h4 v-else>&#8358;0</h4>
                            </span>
                        </div>
                        <div class="text-center mt-4">
                            <ion-button
                                shape="round"
                                expand="block"
                                color="light"
                                @click="fundWallet"
                                style="
                                color: #222222 !important;
                                font-size: 13px;
                                font-weight: 650;
                                "
                                >FUND WALLET
                            </ion-button>
                        </div>
                    </div>
                    <div>
                        <h5 class="trans">Transactions</h5>
                    </div>
                    <div class="transaction-item mb-3" v-for="(trans, index) in walletTransactions" :key="index">
                        <div class="media">
                            <div class="media-aside align-self-start">
                                <span class="b-avatar badge-light-success rounded" 
                                    style="width: 42px; height: 42px;" v-if="trans.transaction_type == 'deposit'">
                                    <span class="b-avatar-custom">
                                        <i class="mdi mdi-arrow-down"></i>
                                    </span>
                                </span>
                                <span class="b-avatar badge-light-danger rounded" 
                                    style="width: 42px; height: 42px;" v-else>
                                    <span class="b-avatar-custom">
                                        <i class="mdi mdi-arrow-up"></i>
                                    </span>
                                </span>
                            </div>
                            <div class="media-body">
                                <h6 class="transaction-title mb-0" style="margin-bottom: 0 !important; font-weight: 500;
                                    line-height: 1.5; color: #000000; font-size: 1rem; margin-top: 0 !important">
                                    {{ trans.transaction_type == "deposit" ? "Credit" : "Debit" }}
                                </h6>
                                <small style="color: #000000; font-size: 13px">
                                    <!-- {{ moment(trans.created_at).format("D MMM, YYYY, h:mm a") }} -->
                                    {{ formatDate(trans.created_at) }}
                                </small>
                            </div>
                        </div>
                        <div style="font-size: 1rem" class="font-weight-bolder" :class=" trans.transaction_type == 'deposit'
                            ? 'text-success'
                            : 'text-danger'
                        ">
                            {{ trans.transaction_type == "deposit" ? "+" : "-" }}&#8358;{{
                                Number(trans.amount).toLocaleString()
                            }}
                        </div>
                    </div>
                    <div class="alert-info text-center p-4 rounded-lg" v-if="!walletTransactions.length">
                        <p>No Transactions History</p>
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
import FundWallet from '@/components/FundWallet'
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
            wallet: {},
            loading: false,
            walletTransactions: {},
        };
    },
    computed: mapGetters(["auth_token"]),
    mounted() {
        this.getAuthData();
        this.fetchWallet();
        this.fetchWalletTransactions();
    },
    methods: {
        ...mapActions(["getAuthData", "checkExpiredToken"]),
        fetchWallet() {
            const userId = this.$store.state.user.id;
            this.presentLoading('Loading');
            axios
                .get(this.dynamic_auth_route("wallets/fetch/" + userId), {
                    headers: {
                        authorization: `Bearer ${this.auth_token}`,
                    },
                })
                .then((res) => {
                    this.wallet = res.data;
                })
                .catch((error) => {
                    this.tokenExpired(error)
                })
                .finally(() => {
                    this.dismissLoading();
                });
        },
        fetchWalletTransactions() {
            const userId = this.$store.state.user.id;
            // this.presentLoading('Loading');
            axios
                .get(this.dynamic_auth_route("wallets/fetch/transactions/" + userId), {
                    headers: {
                        authorization: `Bearer ${this.auth_token}`,
                    },
                })
                .then((res) => {
                    this.walletTransactions = res.data;
                })
                .catch((error) => {
                    this.openToast("An error occured. Please, try again.", 'danger');
                    this.tokenExpired(error);
                })
                .finally(() => {
                    //  this.dismissLoading();
                });
        },
        formatDate(date) {
            return moment(date).format("D MMM, YYYY, h:mm a");
        },
        async fundWallet() {
            const modal = await modalController.create({
                component: FundWallet,
                cssClass: 'my-custom-class',
                componentProps: {
                    title: 'Fund Wallet',
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
    font-size: 1.25rem;
    font-weight: 500;
    line-height: 1.2;
    color: #111111 !important;
    margin-top: 25px;
    margin-bottom: 20px;
}
.font-weight-bolder {
    font-weight: bolder !important;
}
</style>
