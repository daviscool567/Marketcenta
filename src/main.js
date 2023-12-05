import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

import { IonicVue } from '@ionic/vue';
import VueClipboard from 'vue3-clipboard'

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import store from "./store/index";
import { toastController, loadingController } from '@ionic/vue';

//  navigation guards
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    //  Route requires AUth? Check if logged in. If not, redirect to login page
    if (!store.getters.loggedIn) {
      next({
        name: "Login",
      });
    } else {
      next();
    }
  } else if (to.matched.some((record) => record.meta.requiresVisitor)) {
    //  Route requires AUth? Check if logged in. If not, redirect to login page
    if (store.getters.loggedIn) {
      next({
        name: "Home",
      });
    } else {
      next();
    }
  } else {
    next(); // make sure to always call next()!
  }
});

const app = createApp(App)
  .use(IonicVue)
  .use(router)
  .use(store)
  .use(VueSweetalert2)
  .use(VueClipboard, {
    autoSetContainer: true,
    appendToBody: true,
  })
  
app.mixin({
  methods: {
    dynamic_route(endUrl) {
      return `https://api.marketcenta.com/api/client/${endUrl}`;
      // return `http://127.0.0.1:8000/api/client/${endUrl}`;
    },
    dynamic_auth_route(endUrl) {
      return `https://api.marketcenta.com/api/${endUrl}`;
      // return `http://127.0.0.1:8000/api/${endUrl}`;
    },
    async openToast(message, color) {
      const toast = await toastController.create({
        message: message,
        duration: 3000,
        color: color,
        position: 'top'
      });
      return toast.present();
    },
    async presentLoading(message) {
      const loading = await loadingController
        .create({
          cssClass: 'loading-class',
          message: `${message}. Please wait...`,
          spinner: 'circular',
          // duration: this.timeout,
        });
      await loading.present();
    },
    async dismissLoading(){
      await loadingController.dismiss()
    },
    tokenExpired(error) {
      if (
        error.response.status == 401 &&
        error.response.data.message == "Unauthenticated."
      ) {
        localStorage.removeItem("clientToken");
        localStorage.removeItem("clientDetails");
        location.reload();
      }
    },
  }
})

router.isReady().then(() => {
  app.mount('#app');
});