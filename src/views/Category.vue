<template>
    <ion-page>
        <BaseLayout>
          <div v-if="status">
            <SkeletonText />
          </div>
          <div v-else>
            <div class="main">
                <div class="container mb-md-5">
                    <div class="font-weight-bold category-header">
                      <ion-button class="cat-btn" fill="clear" @click="this.$router.push('/')">
                          <i class="mdi mdi-arrow-left mr-3" style="margin-top: 0 !important"></i>
                          {{ this.$route.params.category_name }}
                      </ion-button>
                    </div>
                </div>
                   <!-- Categories section -->
                <section class="container categories">
                  <div class="row">
                    <!-- <div class="col-12">
                      <h5 class="font-weight-bold category-header">Shop by Categories</h5>
                    </div> -->
                    <div class="col-12">
                      <swiper
                      :autoplay="autoplay"
                        :loop="loop"
                        navigation
                        :slides-per-view="slidesPerView"
                        :space-between="spaceBetween"
                        @swiper="onSwiper"
                        @slideChange="onSlideChange"
                      >
                        <swiper-slide v-for="(pc, i) in allCategories" :key="i" >
                          <a style="text-decoration: none !important" :href="'/categories/' + pc.name + '/' + pc.id">
                            <img :src="pc.product_image">
                            <ion-card id="categoryLabel">
                              <ion-card-content class="label-content" style="text-align: center">
                                {{ pc.name }}
                              </ion-card-content>
                            </ion-card>
                          </a>
                        </swiper-slide>
                      </swiper>
                    </div>
                  </div>
                </section>
                <!-- End categories section -->
            </div>
            <!-- Products -->
            <div class="ion-padding">
              <MobileProductsByCategory :product_data="categoryProducts" />
            </div>
          </div>
        </BaseLayout>
    </ion-page>
</template>
<script>
import { defineComponent } from 'vue';
import { mapActions, mapGetters } from "vuex";
import axios from 'axios'
import { IonPage, IonCardContent, IonCard, IonButton } from '@ionic/vue';
import BaseLayout from '@/components/BaseLayout'
import MobileProductsByCategory from '@/components/MobileProductsByCategory'
// modules styles
import 'swiper/components/navigation/navigation.min.css'
import 'swiper/components/pagination/pagination.min.css'
import SwiperCore, { EffectFade, Pagination, Autoplay, Navigation } from "swiper"
SwiperCore.use([EffectFade, Pagination, Autoplay, Navigation])
// Import Swiper Vue.js components
import {Swiper, SwiperSlide} from 'swiper/vue';
import SkeletonText from '@/components/SkeletonText'

// Import Swiper styles
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'


export default defineComponent({
    computed: {
    ...mapGetters(["allCategories"]),
    },
    components: {
    BaseLayout,
    IonPage,
     Swiper,
     SwiperSlide,
     IonCard,
     IonCardContent,
     MobileProductsByCategory,
     SkeletonText,
    // IonIcon,
    IonButton
  },
   data() {
    return {
      categoryProducts: {},
      filters: {
        category: this.$route.params.category_id,
        sub_category_id: "",
        sort: "",
      },
      status: false,
      loop: true,
      effect: 'fade',
      navigation: true,
      centeredSlides: true,
      slidesPerView: 2,
      spaceBetween: 50,
      paginate: {
      clickable: true
      },
        autoplay: {
          delay: 3000,
        },
      };
  },
  mounted() {
    this.slidesPerView = 2
    this.getCategories(this.dynamic_route("products/categories/fetch"));
    this.getCategoryProducts(this.filters);
  },
  methods: {
    ...mapActions(["getCategories"]),
    getCategoryProducts(filters = null, page = 1) {
      this.status = true
      axios
        .post(this.dynamic_route("products/fetch?page=" + page), {
          filters: filters,
          client_pag: false,
        })
        .then((res) => {
          this.categoryProducts = res.data[1].original;
        })
        .catch((err) => {
          this.tokenExpired(err);
        })
        .finally(() => this.status = false );
    },
    onSwiper() {
    },
    onSlideChange() {
    },
  },
    
   
});
</script>
<style scoped>
.cat-details {
  border-radius: 2.8rem !important;
  width: 70%;
  margin: 0 auto !important;
  box-shadow: 0 0 40px rgb(0 0 0 / 10%) !important;
}

.cat-details .card-body {
  padding: 0.8rem 0.3rem 0.3rem !important;
}

.cat-btn {
  color: #000000 !important;
  font-weight: 500;
  font-size: 14px !important;
  margin-top: 10px;
}

.cat-details h6 {
  font-weight: 700;
}
.categories {
  padding-top: 10px;
  padding-bottom: 40px;
}
span.prev {
  position: absolute;
  left: 0;
  top: 0;
  margin-top: 150px;
  background-color: white;
  padding: 15px 18px;
  z-index: 1999;
  border-radius: 50%;
  font-weight: 700;
  box-shadow: 0 0 40px rgb(0 0 0 / 10%) !important;
  cursor: pointer;
}
span.next {
  position: absolute;
  right: 0;
  top: 0;
  margin-top: 120px;
  background-color: white;
  padding: 15px 18px;
  z-index: 1;
  border-radius: 50%;
  font-weight: 700;
  box-shadow: 0 0 40px rgb(0 0 0 / 10%) !important;
  cursor: pointer;
}
@media (max-width: 767.98px) {
  span.prev {
    margin-top: 80px;
  }

  span.next {
    margin-top: 80px;
  }
  .cat-details .card-body {
    padding: 0.8rem 0.9rem 0.3rem !important;
  }
  .cat-details h6 {
    font-weight: 600;
    font-size: 12px !important;
  }
  .categories {
    padding-top: 10px !important;
    padding-bottom: 30px !important;
  }
  .category-header {
    font-size: 22px !important;
  }
}
</style>