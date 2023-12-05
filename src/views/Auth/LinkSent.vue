<template>
    <ion-page class="login-body">
        <div class="mt-md-5 mt-2 p-2 p-md-0">
            <div style="width: 450px" class="mx-auto recovery">
                <div class="text-center">
                    <img src="../../assets/images/marketlogosm.png" alt="" />
                </div>

                <ion-card class="mt-4 px-md-2 px-1">
                    <ion-card-content>
                        <p class="text-center mb-4">Forgot Password?</p>
                        <div class="text-center mb-4">
                        <img
                            src="https://st2.depositphotos.com/2904097/6144/v/600/depositphotos_61449541-stock-illustration-vector-e-mail-icon.jpg"
                            alt=""
                            width="100"
                            class="rounded-circle"
                        />
                        </div>
                        <small style="font-weight: 500; font-size: 13px; color: #777777"
                        >We sent a recovery link to you at</small
                        >
                        <p>{{ form.recoveryEmail }}</p>
                        <div
                        class="py-3 text-center"
                        style="
                            border-top: 1px solid #dddddd;
                            margin-top: 30px;
                            font-size: 13px;
                            font-weight: 400;
                        "
                        >
                        <a @click="this.$router.push('/login')" class="mr-2" to="/login">Return to Login</a> |
                        <a @click="authNavigation('/forgot-password')" class="ml-2" to="/forgot-password"
                            >Resend recovery Link</a
                        >
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
import  { IonPage, IonCard, IonCardContent } from '@ionic/vue'
import { mapActions } from "vuex";

export default defineComponent({
    name: 'Login',
    components: {
        IonPage,
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
        this.form.recoveryEmail = localStorage.getItem("recoveryEmail");
    },
    methods: {
        ...mapActions(["set_email"]),
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
