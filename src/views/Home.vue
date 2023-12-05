<template>
  <ion-page>
    <BaseLayout>
      <div class="home-wrapper" v-if="!status">
        <!-- Page banner -->
        <div class="banner">
          <swiper
              :autoplay="bannerAutoplay"
              :loop="loop"
              :effect="effect"
              :pagination="paginate"
              :slides-per-view="slidesPerView"
              :space-between="spaceBetween"
              @swiper="onSwiper"
              @slideChange="onSlideChange"
              :observer="true"
              :observeParents="true"
              v-if="allBanners.length"
            >
              <swiper-slide v-for="(banner, i) in allBanners" :key="i">
                <img :src="banner.image">
              </swiper-slide>
            </swiper> 
        </div>

        <!-- User Options -->
        <!-- <div>
          <ion-grid>
            <ion-row>
              <ion-col size="4">
                <div style="text-align: center" @click="navigate('/refer')">
                  <ion-button color="success" id="refer">
                  <i class="mdi mdi-cash-multiple"></i>
                  </ion-button>
                  <p style="font-size: 13px;margin-top: 8px;font-weight: 600;color: #444444;">
                    Refer & Earn
                  </p>
                </div>
              </ion-col>
              <ion-col size="4">
                <div style="text-align: center" @click="navigate('/wishlist')">
                  <ion-button color="primary" id="refer">
                    <i class="mdi mdi-heart"></i>
                  </ion-button>
                  <p style="font-size: 13px;margin-top: 8px;font-weight: 600;color: #444444;">
                    Save for later
                  </p>
                </div>
              </ion-col>
              <ion-col size="4">
                <div style="text-align: center" @click="navigate('/partner')">
                  <ion-button color="secondary" id="refer">
                    <i class="mdi mdi-handshake"></i>
                  </ion-button>
                  <p style="font-size: 13px;margin-top: 8px;font-weight: 600;color: #444444;">
                    Partner
                  </p>
                </div>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div> -->
        <!-- Categories slide -->
        <div class="categories">
            <div style="margin: 30px 0 20px !important">
              <h6 style="font-weight: 600; font-size: 14px">
              Shop by Categories
            </h6>
            </div>
            <swiper
              :autoplay="autoplay"
              :loop="loop"
              navigation
              :slides-per-view="slidesPerView"
              :space-between="spaceBetween"
              @swiper="onSwiper"
              @slideChange="onSlideChange"
              :observer="true"
              :observeParents="true"
              v-if="allCategories != ''"
            >
              <swiper-slide v-for="(pc, i) in allCategories" :key="i" >
                <span @click="$router.push({name: 'ProductCategory', params: { category_name: pc.name, category_id: pc.id }})">
                  <img :src="pc.product_image">
                  <ion-card id="categoryLabel">
                    <ion-card-content class="label-content" style="text-align: center">
                      {{ pc.name }}
                    </ion-card-content>
                  </ion-card>
                </span>
                
              </swiper-slide>
            
            </swiper>
        </div>

        <!-- Products -->
        <div class="products-main">
            <div class="sticky-top">
              <div class="float-right mt-3" @click="open=true" style="color: #555555">
                <i class="mdi mdi-filter-variant "></i> Filter
              </div>
              <ion-segment v-model="tab">
                  <ion-segment-button value="all">
                      <ion-label class="segment-button">ALL</ion-label>
                  </ion-segment-button>
                  <ion-segment-button value="recommended">
                      <ion-label class="segment-button">RECOMMENDED</ion-label>
                  </ion-segment-button>
              </ion-segment>
            </div>
            <br>
            <div>
              <div v-if="tab=='all'">
                  <AllProducts v-if="allProducts.length" :product_data="allProducts"/>
                  <!-- <ion-content> -->
                    <ion-infinite-scroll
                        @ionInfinite="ionInfinite" 
                        :disabled="isDisabled"
                      >
                        <ion-infinite-scroll-content
                          loading-spinner="circular"
                          loading-text="Loading more data...">
                        </ion-infinite-scroll-content>
                    </ion-infinite-scroll>
                  <!-- </ion-content> -->
              </div>
              <div v-if="tab=='recommended'">
                  <RecommendedProducts v-if="recomended_data.length" :product_data="recomended_data" />
                  <!-- <ion-content> -->
                    <ion-infinite-scroll
                      @ionInfinite="ionInfinite" 
                      :disabled="isRecDisabled"
                    >
                      <ion-infinite-scroll-content
                        loading-spinner="circular"
                        loading-text="Loading more data...">
                      </ion-infinite-scroll-content>
                    </ion-infinite-scroll>
                  <!-- </ion-content> -->
              </div>
            </div>
        </div>
      </div>
      <div v-else>
        <SkeletonText />
      </div>

      <ion-modal :is-open = open>
        <ion-content>
            <div class="filter-box">
              <div>
                <i class="mdi mdi-arrow-left mt-3 mb-2" @click="dismissFilterModal"></i> Filter
                <span style="width: 100%">
                  <ion-item class="mt-2">
                    <ion-label>Category</ion-label>
                    <ion-select v-model="filters.category" @ionChange="getSubCategories(filters.category)" 
                        ok-text="Select" cancel-text="Cancel" required>
                        <ion-select-option v-for="(c, i) in allCategories" :value="c.id" :key="i">
                            {{ c.name }}
                        </ion-select-option>
                    </ion-select>
                  </ion-item>
                  <ion-item class="mt-2">
                    <ion-label>Sub-Category</ion-label>
                    <ion-select v-model="filters.sub_category_id" @ionChange="getFilteredProducts(filters)"
                        ok-text="Select" cancel-text="Cancel" required>
                        <ion-select-option v-for="(sub, i) in subCategories" :value="sub.id" :key="i">
                            {{ sub.name }}
                        </ion-select-option>
                    </ion-select>
                  </ion-item>
                  <ion-item class="mt-2">
                    <ion-label>Sort By</ion-label>
                    <ion-select v-model="filters.sort" @ionChange="getFilteredProducts(filters)"
                        ok-text="Select" cancel-text="Cancel" required>
                        <ion-select-option value="low">
                            Price (Low to High)
                        </ion-select-option>
                        <ion-select-option value="high">
                            Price (High to Low)
                        </ion-select-option>
                    </ion-select>
                  </ion-item>
                </span>
              </div>
            </div>
            <div class="fixed-bottom filter-box">
              <ion-button color="primary" expand="block" @click="open=false">
                APPLY
              </ion-button>
            </div>
        </ion-content>
      </ion-modal>
    </BaseLayout>
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


