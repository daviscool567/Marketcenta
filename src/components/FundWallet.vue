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
        <form @submit.prevent="fundWallet" class=" mt-4">
            <div>
                <ion-item>
                    <ion-label position="floating">Amount</ion-label>
                    <ion-input type="text" v-model="amount" required></ion-input>
                </ion-item>
            </div>
            <div class="order-btn">
                <ion-button
                    class="mb-3"
                    color="primary"
                    expand="block"
                    type="submit"
                >
                    PAY NOW
                </ion-button>
                <ion-button type="button" style="margin-top: 15px" color="light" @click="dismissModal" expand="block">
                    CLOSE
                </ion-button>
            </div>
        </form>
    </ion-content>
</template>
<script>
import { defineComponent } from 'vue'
import  { IonInput, IonItem, IonHeader, IonToolbar, IonTitle, 
IonLabel, IonButton, IonButtons, IonContent, IonIcon } from '@ionic/vue'
import { closeOutline } from 'ionicons/icons';
import { modalController } from "@ionic/vue";
import { mapActions, mapGetters } from "vuex";
import axios from "axios";

export default defineComponent({
    props: {
        title: String,
        userData: Object,
        authToken: String,
    },
    components: {
        IonInput,
        IonItem,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonLabel,
        IonButton,
        IonButtons,
        IonContent, 
        IonIcon
    },
    computed: mapGetters(["auth_token", "auth_user"]),
    data() {
        return {
            closeOutline,
            amount: "",
        }
    },
    mounted() {
        this.getAuthData();
    },
    methods: {
        ...mapActions(["getAuthData"]),
        fundWallet() {
            let ref = Math.random().toString(36).substr(2, 6);
            const userId = this.auth_user.id;
            const route = this.dynamic_auth_route("wallets/payment/verify");
            const header = {
                headers: {
                authorization: `Bearer ${this.auth_token}`,
                },
            };
            // eslint-disable-next-line no-undef
            FlutterwaveCheckout({
                public_key: "FLWPUBK-049a53774a1dd9ca29dd26a6d3c23fa4-X",
                tx_ref: ref,
                amount: this.amount,
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
                    axios
                        .post(route, form, header)
                        .then(() => {
                            location.reload();
                        })
                        .catch(() => {
                    
                        });
                },
                customizations: {
                    title: "Marketcenta",
                    description: "Payment for e-wallet funding",
                    logo: "https://res.cloudinary.com/adetayoapplication/image/upload/v1636387496/marketlogosm_e7obw7.png",
                },
            });
            //
        },
        async dismissModal() {
            await modalController.dismiss();
        }
        
    }
})
</script>
<style scoped>
.order-btn {
    padding: 30px 10px 10px;
}
</style>
