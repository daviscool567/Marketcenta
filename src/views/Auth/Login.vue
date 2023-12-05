<template>
    <ion-page class="login-body">
        <div class="text-center">
            <img class="mt-4" src="../../assets/images/marketlogo.png" alt=""  width="200">
        </div>
        <div class="login-wrapper fixed-bottom">
            <form @submit.prevent="doLogin">
                <h4 style="margin-bottom: 4px !important">Sign in to your account</h4>
                <div class="alert alert-danger" v-if="show">
                    <div class="d-flex" style="padding-top: 3px !important; padding-bottom: 3px !important">
                        <i class="mdi mdi-message-alert-outline mr-2"></i>
                        <span class="mr-auto" style="font-size: 14px">{{ errorMsg }}</span>
                    </div>
                </div>
                <div>
                    <ion-item>
                        <ion-label class="login-label" position="floating">Email</ion-label>
                        <ion-input class="input-content" type="email" v-model="form.email" required></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label class="login-label" position="floating">Password</ion-label>
                        <ion-input class="input-content" v-if="showPassword" type="text" v-model="form.password"></ion-input>
                        <ion-input class="input-content" v-else type="password" v-model="form.password"></ion-input>
                        <span class="brown-clr pointer change-text mdi" id="toggleText" @click="togglePassword" 
                            :class="{ 'mdi-eye-off-outline': showPassword, 'mdi-eye-outline': !showPassword }">
                        </span>
                    </ion-item>

                </div>
                <div style="text-align: right">
                    <p @click="authNavigation('/forgot-password')" class="password-forget">Forgot Password?</p>
                </div>
                <div class="login-btn">
                    <ion-button
                        class="mb-3"
                        color="primary"
                        @click="addToCart"
                        expand="block"
                        type="submit"
                        shape="round"
                    >
                        LOGIN
                    </ion-button>
                    <!-- <ion-button type="button" style="margin-top: 15px" color="light" @click="dismissModal" expand="block">
                        CANCEL
                    </ion-button> -->
                </div>
                <!-- <hr />
                <div class="loginwith-text">
                    <small>OR LOGIN WITH</small>
                </div> -->
            </form>
            <!-- <div class="login-btn mt-2 text-center">
                <button
                    class="mb-3 facebookicon mr-3"
                    @click="doFacebookLogin"
                >
                    <i class="mdi mdi-facebook"></i>
                    <ion-ripple-effect></ion-ripple-effect>
                </button>
                <button
                    class="mb-3 googleicon" @click="doGoogleLogin"
                >
                    <i class="mdi mdi-google"></i>
                    <ion-ripple-effect></ion-ripple-effect>
                </button>
            </div> -->
            <div class="no-account text-center fixed-bottom" style="z-index -1 !important">
                <p>Don't have account? <a @click="authNavigation('/register')">Sign Up</a></p>
            </div>
        </div>
    </ion-page>
</template>

<script>
import { defineComponent } from 'vue'
import  { IonPage, IonItem, IonLabel, IonInput, IonButton } from '@ionic/vue'
import axios from 'axios'
import { mapActions } from "vuex";

export default defineComponent({
    name: 'Login',
    components: {
        IonPage,
        IonItem,
        IonLabel,
        IonInput, 
        IonButton
    },
    data() {
        return {
            showPassword: false,
            show: false,
            errorMsg: "",
            form: {
                email: '',
                password: '',
            }
        }
    },
    mounted() {
        this.form.email = ''
        this.form.password = ''
        this.errorMsg = '',
        this.show = false
    },
    methods: {
        ...mapActions(["setAuthData"]),
        doLogin() {
            this.presentLoading('Authenticating');
            axios
                .post(this.dynamic_auth_route("auth/login"), this.form)
                .then((res) => {
                if (res.data.status == "error") {
                    this.errorMsg = res.data.message;
                    this.show = true;
                } else {
                    this.openToast("Login Successful", 'success');
                    this.setAuthData(res.data);
                    this.$router.push({ name: "Home" });
                }
                })
                .catch(() => {
                    this.openToast("An error occured. Please, try again.", 'danger');
                })
                .finally(() => {
                    this.dismissLoading();
                });
        },
        doFacebookLogin() {
            this.presentLoading('Authenticating');
            axios
                .get(this.dynamic_auth_route("auth/login/facebook"))
                .then((res) => {
                if (res.data.status == "error") {
                    this.errorMsg = res.data.message;
                    this.show = true;
                } else {
                    this.openToast("Login Successful", 'success');
                    this.setAuthData(res.data);
                    this.$router.push({ name: "Home" });
                }
                })
                .catch(() => {
                    this.openToast("An error occured. Please, try again.", 'danger');
                })
                .finally(() => {
                    this.dismissLoading();
                });
        },
        doGoogleLogin() {
            this.presentLoading('Authenticating');
            axios
                .get(this.dynamic_auth_route("auth/login/google"))
                .then((res) => {
                if (res.data.status == "error") {
                    this.errorMsg = res.data.message;
                    this.show = true;
                } else {
                    this.openToast("Login Successful", 'success');
                    this.setAuthData(res.data);
                    this.$router.push({ name: "Home" });
                }
                })
                .catch(() => {
                    this.openToast("An error occured. Please, try again.", 'danger');
                })
                .finally(() => {
                    this.dismissLoading();
                });
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
    height: 68%;
    border-top-right-radius: 17px;
    border-top-left-radius: 17px;
    padding: 5px 20px;
}
.login-wrapper h4 {
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
.input-content {
    font-size: 15px !important;
    color: #666666 !important;
}
</style>
