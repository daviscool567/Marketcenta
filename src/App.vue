<template>
  <ion-app>
      <div v-if="show">
        <StartPage v-if="show" @close-start-page="setShow" />
      </div>
      <SideBar v-else>
        <ion-router-outlet id="main-content"></ion-router-outlet>
      </SideBar>
  </ion-app>
</template>

<script>
import { 
  IonApp, IonRouterOutlet} from '@ionic/vue';
import { defineComponent } from 'vue';
import SideBar from '@/components/SideBar'
import { PushNotifications } from '@capacitor/push-notifications';
import { mapActions, mapGetters } from "vuex";
import StartPage from '@/components/StartPage'
import axios from "axios";

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet,
    SideBar,
    StartPage,
  },
  data() {
    return {
      // fcm: new FCM()
      show: true,
    }
  },
  computed: mapGetters(["auth_token", "auth_user"]),
  mounted() {
    this.getAuthData();
    this.checkStatus()
    setInterval(() => {
      this.checkUnpaidCredit();
    }, 300000);
    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermission().then(result => {
      console.log('result ' + JSON.stringify(result));
      // Initialize the registration with FCM Token
      PushNotifications.register();
    });

    // Add registration error if there are.
    PushNotifications.addListener("registrationError", (error) => {
      console.log(`error on register ${JSON.stringify(error)}`);
    }),
    
    // Add Notification received
    PushNotifications.addListener(
      "pushNotificationReceived",
      (notification) => {
        console.log(`notification ${JSON.stringify(notification)}`);
      }
    ),
              
    // Add Action performed
    PushNotifications.addListener(
      "pushNotificationActionPerformed",
      async (notification) => {
          // alert("notification " + notification)
        console.log(notification.notification.data);
      }
    ),
            
    // On registration we can get the token
    PushNotifications.addListener('registration', (token) => {
      console.log('Push registration success, token: ' + token.value);
      //TODO: store token server side?
    });
  },
  methods: {
    ...mapActions(["getAuthData"]),
    checkUnpaidCredit() {
      axios
        .post(
          this.dynamic_route("products/orders/credit/check_payment"),
          { userId: this.auth_user.id },
          {
            headers: {
              authorization: `Bearer ${this.auth_token}`,
            },
          }
        )
        .then((res) => {
          this.creditOrders = res.data;
        })
        .catch((error) => {
          this.tokenExpired(error);
        });
    },
    checkStatus() {
      const showStatus = localStorage.getItem('showStatus');
      if(!showStatus || showStatus == false) {
        this.show = true
      } else {
        this.show = false
      }
    },
    setShow() {
      localStorage.setItem('showStatus', false)
      this.show = false
    }
  }
});
</script>
<style scoped>

</style>