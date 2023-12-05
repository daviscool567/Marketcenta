<template>
    <ion-page>
      <BaseLayout>
        <div>
            <ion-card>
                <ion-card-content>
                    <h5 class="header-title">Contact Us</h5>
                    <p class="header-subtitle">
                        Send us a message and we will respond instantly
                    </p>
                    <form @submit.prevent="sendMessage" class="mt-4">
                        <div>
                            <ion-item class="mt-3">
                                <ion-label position="floating">Fullname</ion-label>
                                <ion-input type="text" v-model="form.name" required></ion-input>
                            </ion-item>
                            <ion-item class="mt-3">
                                <ion-label position="floating">Email</ion-label>
                                <ion-input type="email" v-model="form.email" required></ion-input>
                            </ion-item>
                            <ion-item>
                                <ion-label position="floating">Message</ion-label>
                                <ion-textarea v-model="form.message" cols="30" rows="5" required></ion-textarea>
                            </ion-item>
                        </div>
                        <div class="order-btn">
                            <ion-button
                                class="mb-3"
                                color="primary"
                                expand="block"
                                type="submit"
                            >
                                SEND
                            </ion-button>
                            <ion-button type="button" style="margin-top: 15px" color="light" expand="block">
                                CLEAR
                            </ion-button>
                        </div>
                    </form>
                </ion-card-content>
            </ion-card>

            <GDialog v-model="contact_dialog" max-width="500" persistent>
                <ion-card>
                    <ion-card-content>
                        <div class="text-center">
                            <img
                                src="../assets/images/checkmark-removebg-preview.png"
                                width="100"
                            />
                            <p>Message Sent successfully</p>
                            <p>
                                Thank you for contacting us. You will be responded to via your
                                email
                            </p>
                        </div>
                        <div class="text-center order-btn">
                            <ion-button @click="closeDialog();navigate('/')" fill="outline" color="success" expand="block">
                                CONTINUE SHOPPING
                            </ion-button>
                            <ion-button style="margin-top: 15px" color="light" @click="contact_dialog = false" expand="block">
                                CLOSE
                            </ion-button>
                        </div>
                    </ion-card-content>
                </ion-card>
            </GDialog>  
        </div>
      </BaseLayout>
    </ion-page>
</template>

<script>
import { defineComponent } from 'vue'
import  { IonCard, IonPage, IonCardContent, IonInput, IonItem, IonLabel,  IonTextarea,
        IonButton } from '@ionic/vue'
import BaseLayout from '@/components/BaseLayout'
import axios from "axios";
import { mapActions, mapGetters } from 'vuex'
import { GDialog } from "gitart-vue-dialog";

export default defineComponent({
    name: 'Account',
    components: {
        IonCard,
        BaseLayout,
        IonPage,
        IonCardContent,
        IonInput,
        IonItem, IonTextarea,
        IonLabel,
        IonButton, 
        GDialog
    },
    data() {
        return {
            form: {
                name: "",
                email: "",
                message: "",
            },
            contact_dialog: false,
        }
    },
    computed: mapGetters(["auth_token", "auth_user"]),
    mounted() {
        this.getAuthData();
    },
    methods: {
        ...mapActions(['getAuthData']),
        fetchCountries() {
        axios.get("https://countriesnow.space/api/v0.1/countries").then((res) => {
            this.countries = res.data.data;
        });
        },
        sendMessage() {
        this.loading = true;
            axios
                .post(this.dynamic_auth_route("contact"), this.form, {
                    headers: {
                        authorization: `Bearer ${this.auth_token}`,
                    },
                })
                .then(() => {
                    this.contact_dialog = true;
                })
                .catch((error) => {
                    this.tokenExpired(error);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        closeDialog() {
            this.contact_dialog = false
        },
        navigate(url){
            this.$router.push(url);
        }
    },
})
</script>
<style scoped>
.order-type {
    margin-left: 7px !important;
    vertical-align: middle !important;
    opacity: 0.7 !important;
    font-size: 14px !important;
}
.order-btn {
    padding: 30px 0 10px;
}
.order-radio {
    vertical-align: middle !important;
}
.header-title {
  font-weight: 600;
  font-size: 19px;
  color: #222222;
  line-height: 2.0;
}
.header-subtitle {
  font-size: 13px;
  margin-top: 2px !important;
  margin-bottom: 10px !important;
  font-weight: 400;
  color: #888888;
}
</style>
