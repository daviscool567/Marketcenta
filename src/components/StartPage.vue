<template>
  <ion-page>
    <ion-content fullscreen scroll-y="false" style="height: 100% !important">
        <div class="text-center start-page">
          <swiper
            v-if="dummy.length"
            :autoplay="false"
            :loop="loop"
            :pagination="paginate"
            :slides-per-view="slidesPerView"
            :space-between="spaceBetween"
            :observer="true"
            :observeParents="true"
            @swiper="onSwiper"
            @slideChange="onSlideChange"
          >
              <swiper-slide>
                  <div class="float-right">
                    <ion-button @click="goTo()" fill="clear">SKIP</ion-button>
                  </div>
                  <img src="../assets/images/go_shopping.jpg" class="mt-3"  width="100"/>
                  <h4>Go shopping with Marketcenta</h4>
                  <p>
                    Shop as guest or as a subscribed Member by making a single
                    purchase Or a group by selecting varieties of Quality
                    Products
                  </p>
              </swiper-slide>
              <swiper-slide>
                  <div class="float-right">
                    <ion-button @click="goTo()" fill="clear">SKIP</ion-button>
                  </div>
                  <img src="../assets/images/sharepay.png" class="mt-3" />
                  <h4>Customize how you shop</h4>
                  <p>
                      Buy together and pay less. You can shop and split payments
                      with friends & families. You can even buy on credit and pay later.
                  </p>
              </swiper-slide>
              <swiper-slide>
                  <img src="../assets/images/delivery2.png" class="mt-3"/>
                  <h4>Get it Delivered</h4>
                  <p>
                    Save time and money. You can pick up your product at our Pick
                    up points or you choose to get it delivered to you Door
                    step.
                  </p>
                  <ion-button @click="goTo()" fill="clear">Get Started <i class="mdi mdi-arrow-right ml-2"></i></ion-button>
              </swiper-slide>
              <!-- <swiper-slide>
                  <img src="../assets/images/avatar.jpg" />
                  <h4>Ready to Play?</h4>
                  <ion-button fill="clear">Continue <ion-icon slot="end" name="arrow-forward"></ion-icon></ion-button>
              </swiper-slide> -->
          </swiper>
        </div>
    </ion-content>
  </ion-page>
</template>
<script>
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue';

// Import Swiper styles
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'

// modules styles
import 'swiper/components/navigation/navigation.min.css'
import 'swiper/components/pagination/pagination.min.css'
import SwiperCore, { EffectFade, Pagination, Autoplay, Navigation } from "swiper"
SwiperCore.use([EffectFade, Pagination, Autoplay, Navigation])

import { defineComponent } from 'vue'
import  { IonButton, 
IonContent,
 IonPage } from '@ionic/vue'

export default defineComponent({
  components: {
    IonButton,
    IonContent,
    Swiper,
    SwiperSlide,
    IonPage
  },
  props: {
  },
  data() {
    return {
      loop: false,
      navigation: true,
      centeredSlides: true,
      slidesPerView: 1,
      spaceBetween: 50,
      paginate: {
        clickable: true
      },
      bannerAutoplay: {
        delay: 4000,
      },
      dummy: {},
    };
  },
  mounted() {
    // this.getAuthData();
    this.getDum();
    this.slidesPerView = 1;
  },
  methods: {
    onSwiper() {
    },
    onSlideChange() {
    },
    goTo() {
      this.$emit('close-start-page')
    },
    getDum() {
      this.dummy = [1];
    }
  },
});
</script>
<style>
.start-page {
  height: 100% !important;
  margin-top: 10px;
}
.start-page .swiper-container {
  padding-bottom: 150px !important;
}

.start-page .swiper-container .swiper-pagination .swiper-pagination-bullet {
  background-color: #f26b31 !important;
  border: 2px solid white !important;
  width: 12px !important;
  height: 12px !important;
}

.swiper-slide h4 {
    font-weight: 500;
    margin-top: 2.5rem;
    color: #000000 !important;
}

.swiper-slide b {
    font-weight: 500;
}

.swiper-slide p {
    padding: 0 30px;
    font-size: 15px;
    line-height: 1.7;
    color: var(--ion-color-step-600, #19191a);
}
</style>
