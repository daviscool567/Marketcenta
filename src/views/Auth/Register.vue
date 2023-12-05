<template>
    <ion-page class="login-body">
        <div class="text-center">
            <img class="mt-1" src="../../assets/images/marketlogo.png" alt=""  width="150">
        </div>
        <div class="login-wrapper fixed-bottom">
            <form @submit.prevent="create_account">
                <h5 style="margin-bottom: 5px !important">Create a new account</h5>
                <ion-radio-group v-model="form.account_type">
                    <ion-grid>
                        <p style="margin: 2px 0 5px !important; font-size: 14px; opacity: 0.6">Account Type</p>
                        <ion-row>
                            <ion-col size="6">
                                <ion-radio class="order-radio" value="individual"></ion-radio>
                                <ion-label class="order-type">Individual</ion-label>
                            </ion-col>
                            <ion-col size="6">
                                <ion-radio class="order-radio" value="business"></ion-radio>
                                <ion-label class="order-type">Business</ion-label>
                            </ion-col>
                        </ion-row>
                    </ion-grid>
                </ion-radio-group>
                <div>
                    <div v-if="form.account_type == 'business'">
                        <ion-item>
                            <ion-label class="login-label" position="floating">Business Name</ion-label>
                            <ion-input class="input-content" type="text" v-model="form.name"></ion-input>
                        </ion-item>
                        <p v-if="errorMsg && errorMsg.name" class="text-danger error-p">
                            {{ errorMsg.name[0] }}
                        </p>
                    </div>
                    <div v-else>
                        <ion-item>
                            <ion-label class="login-label" position="floating">Firstname</ion-label>
                            <ion-input class="input-content" type="text" v-model="form.fname"></ion-input>
                        </ion-item>
                        <p v-if="errorMsg && errorMsg.name" class="text-danger error-p">
                            {{ errorMsg.name[0] }}
                        </p>
                        <ion-item>
                            <ion-label class="login-label" position="floating">Lastname</ion-label>
                            <ion-input class="input-content" type="text" v-model="form.lname"></ion-input>
                        </ion-item>
                        <p v-if="errorMsg && errorMsg.name" class="text-danger error-p">
                            {{ errorMsg.name[0] }}
                        </p>
                    </div>
                    <ion-item>
                        <ion-label class="login-label" position="floating">Email</ion-label>
                        <ion-input class="input-content" type="email" v-model="form.email" required></ion-input>
                    </ion-item>
                    <p v-if="errorMsg && errorMsg.email" class="text-danger error-p">
                        {{ errorMsg.email[0] }}
                    </p>
                    <ion-item>
                        <ion-label class="login-label" position="floating">Password</ion-label>
                        <ion-input v-if="showPassword" type="text" v-model="form.password"></ion-input>
                        <ion-input v-else type="password" v-model="form.password"></ion-input>
                        <span class="brown-clr pointer change-text mdi" id="toggleText" @click="togglePassword" 
                            :class="{ 'mdi-eye-off-outline': showPassword, 'mdi-eye-outline': !showPassword }">
                        </span>
                    </ion-item>
                    <p v-if="errorMsg && errorMsg.password" class="text-danger error-p">
                        {{ errorMsg.password[0] }}
                    </p>
                    <ion-item>
                        <ion-label class="login-label" position="floating">Phone (Optional)</ion-label>
                        <ion-input class="input-content" type="text" v-model="form.phone"></ion-input>
                    </ion-item>
                    <p v-if="errorMsg && errorMsg.phone" class="text-danger error-p">
                        {{ errorMsg.phone[0] }}
                    </p>
                    <ion-item>
                        <ion-label class="login-label" position="floating">Referral code (Optional)</ion-label>
                        <ion-input class="input-content" type="text" v-model="form.refCode"></ion-input>
                    </ion-item>
                </div>
                <div class="login-btn">
                    <ion-button
                        class="mb-3"
                        color="primary"
                        @click="create_account"
                        expand="block"
                        type="submit"
                        shape="round"
                    >
                        REGISTER
                    </ion-button>
                </div>
            </form>
            <!-- <div class="login-btn mt-2 text-center">
                <button
                    class="mb-3 facebookicon mr-3"
                >
                    <i class="mdi mdi-facebook"></i>
                    <ion-ripple-effect></ion-ripple-effect>
                </button>
                <button
                    class="mb-3 googleicon"
                >
                    <i class="mdi mdi-google"></i>
                    <ion-ripple-effect></ion-ripple-effect>
                </button>
            </div> -->
            <div class="no-account text-center fixed-bottom">
                <p>Already have an account? <a @click="authNavigation('/login')">Login</a></p>
            </div>
        </div>
    </ion-page>
