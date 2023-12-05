<template>
    <ion-grid class="products">
        <ion-row class="products-wrapper">
            <ion-col size="6" class="product-div" v-for="(product, i) in p_data" :key="i">
                <ion-card class="product-card">
                    <div @click="$router.push({name: 'SingleProduct', params:{product_id: product.item_id}})">
                        <img :src="product.image[0].image" :alt="product.name">
                        <ion-card-header class="product-header">
                            <h5 style="color: #222222 !important; font-weight: 500; font-size: 14px; margin-bottom: 0 !important; margin-top: 0 !important">
                                {{ product.name }}
                            </h5>
                        </ion-card-header>


                    </div>
                    <ion-card-content class="product-content">
                        <h6 style="font-size: 13px; margin-bottom: 1px !important; color: #222222 !important; font-weight: 500;">
                        &#8358; {{ Number(product.price).toLocaleString() }}
                        </h6>
                        <div class="item-rating" style="margin-top: 10px">
                        <span style="font-size: 13px; font-weight: 600; opacity: 0.5; color: #17a2b8">
                            <vue3-star-ratings
                                v-bind:increment="0.5"
                                v-bind:star-size="20"
                                :read-only="true"
                                v-model="product.product_rating[0].avg"
                                :show-rating="false"
                            />
                        </span>
                        </div>
                        <ion-button class="buy-button" expand="block" fill="outline" 
                        @click="
                            toggleProductDialog({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            product_type: [
                                product.allow_sharing,
                                product.sharing_limit,
                                product.quantity,
                                product.sharing_limit,
                            ],
                            })
                        "
                        >Buy Now</ion-button>
                    </ion-card-content>
                </ion-card>
            </ion-col>
        </ion-row>
    </ion-grid>
    <GDialog v-model="value" max-width="500" persistent>
        <OrderType v-if="value" :data="products" @close-dialog = "closeDialog" />
    </GDialog>  
</template>
<script>
import { defineComponent } from 'vue';

import vue3starRatings from "vue3-star-ratings";
import "gitart-vue-dialog/dist/style.css";
import { GDialog } from "gitart-vue-dialog";
import { IonGrid, IonRow, IonCol, IonButton, IonCard, IonCardHeader, IonCardContent } from '@ionic/vue';
import OrderType from '@/components/OrderType';
import { mapActions, mapGetters } from "vuex";
import axios from "axios";

export default defineComponent({
    name: "AllProducts",
    components: {
        "vue3-star-ratings" : vue3starRatings,
        IonGrid,
        IonRow,
        IonCol,
        IonButton,
        IonCard,
        IonCardContent,
        IonCardHeader,
        GDialog,
        OrderType,
    },
    data() {
        return {
            rating: 2.0,
            value: false,
            p_data: this.product_data,
            products:{}
        }
    },
    props:['product_data'],
    computed: {
        ...mapGetters(["auth_user", "auth_token", "loggedIn"]),
    },
    mounted() {
        this.getAuthData();
    },
    methods: {
        ...mapActions(["getAuthData"]),
        // buyNow() {
        //     this.value = true
        // },
        closeDialog() {
            this.products = {};
            this.value = false;
        },
        toggleProductDialog(data) {
            this.presentLoading('Processing');
            
            this.getAuthData();
           
            let payload = {
                _id: data.id,
                native_id: this.auth_user.id,
            };
            axios
            .post(
                this.dynamic_route("products/carts/check_for_duplicate"),
                payload,
                {
                headers: {
                    authorization: `Bearer ${this.auth_token}`,
                },
                }
            )
            .then((res) => {
                if (res.data !== 0) {
                return this.openToast("Selected item already exist in cart", "danger");
                }
                data.existed = false;
                this.products = data;
                this.value = true;

            })
            .catch(() => {
            this.openToast("Network error please try again later", "danger");
          }).finally(() => {
            this.dismissLoading();

          });
            // this.getAuthData();
            // if (this.loggedIn) {
            //     let payload = {
            //     _id: data.id,
            //     native_id: this.auth_user.id,
            //     };
            //     axios
            //     .post(
            //         this.dynamic_route("products/carts/check_for_duplicate"),
            //         payload,
            //         {
            //         headers: {
            //             authorization: `Bearer ${this.auth_token}`,
            //         },
            //         }
            //     )
            //     .then((res) => {
            //         if (res.data == 1) {
            //          this.openToast("Selected item already exist in cart", "danger")

            //          return ;
            //         }
            //         data.existed = false;
            //         // eslint-disable-next-line no-undef
            //         // eventBus.$emit("open-dialog", data);
            //     })
            //     .catch(() => {
            //         this.openToast("Network error please try again later", "danger")

               
            //         // eslint-disable-next-line no-undef
            //         // eventBus.$emit("close-dialog");
            //     });
            // } else {
            //     this.$router.push({ name: "Login" });
            // }
        },
    }
})
</script>
<style>
.products, .products-wrapper, .product-div {
  padding: 0 !important;
}
.product-card {
  background-color: #ffffff !important;
  --webkit-box-shadow: 0 4px 24px 0 rgb(34 41 47 / 10%) !important;
  box-shadow: 0 4px 24px 0 rgb(34 41 47 / 10%) !important;
}
.product-card img{
  min-height: 100px;
  object-fit: cover;
  max-width: 100%;
  max-height: 100px;
  width: 100%;
  margin-bottom: 0 !important;
  /* border-top-left-radius: 5px;
  border-top-right-radius: 5px; */
}
.product-content{
  padding: 5px 7px 0 !important;
}
.product-header{
  padding: 12px 7px 0 !important;
}
.product-header h5{
  width: 130px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.item-rating {
  margin-bottom: 10px;
}
.buy-button {
  font-size: 12px !important;
  padding-top: 3px !important;
  padding-bottom: 3px !important;
  margin-bottom: 10px;
}
.vue3-star-ratings {
    display: block !important;
    justify-content: left !important;
    align-items: left !important;
    margin-top: 10px;
}
.vue3-star-ratings__wrapper {
    margin: 0 !important;
    text-align: left !important;
    padding: 0 !important;
}
</style>
