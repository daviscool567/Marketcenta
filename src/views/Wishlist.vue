<template>
    <ion-page>
        <BaseLayout>
            <div v-if="loading">
                <SkeletonText />
            </div>
            <div v-else>
                <ion-card class="wishlist">
                    <ion-card-content>
                        <h5 class="header-title">SAVED PRODUCTS</h5>
                        <div v-if="allSavedItems.length">
                            <div class="order-bg mb-3 mt-4" v-for="(saved, i) in allSavedItems" :key="i"> 
                                <div class="d-flex mobile-product">
                                    <div class="justify-content-start">
                                        <div class="product-image-inner">
                                            <div class="products-img-wrapper">
                                            <img
                                                :src="saved.image"
                                                :alt="saved.name"
                                                class="product-img img-fluid"
                                            />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="justify-content-end ml-2">
                                        <div class="product-content">
                                            <h5 class="mb-1" style="color: #222222 !important; font-weight: 500">
                                                {{ saved.name }}
                                            </h5>
                                            <h6>&#8358; {{ Number(saved.price).toLocaleString() }}</h6>
                                            <div class="d-flex mt-2">
                                                <ion-button
                                                    color="light"
                                                    class="btn mr-2"
                                                    @click="
                                                        removeFromSaved({
                                                            product_id: saved.p_id,
                                                            user_id: auth_user.id,
                                                        })
                                                    "
                                                >
                                                    <i class="mdi mdi-trash-can-outline"></i>
                                                    REMOVE
                                                </ion-button>
                                                <ion-button
                                                    color="primary"
                                                    class="btn"
                                                    @click="
                                                    toggleWhishlistDialog({
                                                        id: saved.p_id,
                                                        name: saved.name,
                                                        price: saved.price,
                                                        product_type: [
                                                        saved.allow_sharing,
                                                        saved.sharing_limit,
                                                        saved.quantity,
                                                        saved.sharing_limit,
                                                        ],
                                                    })
                                                    "
                                                >
                                                    BUY NOW
                                                </ion-button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="alert alert-info shadow-sm" v-else>
                            <p>No saved items found</p>
                        </div>
                    </ion-card-content>
                </ion-card>
                <GDialog v-model="value" max-width="500" persistent>
                    <OrderType @close-dialog = "closeDialog" :data="payload" />
                </GDialog>
            </div>
        </BaseLayout>
    </ion-page>
</template>

<script>
import { defineComponent } from 'vue'
import { IonPage, IonCard, IonCardContent, IonButton } from '@ionic/vue'
import axios from 'axios'
import { mapActions, mapGetters } from 'vuex'
import BaseLayout from '@/components/BaseLayout'
import { GDialog } from "gitart-vue-dialog";
import OrderType from '@/components/OrderType'
import SkeletonText from '@/components/SkeletonText'

export default defineComponent({
    components: {
        IonPage,
        IonCard,
        IonCardContent,
        IonButton,
        BaseLayout,
        GDialog,
        OrderType,
        SkeletonText,
    },
    data() {
        return {
            payload: {},
            allSavedItems: [],
            value: false,
            loading: false
        };
    },
    mounted() {
        this.getAuthData();
        this.getSavedItems({
            token: this.auth_token,
            id: this.auth_user.id,
        });
    },
    computed: {
        ...mapGetters(["auth_token", "auth_user", "loggedIn"]),
    },
    methods: {
        ...mapActions(["getAuthData"]),
        toggleWhishlistDialog(data) {
            let payload = {
                _id: data.id,
                native_id: this.auth_user.id,
            };
            axios
                .post(
                this.dynamic_route("products/carts/check_for_duplicate"),payload,
                {
                    headers: {
                        authorization: `Bearer ${this.auth_token}`,
                    },
                })
                .then((res) => {
                if (res.data == 1) {
                    this.openToast("Selected item already exist in cart", 'danger');
                    return;
                }
                    data.existed = false;
                    this.payload = data;
                    this.value = true;
                })
                .catch((err) => {
                    this.openToast("AN error occured. Please, try again.", 'danger');
                    this.tokenExpired(err);
                });
        },
        removeFromSaved(data) {
            axios
                .post(
                this.dynamic_route("products/saved_items/remove_saved_item"),
                data,
                {
                    headers: {
                    authorization: `Bearer ${this.auth_token}`,
                    },
                }
                )
                .then((res) => {
                    if (res.status == 201) {
                        this.getSavedItems({
                            token: this.auth_token,
                            id: this.auth_user.id,
                        });
                        this.openToast("Item removed from wishlist", 'success');
                    }
                })
                .catch((error) => {
                    this.openToast("AN error occured. Please, try again.", 'danger');
                    this.tokenExpired(error);
                });
        },
        getSavedItems(data) {
            this.loading = true
            axios
                .post(
                this.dynamic_route("products/saved_items/fetch"),
                { id: data.id },
                    {
                        headers: {
                        authorization: `Bearer ${data.token}`,
                        },
                    }
                )
                .then((res) => {
                    this.allSavedItems = res.data.data;
                })
                .catch((err) => {
                    this.tokenExpired(err);
                })
                .finally(() => this.loading = false);
        },
        closeDialog() {
            this.value = false
        }
    },
})
</script>
<style scoped>
.wishlist {
    margin-top: 40px;
}
.order-bg {
  border: 1px solid #777777;
  border-radius: 4px;
  border: 1px solid #ededed;
  padding: 6px 3px;
  word-break: break-all;
}
.header-title {
  font-weight: 650;
  font-size: 16px;
  margin-bottom: 20px;
  color: #444444;
}
.mobile-product {
  align-items: flex-start;
}
.product-image-inner {
  min-height: auto;
  color: #333333;
}
.products-img-wrapper {
  box-shadow: 0 0 1px 1px hsl(0deg 0% 0% / 5%);
  border-radius: 5px;
}
.mobile-product .products-img-wrapper,
#mobile-recommended .mobile-product .products-img-wrapper {
  width: 125px !important;
  height: 100px;
}
.item-img {
  border-bottom: 2px solid #f1f1f1;
}
.item-name {
  margin-top: 0 !important;
}
.mobile-product .product-img,
#mobile-recommended .mobile-product .product-img {
  max-height: 152px;
  min-height: 100px;
}

.product-img {
  object-fit: cover;
  max-width: 100%;
  max-height: 180px;
  width: 100%;
  margin-bottom: 0 !important;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}

.item-name a {
  font-weight: 600;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  text-decoration: none;
  color: #5f5d5d !important;
}

.product-content {
  position: relative;
}
.product-content h5 {
    font-size: 14px !important;
}
.product-content h6 {
  font-weight: 600;
  color: #555555;
  font-size: 16px !important;
  margin-top: 10px;
}
.wishlist .btn {
    font-size: 9px !important;
    padding: 0.25rem 0rem !important;
    box-shadow: none !important;
}
.card-body {
    padding: 1.2rem 0.9rem !important;
}
</style>
