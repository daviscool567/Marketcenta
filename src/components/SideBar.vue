<template>
  <ion-page>
    <ion-split-pane content-id="main-content">
      <ion-menu menu-id="app-menu" content-id="main-content" type="overlay">
        <ion-content>
          <div>
            <div class="bg-light py-2 px-3 d-flex">
              <!-- <img src="../assets/images/marketlogosm.png" alt="" width="60" /> -->
              <img v-if="auth_user" :src="auth_user.avatar" class="rounded-circle" alt="" width="60" />
              <span class="ml-3" v-if="auth_user">
                <h6 class="mt-2" style="margin-bottom: 0 !important">
                  {{ auth_user.name }}
                </h6>
                <small>{{ auth_user.email }}</small>
              </span>
            </div>
            <div class="main py-1">
              <ul class="nav nav-tabs flex-column">
                <li class="nav-item border-line">
                  <a class="nav-link border-line" @click="menuNavigation('/')"
                    ><i class="mdi mdi-home-outline mr-3"></i>Home</a
                  >
                </li>
                <li class="nav-item border-line">
                  <a class="nav-link border-line" @click="menuNavigation('/orders')"
                    ><i class="mdi mdi-shopping-outline mr-3"></i>Orders</a
                  >
                </li>
                <li class="nav-item border-line" v-if="auth_user">
                  <a class="nav-link border-line" router-direction="root" @click="menuNavigation('/account')"
                    ><i class="mdi mdi-account-outline mr-3"></i>My
                    Account</a> 
                </li>
                <li class="nav-item border-line">
                  <a class="nav-link border-line" @click="menuNavigation('/wallet')"
                    ><i class="mdi mdi-wallet-outline mr-3"></i>Wallet</a
                  >
                </li>
                <li class="nav-item border-line">
                  <a class="nav-link border-line" @click="menuNavigation('/membership')"
                    ><i class="mdi mdi-shield-star-outline mr-3"></i
                    >Membership</a
                  >
                </li>
                <li class="nav-item border-line">
                  <a class="nav-link" @click="menuNavigation('/refer')"
                    ><i class="mdi mdi-cash-multiple mr-3"></i>Refer and
                    Earn</a
                  >
                </li>
                <li class="nav-item border-line">
                  <a class="nav-link" @click="menuNavigation('/wishlist')"
                    ><i class="mdi mdi-heart-outline mr-3"></i>Saved
                    Products</a
                  >
                </li>
                <li class="nav-item border-line">
                  <a class="nav-link" @click="menuNavigation('/partner')"
                    ><i class="mdi mdi-handshake mr-3"></i>Partner with us</a
                  >
                </li>
                <!-- <li class="nav-item border-line">
                  <a class="nav-link border-line" to="/notifications"
                    ><i class="mdi mdi-bell-outline mr-3"></i
                    >Notifications</a
                  >
                </li> -->
                <li class="nav-item border-line">
                  <a class="nav-link border-line" @click="menuNavigation('/about')"
                    ><i class="mdi mdi-information-outline mr-3"></i>About
                    Us</a
                  >
                </li>
                <li class="nav-item border-line">
                  <a class="nav-link d-flex" @click="menuNavigation('/faq')"
                    ><i class="mdi mdi-message-question-outline mr-3"></i
                    >Frequently Asked Questions</a
                  >
                </li>
                <li class="nav-item">
                  <a
                    @click="menuNavigation('/contact')"
                    class="nav-link"
                    style="text-decoration: none !important"
                    ><i class="mdi mdi-human-greeting-proximity mr-3"></i>Contact Us</a
                  >
                </li>
                <li class="nav-item">
                  <a
                    class="nav-link"
                    href="https://wa.me/+2347038894331"
                    target="_blank"
                    style="text-decoration: none !important"
                    ><i class="mdi mdi-whatsapp mr-3"></i>Chat with Admin</a
                  >
                </li>
                <li
                  v-if="auth_user"
                  class="nav-item text-center mt-2 py-2"
                  style="border-top: 1px solid #dddddd"
                  @click="doLogout"
                >
                  <span class="font-weight-bold text-danger">LOGOUT</span>
                </li>
                <li class="nav-item border-line" v-else>
                  <a class="nav-link d-flex" @click="menuNavigation('/login')"
                    ><i class="mdi mdi-account-lock-open-outline mr-3"></i
                    >Login/Signup</a
                  >
                </li>
              </ul>
            </div>
          </div>
        </ion-content>
      </ion-menu>
      <slot></slot>
    </ion-split-pane>
  </ion-page>
</template>

<script>
import { 
  IonPage, IonContent,  IonSplitPane, 
  IonMenu, menuController } from '@ionic/vue';
import { defineComponent } from 'vue';
import { mapActions, mapGetters } from 'vuex'
import axios from 'axios'

export default defineComponent({
  name: 'Sidebar',
  components: {
    IonPage,
    IonContent,
    IonSplitPane,
    IonMenu,
  },
  data() {
    return {
      
    }
  },
  computed: mapGetters(["auth_user", "auth_token"]),
  mounted() {
    this.getAuthData();
  },  
  methods: {
    ...mapActions(["getAuthData", "destroyToken"]),
    async doLogout() {
      const auth_token = await this.auth_token
      axios
        .get(this.dynamic_auth_route("auth/logout"), {
          headers: {
            authorization: `Bearer ${auth_token}`,
          },
        })
        .then((res) => {
          if (res.data.status == "error") {
            this.openToast(res.data.message, 'danger');
          } else {
            this.openToast("Logout Successful", 'success');
            this.destroyToken();
            this.getAuthData();
            this.$router.push({ name: "Home" });
          }
        })
        .catch((error) => {
          this.openToast("An error occured. Please, try again.", 'danger');
          this.tokenExpired(error)
        });
    },
    menuNavigation(url){
      menuController.close("app-menu");
      this.$router.push(url);
    }
  }
});
</script>
<style scoped>
.main a {
  color: #555555 !important;
  font-size: 15px;
  padding-top: 12px;
  padding-bottom: 12px;
}
.main a:hover {
  text-decoration: none !important;
  background-color: #fff1e8;
}
.bg-light {
  background-image: linear-gradient(47deg, #f26b31, #4c1c80);
  color: #ffffff;
}
</style>