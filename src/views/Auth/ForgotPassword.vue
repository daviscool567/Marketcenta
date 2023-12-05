<template>
    <ion-page class="login-body">
        <div class="container">
            <div style="width: 450px" class="mx-auto recovery">
                <div class="text-center">
                    <img src="../../assets/images/marketlogosm.png" alt="" />
                </div>
                <ion-card class="mt-4 px-md-2 px-1">
                    <ion-card-content>
                        <p class="text-center mb-4">Forgot Password?</p>
                        <small style="font-weight: 500; font-size: 13px; color: #777777"
                        >We'll send a recovery link to</small
                        >
                        <form @submit.prevent="sendRecoveryLink">
                            <ion-item>
                                <ion-label class="login-label" position="floating">Email</ion-label>
                                <ion-input placeholder="Enter email" class="input-content" type="email" v-model="form.recoveryEmail" required></ion-input>
                            </ion-item>
                            <div style="margin-top: 30px">
                                <ion-button color="primary" type="submit" expand="block">
                                    Send recovery link
                                </ion-button>
                            </div>
                        </form>
                        <div
                            class="py-3 text-center"
                            style="
                                border-top: 1px solid #dddddd;
                                margin-top: 50px;
                                font-size: 15px;
                                font-weight: 500;
                            "
                        >
                            <a @click="this.$router.push('/login')">Return to Login</a>
                        </div>
                    </ion-card-content>
                </ion-card>
                <div class="mt-3 text-center" style="font-size: 12px; font-weight: 500">
                    <a class="d-block d-lg-none" href="https://wa.me/+2347038894331"
                    >* Contact Admin</a>
                </div>
            </div>
        </div>
    </ion-page>
</template>

<script>
import { defineComponent } from 'vue'
import  { IonPage, IonItem, IonLabel, IonInput, IonButton, IonCard, IonCardContent } from '@ionic/vue'
import axios from 'axios'
import { mapActions } from "vuex";

export default defineComponent({
    name: 'Login',
    components: {
        IonPage,
        IonItem,
        IonLabel,
        IonInput, 
        IonButton,
        IonCard,
        IonCardContent,
    },
    data() {
        return {
            form: {
                recoveryEmail: "",
            },
        }
    },
    mounted() {
        let email = localStorage.getItem("recoveryEmail");
        if (email) {
            this.form.recoveryEmail = email;
        }
    },
    methods: {
        ...mapActions(["set_email"]),
        sendRecoveryLink() {
            this.presentLoading('Sending');
            localStorage.setItem("recoveryEmail", this.form.recoveryEmail);
            axios
                .post(
                    this.dynamic_auth_route("auth/login/resetpassword/sendlink"),
                    this.form
                )
                .then(() => {
                    this.$router.push({ name: "LinkSent" });
                })
                .catch(() => {
                //   toastr.error("An error occured. Please, try again.");
                })
                .finally(() => {
                    this.dismissLoading();
                });
        },
        authNavigation(url){
            this.$router.push(url);
        }
    }
})
</script>
<style scoped>
.login-body {
    margin-top: 30px
}
.recovery {
    width: 100% !important;
}
</style>
