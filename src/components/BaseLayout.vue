<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="tertiary">
        <ion-buttons slot="start">
          <ion-menu-button menuId="custom-menu" color="light"></ion-menu-button>
        </ion-buttons>
        <ion-title>
          <h5 style="letter-spacing: 0.5px">
            Market<span style="color: #f26b31">Centa</span>
          </h5>
        </ion-title>
        <ion-buttons slot="end">
          <ion-button color="light" @click="open=true">
            <ion-icon slot="icon-only" :icon="search"></ion-icon>
          </ion-button>
          <ion-button color="light" @click="navigate('/cart')">
            <ion-icon slot="icon-only" :icon="cartOutline"></ion-icon>
          </ion-button>
           <ion-badge
              color="primary"
              class="mobile-cart-number"
              style="font-style: normal"
              v-if="cartCount > 0"
              >{{ cartCount }}
            </ion-badge>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-refresher slot="fixed" @ionRefresh="doRefresh">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <slot></slot>
    </ion-content>

    <ion-modal :is-open = open>
        <ion-content>
            <div class="search-box">
              <div class="d-flex">
                <i class="mdi mdi-arrow-left mt-3" @click="dismissSearchModal"></i>
                <span class="ml-3" style="width: 100%">
                  <ion-item>
                    <ion-input clear-input placeholder="Search products..." v-model="filters.search" @ionChange="searchProducts">
                    </ion-input>
                  </ion-item>
                </span>
              </div>
            </div>

            <div class="px-3">
              <div class="" v-if="searched_data.length">
                <small class="text-muted ml-3">
                  {{ searched_data.length }} Result<span v-if="searched_data.length > 1">s</span> found
                </small>
                <ul class="list-unstyled mt-2 pl-3">
                  <li
                    v-for="(data, i) in searched_data"
                    :key="i"
                    class="search_li mb-2"
                  >
                    <p class="">
                      <a
                        style="text-decoration: none !important"
                        :href="'/view/'+data.item_id"
                        class="text-decoration-none"
                      >
                        <img
                          :src="data.image[0].image"
                          :alt="data.name"
                          class="img-fluid searched_img"
                          style="width: "
                        />
                        {{ data.name }}
                      </a>
                    </p>
                  </li>
                </ul>
              </div>
            </div>
        </ion-content>
    </ion-modal>
  </ion-page>
</template>
<script>
// import Navbar from '@/components/BaseLayout/Navbar';
import { defineComponent } from 'vue';
import { 
  IonPage, IonHeader, IonTitle, IonToolbar,  IonButtons, IonModal, IonItem, IonRefresherContent,
  IonMenuButton, IonContent, IonButton, IonIcon, IonBadge, IonInput, IonRefresher } from '@ionic/vue';
import { search, cartOutline } from 'ionicons/icons';
import { mapGetters, mapActions } from "vuex";
import axios from 'axios'

export default defineComponent({
  name: 'Home',
  components: {
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonPage,
    IonContent,
    IonBadge,
    IonModal,
    IonButton,
    IonIcon,
    IonInput,
    IonItem,
    IonRefresher,
    IonRefresherContent,
  },
  data() {
    return {
      search,
      cartOutline,
      open: false,
      filters: {},
      searched_data: [],
    }
  },
  computed: mapGetters(["auth_user", "auth_token", "loggedIn", "cartCount"]),
  mounted() {
    if (this.loggedIn) {
      this.getAuthData();
      this.getCarts(this.auth_user.id)
    }
  },
  methods: {
    ...mapActions(["getAuthData", "getCarts"]),
    searchProducts() {
      if (this.filters.search && this.filters.search != "") {
        axios
          .post(this.dynamic_route("products/fetch"), {
            filters: this.filters,
            not_paginated: true,
          })
          .then((res) => {
            this.searched_data = res.data[1].original;
          })
          .catch(() => {});
      } else {
        this.searched_data = [];
      }
    },
    viewProduct(id) {
      this.dismissSearchModal()
      this.$router.push({ name: 'SingleProduct' , params: { product_id: id }})
    },
    dismissSearchModal() {
      this.open = false
    },
    navigate(url) {
      this.$router.push(url);
    },
    doRefresh() {
      location.reload()
    }
  }
});
</script>

<style scoped>
.mobile-cart-number {
  border-radius: 50% !important;
  font-weight: 400 !important;
  font-size: 10px !important;
  padding: 3px 5px !important;
  position: absolute;
  right: 0;
  bottom: 0;
  margin-right: 8px;
  margin-bottom: 28px;
}
.search-box {
  padding: 15px 10px !important;
}
.search-dropdown {
  max-height: 215px !important;
  overflow-x: hidden;
  position: absolute;
  width: 450px;
  background: #ffffff;
  z-index: 1;
  padding: 0 10px !important;
  border-radius: 0 0 5px 5px;
  box-shadow: 0 1px 2px 0 hsl(0deg 0% 0% / 16%);
  max-height: 200px;
}

.search-dropdown {
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */
  overflow: -moz-scrollbars-none;
}
.search-dropdown::-webkit-scrollbar {
  display: none; /* Safari and Chrome */
}

.searched_img {
  margin-right: 8px !important;
}
.searched_img {
  min-height: 30px !important;
  width: 40px !important;
  border-radius: 5px !important;
  object-fit: cover !important;
}
.searched_img {
  vertical-align: middle !important;
  border-style: none !important;
}

.search_li {
  width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  transition: 0.2s ease-out;
}

.search_li:hover {
  transform: scaleX(1.1) !important;
}
</style>