import BaseLayout from '@/components/BaseLayout'
import { defineComponent } from 'vue';
import { IonPage, 
        // IonGrid, IonRow, IonCol, 
        IonButton, IonCard, IonCardContent, IonItem, IonSelect, IonSelectOption,
        IonSegment, IonSegmentButton, IonLabel, IonModal, IonContent, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/vue';
import AllProducts from '@/components/AllProducts'
import RecommendedProducts from '@/components/RecommendedProducts'
import SkeletonText from '@/components/SkeletonText'
import axios from 'axios'
import { mapActions, mapGetters } from 'vuex'
// IonIcon
// import { cashOutline, heartOutline } from 'ionicons/icons';

export default defineComponent({
  name: 'Home',
  components: {
    BaseLayout,
    IonPage,
    Swiper,
    SwiperSlide,
    // IonGrid, 
    IonInfiniteScrollContent,
    // IonRow,
    IonInfiniteScroll, 
    // IonCol,
    IonItem, IonSelect,
    IonButton, IonSelectOption,
    IonCard, IonContent,
    IonCardContent, IonModal,
    IonSegment, IonSegmentButton, IonLabel,
    AllProducts, SkeletonText, RecommendedProducts,
    // IonIcon,
  },
  data() {
    return {
      // cashOutline,
      // heartOutline,
      loop: true,
      effect: 'fade',
      navigation: true,
      centeredSlides: true,
      slidesPerView: 2,
      spaceBetween: 50,
      filters: { category: "", sub_category_id: "", sort: "" },
      paginate: {
        clickable: true
      },
      autoplay: {
        delay: 3000,
      },
      bannerAutoplay: {
        delay: 4000,
      },
      allBanners:[],
      allProducts: [],
      recomended_data: [],
      partners_data: [],
      allProductsCount: null,
      recProductsCount: null,
      tab: "all",
      open: false,
      status: false,
      products: [],
      page: 1,
      isDisabled: false,
      isRecDisabled: false,
    }
  },
  computed: {
    ...mapGetters(["allCategories", "subCategories"]),
    
  },
  created() {
    this.slidesPerView = 2
  },
  mounted() {
    // this.getAllProducts();
    this.getAuthData()
    this.fetchBanner();
    this.getProducts();
    this.getCategories(this.dynamic_route("products/categories/fetch"));
  },
  methods: {
    ...mapActions(["getAuthData","getCategories", "getSubCategories"]),
    onSwiper() {
    },
    onSlideChange() {
    },
    fetchBanner() {
      this.status = true
      axios
        .get(this.dynamic_route("products/banners/fetch"))
        .then((res) => {
          this.allBanners = res.data;
       
        })
        .catch(() => {
          // toastr.error("An error occured, unable to fetch banners");
        })
        .finally(() => this.status = false);
    },
    // n
    async getProducts(filters = null) {
      //  this.status = true
      await axios
        .post(this.dynamic_route("products/fetch?page=" + this.page), {
          filters: filters,
          client_pag: true,
        })
        .then((res) => {
          this.allProductsCount = res.data[1].original.total;
          this.recProductsCount = res.data[1].original.total;

          res.data[1].original.data.forEach(element => {
            this.allProducts.push(element)
          });
          res.data[0].data.forEach(element => {
            this.recomended_data.push(element)
          });
          // this.recomended_data = res.data[0];
          this.partners_data = res.data[2];
          this.page = this.page + 1;
        })
        .catch((err) => {
          this.tokenExpired(err);
        })
        .finally(() => {
          if (this.allProducts.length == this.allProductsCount) {
            this.isDisabled = true
          }
          if (this.recomended_data.length == this.recProductsCount) {
            this.isRecDisabled = true
          } 
        });
    },
    async ionInfinite(ev) {
      await this.getProducts()
      ev.target.complete()
      // setTimeout(() => ev.target.complete(), 3000);
    },
    getAllProducts() {
      this.status = true
      axios
        .post(this.dynamic_route("products/fetch?page=" + this.page), {
          not_paginated: true,
        })
        .then((res) => {
          this.allProductsCount = res.data[1].original.total;
          this.recProductsCount = res.data[1].original.total;
        })
        .catch((err) => {
          this.tokenExpired(err);
        })
        .finally(() => this.status = false);
    },
    getFilteredProducts(data) {
      this.page = 1
      this.allProducts = []
      this.getProducts(data)
    },
    navigate(url){
        this.$router.push(url);
    },
    dismissFilterModal() {
      this.open = false
    },
  }
});
</script>

<style>
.banner {
  margin: 10px 0;
}
.home-wrapper {
  --padding-start: 16px !important;
  --padding-end: 16px !important;
  -webkit-padding-start: 16px;
  -webkit-padding-end: 16px;
}
.banner .swiper-container {
  border-top-right-radius: 8px !important;
  border-top-left-radius: 8px !important;
  border-bottom-right-radius: 13px !important;
  border-bottom-left-radius: 13px !important;
}
.banner .swiper-container .swiper-pagination .swiper-pagination-bullet {
  background-color: #f26b31 !important;
  border: 2px solid white !important;
  width: 12px !important;
  height: 12px !important;
}
.categories .swiper-container .swiper-button-prev {
  left: 0 !important;
}
.categories .swiper-container .swiper-button-next {
  right: 0 !important;
}
.categories .swiper-container .swiper-button-prev,
.categories .swiper-container .swiper-button-next {
  /* background-color: white !important; */
  /* padding: 30px 30px !important;
  border-radius: 50% !important;
  font-weight: 700; */
  color: #f26b31 !important;
  /* box-shadow: 0 0 40px rgb(0 0 0 / 10%) !important; */
}
.swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
#refer {
  --border-radius: 50%;
  font-size: 22px;
  height: 42px !important;
  --padding-start: 10px !important;
  --padding-end: 10px !important;
  /* width: 10px; */
}
#categoryLabel {
  border-radius: 40px !important;
  background-color: #ffffff !important;
}
.label-content {
  padding-top: 5px !important;
  padding-bottom: 5px !important;
  font-weight: 600;
  color: #333333;
  font-size: 9px;
}
.products-main {
  margin-top: 40px; 
}
.filter-box {
  padding: 15px 10px !important;
}
</style>