</template>

<script>
import { defineComponent } from 'vue'
import  { IonPage, IonItem, IonLabel, IonInput, IonRadioGroup, IonRadio,
        IonGrid, IonRow, IonCol, IonButton } from '@ionic/vue'
import axios from 'axios'

export default defineComponent({
    name: 'Register',
    components: {
        IonPage,
        IonItem,
        IonLabel,
        IonInput, 
        IonRadioGroup, IonRadio,
        IonGrid, IonRow, IonCol,
        IonButton
    },
    data() {
        return {
            showPassword: false,
            loading: false,
            errorMsg: "",
            form: {
                name: '',
                account_type: 'individual',
                email: '',
                password: '',
                fname: '',
                lname: '',
                phone: '',
                refCode: '',
            }
        }
    },
    mounted() {
        // this.openToast('yessss', 'success')
    },
    methods: {
        create_account() {
            let fullname =
                this.form.account_type == "individual"
                ? this.form.fname + " " + this.form.lname
                : this.form.name;
            this.form.name = fullname;
            this.presentLoading('Submitting');
            axios
                .post(this.dynamic_auth_route("auth/register"), this.form)
                .then((res) => {
                if (res.status == 280) {
                    this.openToast(res.data.message, 'success');
                } else {
                    this.openToast(res.data.message, 'danger');
                    this.$router.push({ name: "Login" });
                }
                })
                .catch((err) => {
                    this.openToast("An error occured. Please, try again.", 'danger');
                    this.errorMsg = err.response.data.errors;
                })
                .finally(() => {
                    this.dismissLoading();
                });
        },
        getRefCode() {
            let ref = this.$route.query.referral_code;
            if (ref != undefined) {
                this.form.refCode = this.$route.query.referral_code;
            }
        },
        togglePassword() {
            this.showPassword = !this.showPassword;
        },
        authNavigation(url){
            this.$router.push(url);
        }
    }
})
</script>
<style scoped>
.login-body {
    /* background-image: linear-gradient(45deg, #f26b31, #080808); */
    /* background-image: linear-gradient(45deg, #313131, #080808); */
    background-image: linear-gradient(45deg, #270202, #480d56);
    /* background-color: #480d56; */
    height: 100% !important;
}
.login-wrapper {
    background-color: #ffffff;
    height: 85%;
    border-top-right-radius: 17px;
    border-top-left-radius: 17px;
    padding: 5px 20px;
}
.login-wrapper h5 {
    font-weight: 500;
    color: #555555
}
.login-label {
    font-size: 14px !important;
    opacity: 0.6;
}
.login-btn {
    padding: 15px 0 10px;
}
.password-forget {
    margin-top: 5px !important; 
    margin-bottom: 0 !important;
    font-size: 14px;
    opacity: 0.9;
    color: #f26b31;
}
.order-type {
    margin-left: 7px !important;
    vertical-align: middle !important;
    opacity: 0.7 !important;
    font-size: 14px !important;
}
.order-radio {
    vertical-align: middle !important;
}
.loginwith-text {
  background: #ffffff;
  width: 30%;
  text-align: center;
  margin: -26px 0 auto 115px;
  font-size: 14px;
  color: #888888;
}
.googleicon {
  border-color: #ff1b1b;
  background-color: #ff1b1b !important;
  color: #ffffff !important;
  border-radius: 100%;
  padding: 13px 10px 11px;
}
.facebookicon {
  border-color: #3a5795;
  background-color: #3a5795 !important;
  color: #ffffff !important;
  border-radius: 50%;
  padding: 13px 10px 11px;
}
.no-account p{
    font-size: 15px;
}
.no-account a{
    text-decoration: none !important;
    font-weight: 600;
}
hr {
  margin-top: 1rem;
  margin-bottom: 1rem;
  border: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}
hr {
  box-sizing: content-box;
  height: 0;
  overflow: visible;
}
.brown-clr {
  position: absolute;
  right: 0;
  bottom: 0;
  padding: 5px 10px;
}
.error-p {
    margin: 2px 0 !important;
    font-size: 12px;
}
.input-content {
    font-size: 14px !important;
    color: #777777 !important;
}
</style>
