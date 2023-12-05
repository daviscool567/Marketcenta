<template>
     <ion-page>
        <BaseLayout>
            <div v-if="loading">
                <SkeletonText />
            </div>
            <div v-else> 
                <div class="main" v-if="single_data">
                    <div class="ion-padding">
                        <button type="button" class="btn" @click="this.$router.push('/')">
                            <i class="mdi mdi-arrow-left mr-2" style="vertical-align: middle !important"></i> <span style="font-size: 16px">Back</span> 
                        </button>
                    </div>
                    <div class="ion-padding">
                        <div class="product_imgs">
                            <ion-grid>
                                <ion-row>
                                    <ion-col size="12" >
                                        <div class="border-bottom box text-center" v-if="single_data.image">
                                            <span
                                            class="prev"
                                            @click="prev_item"
                                            v-show="img_ind != 0"
                                            ><i
                                                class="mdi mdi-arrow-left"
                                                style="vertical-align: middle; font-size: 20px"
                                                ></i
                                            ></span>
                                            <img
                                            
                                                class="img-fluid  prev_image"
                                                style="cursor: pointer;width:100%"
                                                :src="single_data.image[img_ind].image"
                                                alt="image"
                                            />
                                            <span
                                                class="next"
                                                    @click="next_item"
                                                
                                                ><i
                                                class="mdi mdi-arrow-right"
                                                style="vertical-align: middle; font-size: 20px"
                                                ></i
                                            ></span>
                                        </div>
                                        <div class="text-center mt-2" v-if="single_data.image">
                                            <span
                                                class="preview m-1"
                                                :class="{ active_i: img_ind == i }"
                                                v-for="(im, i) in single_data.image"
                                                style="cursor: pointer"
                                                :key="i"
                                                @click="img_ind = i"
                                                >
                                                <img class="img-fluid" :src="im.image" alt="" />
                                            </span>
                                        </div>
                                    </ion-col>
                                    <ion-col size="12">
                                        <div class="content_header pb-2 border-bottom mb-3 d-flex">
                                            <div>
                                                <p style="font-size: 1.2rem; margin-bottom: 0 !important">
                                                {{single_data.name}}
                                                </p>
                                                <div class="item-rating d-flex" v-if="single_data && single_data.rating && single_data.rating.avg">
                                                    <vue3-star-ratings
                                                        :step="0.5"
                                                        :starSize="18"
                                                        :disableClick="true"
                                                        :read-only="true"
                                                        v-model="avg"
                                                        :numberOfStars = 5  
                                                        :show-rating="false"
                                                        :showControl="false"
                                                        inactiveColor="#cccccc"
                                                    />
                                                </div>
                                                <span style="font-size: 13px; font-weight: 600; opacity: 0.9; color: #17a2b8" v-else>
                                                    No rating yet
                                                </span>
                                            </div>
                                            <span class="ml-auto">
                                                    <button
                                                    type="button"
                                                    class="btn mt-3"
                                                    :title="dynamicTitle(single_data.in_saved_items)"
                                                    @click="
                                                        toggleWishlist(
                                                        single_data.id,
                                                        single_data.in_saved_items
                                                        )
                                                    "
                                                    >
                                                    <span
                                                        class="mdi mdi-cards-heart-outline"
                                                        :class="{
                                                            'active-class':
                                                                single_data.in_saved_items == true,
                                                            'mdi mdi-heart-circle':
                                                                single_data.in_saved_items == false,
                                                            }"
                                                    ></span>
                                                    </button>
                                            </span>
                                        </div>
                                        <div class="price_n_checkout">
                                            <span
                                                style="font-size: 1.5rem; font-weight: bold"
                                                class="d-block"
                                                >₦ {{ Number(single_data.price).toLocaleString() }}</span
                                            >
                                            <ion-button
                                                color="primary"
                                                expand="block"
                                                class="
                                                mt-4 mb-3
                                                text-center
                                                "
                                                @click="
                                                toggleProductDialog({
                                                    id: single_data.id,
                                                    name: single_data.name,
                                                    price: single_data.price,
                                                    product_type: [
                                                    single_data.allow_sharing,
                                                    single_data.sharing_limit,
                                                    single_data.quantity,
                                                    single_data.sharing_limit,
                                                    ],
                                                })
                                                "
                                            >
                                                <i
                                                class="mdi mdi-cart-outline mr-1"
                                                aria-hidden="true"
                                                ></i>
                                                <span> Add to cart</span>
                                            </ion-button>
                                            </div>
                                            <div class="share my-3">
                                            <p style="font-size: 1.0rem; margin-top: 30px !important">Share this product</p>
                                            <a href="https://www.facebook.com/sharer/sharer.php?u=https://marketcenta.com" style="color: #3b5998 !important"><span class="mdi mdi-facebook"></span></a>
                                            <a href=" https://twitter.com/intent/tweet?text=Share+title&url=https://marketcenta.com" style="color: #8a3ab9 !important"> <span class="mdi mdi-instagram ml-3"></span></a>
                                            </div>
                                    </ion-col>
                                    <!-- <a class="bottom-fixed" href=""
                                    >Report incorrect product information</a
                                    > -->
                                </ion-row>
                            </ion-grid>
                            <div class="card">
                                <div class="card-header">
                                    <ion-segment v-model="tab">
                                        <ion-segment-button value="description">
                                            <ion-label class="segment-button">Descriptions</ion-label>
                                        </ion-segment-button>
                                        <ion-segment-button value="reviews">
                                            <ion-label class="segment-button">Reviews</ion-label>
                                        </ion-segment-button>
                                    </ion-segment>
                                </div>
                                <div class="card-body">
                                    <!-- Second Tap -->
                                    <div v-if="tab == 'description'" class="container ">
                                        <div
                                        class="container desc"
                                        v-html="single_data.description"
                                        ></div>
                                    </div>
                                    <!-- Third Tap -->
                                    <div v-else class="container">
                                        <section id="skills" class="skills section-bg">
                                        <div style="float: right; margin-bottom: 10px">
                                            <ion-button
                                            color="tertiary"
                                            size="small"
                                            @click="this.reviewOpen = true"
                                            >
                                            Write Review
                                            </ion-button>
                                        </div>
                                        <div class="row skills-content">
                                            <div class="col-12 col-lg-3">
                                            <div class="rating-main" data-vote="0">
                                                <div class="score">
                                                <p>
                                                    <span class="score-rating"> 0</span>
                                                    <span>/</span> <span class="total">5.0</span>
                                                </p>
                                                </div>
                                                <div class="no-ratings"><p>No ratings yet</p></div>
                                            </div>
                                            </div>
                                            <div class="col-12 col-lg-9 py-5">
                                            <div class="progress">
                                                <span class="skill"
                                                >5 Star <i class="val">0%</i></span
                                                >
                                                <div class="progress">
                                                <div
                                                    class="progress-bar"
                                                    style="width: 70%"
                                                ></div>
                                                </div>
                                            </div>
                                            <div class="progress">
                                                <span class="skill"
                                                >4 Star <i class="val">0%</i></span
                                                >
                                                <div class="progress-bar-wrap">
                                                <div
                                                    class="progress-bar"
                                                    role="progressbar"
                                                    aria-valuenow="80"
                                                    aria-valuemin="0"
                                                    aria-valuemax="100"
                                                ></div>
                                                </div>
                                            </div>
                                            <div class="progress">
                                                <span class="skill"
                                                >3 Star <i class="val">0%</i></span
                                                >
                                                <div class="progress-bar-wrap">
                                                <div
                                                    class="progress-bar"
                                                    role="progressbar"
                                                    aria-valuenow="80"
                                                    aria-valuemin="0"
                                                    aria-valuemax="100"
                                                ></div>
                                                </div>
                                            </div>
                                            <div class="progress">
                                                <span class="skill"
                                                >2 Star <i class="val">0%</i></span
                                                >
                                                <div class="progress-bar-wrap">
                                                <div
                                                    class="progress-bar"
                                                    role="progressbar"
                                                    aria-valuenow="80"
                                                    aria-valuemin="0"
                                                    aria-valuemax="100"
                                                ></div>
                                                </div>
                                            </div>
                                            <div class="progress">
                                                <span class="skill"
                                                >1 Star <i class="val">5%</i></span
                                                >
                                                <div class="progress-bar-wrap">
                                                <div
                                                    class="progress-bar"
                                                    role="progressbar"
                                                    aria-valuenow="55"
                                                    aria-valuemin="0"
                                                    aria-valuemax="100"
                                                ></div>
                                                </div>
                                            </div>
                                            </div>
                                        </div>
                                        </section>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Review modal -->
            <ion-modal :is-open = reviewOpen>
                <ion-content>
                    <ion-header>
                        <ion-toolbar>
                            <ion-title>Write your review</ion-title>
                            <ion-buttons slot="end">
                                <ion-button color="dark" @click="reviewOpen = false">
                                    <ion-icon slot="icon-only" :icon="closeOutline"></ion-icon>
                                </ion-button>
                            </ion-buttons>
                        </ion-toolbar>
                    </ion-header>

                    <div class="ion-padding">
                        <form @submit.prevent="submitReview">
                            <ion-item>
                                <ion-label position="floating">Review</ion-label>
                                <ion-textarea cols="30" rows="4" v-model="comment"></ion-textarea>
                            </ion-item>
                            <div class="mt-3">
                                <h6>Rate Product</h6>
                                <vue3-star-ratings
                                    :step="1"
                                    :starSize="40"
                                    v-model="rating"
                                    :numberOfStars = 5  
                                    :show-rating="false"
                                    :showControl="false"
                                    inactiveColor="#cccccc"
                                />
                            </div>
                            <div class="mt-5">
                                <ion-button
                                    class="mb-3"
                                    color="primary"
                                    type="submit"
                                    expand="block"
                                >
                                SUBMIT
                                </ion-button>
                                <ion-button style="margin-top: 15px" color="light" type="button" 
                                    @click="reviewOpen = false" expand="block">
                                CLOSE
                                </ion-button>
                            </div>
                        </form>
                    </div>
                </ion-content>
            </ion-modal>
        </BaseLayout>
     <GDialog v-model="value" max-width="500" persistent>
        <OrderType v-if="value" :data="products" @close-dialog = "closeDialog" />
    </GDialog>
    </ion-page>
</template>

<script>
import vue3starRatings from "vue3-star-ratings";
import { defineComponent } from "vue";
import { IonPage, IonCol, IonRow, IonGrid, IonSegment, IonButton, IonLabel, IonSegmentButton,
        IonModal, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonIcon, IonItem, IonTextarea } from '@ionic/vue';
import BaseLayout from '@/components/BaseLayout'
import axios from "axios";
import { closeOutline } from 'ionicons/icons';
import { mapActions, mapGetters } from "vuex";
import OrderType from '@/components/OrderType';
import { GDialog } from "gitart-vue-dialog";
import SkeletonText from '@/components/SkeletonText'

export default defineComponent({
    name: "View Product",
    components: {
        IonPage,
        BaseLayout,
        IonCol,
        IonRow,IonItem, IonTextarea,
        IonGrid, IonIcon,
        IonLabel, IonTitle, IonButtons,
        OrderType, IonContent, IonHeader,
        IonSegmentButton,IonModal, IonToolbar,
        GDialog,IonSegment, IonButton,SkeletonText,
        "vue3-star-ratings":vue3starRatings,
    },
    data() {
        return {
            closeOutline,
            avg:null,
            single_data:{},
            slideIndex: 1,
            img_ind: 0,
            curr_img: "",
            payload: {},
            rating: null,
            comment: "",
            dialogBox: false,
            value: false,
            tab: "description",
            reviewOpen: false,
            loading: false,
        }
    },
    computed: {
        ...mapGetters(["auth_user", "auth_token", "loggedIn"]),
    },
    mounted() {
        this.getAuthData();
        this.fetch_single();
    },
    methods: {
        ...mapActions(["getAuthData"]),

        async fetch_single() {
            this.loading = true;
            await axios
            .post(
            this.dynamic_route(`products/view`),
            {
                item_id: this.$route.params.product_id,
            },
            {
                headers: {
                authorization: `Bearer ${this.auth_token}`,
                },
            }
            )
            .then((res) => {
                this.single_data = res.data;
                this.avg = this.single_data.rating.avg
            })
            .catch((err) => {
                if (err.response.data == "Not found") {
                    this.$router.push({ name: "NotFound" });
                }
            })
            .finally(() => {
                this.loading = false
            });
        },
        submitReview() {
            this.presentLoading('Submitting');
            let form = new FormData();
            form.append("userId", this.auth_user.id);
            form.append("itemId", this.$route.params.product_id);
            form.append("comment", this.comment);
            form.append("rating", this.rating);

            axios
                .post(this.dynamic_route("products/review"), form, {
                    headers: {
                        authorization: `Bearer ${this.auth_token}`,
                    },
                })
                .then(() => {
                    this.openToast("Review submitted successfully", 'success');
                    this.reviewOpen = false;
                    this.fetch_single();
                })
                .catch(() => {
                    this.openToast("An error occured. Please, try again.", 'danger');
                })
                .finally(() => {
                    this.dismissLoading();
                });
        },
        dynamicTitle(status) {
            return status == true ? "Remove from wishlist" : "Add to wishlist"; 
        },
        toggleWishlist(product_id, status) {
            if (!status) {
                let payload = {
                user_id: this.auth_user.id,
                product_id,
                };
                axios
                .post(this.dynamic_route("products/saved_items/save_item"), payload, {
                    headers: {
                    authorization: `Bearer ${this.auth_token}`,
                    },
                })
                .then((res) => {
                    if (res.status == 201) {
                    this.fetch_single();
                    this.openToast("Item saved successfully", "success");
                   
                    return;
                    } else if (res.status == 203) {
                    //Duplicate entry
                    this.openToast(res.data.mssg, "info");
                 
                    return;
                    }
                    this.openToast("Something went wrong, try again later", "danger");
                   
                })
                .catch(() => {
                    this.openToast("Unable to save item, try again later", "danger");
                  
                });
            } else {
                let payload = {
                user_id: this.auth_user.id,
                product_id,
                };
                axios
                .post(
                    this.dynamic_route("products/saved_items/remove_saved_item"),
                    payload,
                    {
                    headers: {
                        authorization: `Bearer ${this.auth_token}`,
                    },
                    }
                )
                .then((res) => {
                    if (res.status == 201) {
                    this.fetch_single();
                    this.openToast("Item removed from wishlist", "success");
                    
                    return;
                    }
                    this.openToast("Something went wrong, try again later", "danger");
                })
                .catch(() => {
                    this.openToast("Unable to remove item, try again later", "danger");
                });
            }
        },
        toggleProductDialog(data) {
            this.getAuthData();
            this.presentLoading("Processing");
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
            this.openToast("An error occured please try again later", "danger");
          }).finally(() => this.dismissLoading());
        },
        closeDialog() {
            this.products = {};
            this.value = false;
        },
        prev_item() {
            if (this.img_ind !== 0) {
                this.img_ind--;
            }
        },
        next_item() {
            if (this.img_ind !== this.single_data.image.length - 1) {
                this.img_ind++;
            } else {
                this.img_ind = 0;
            }
        },
    },
});
</script>
<style>
.active-class {
  color: #f26b31;
}
.box {
  width: 100%;
  height: 250px;
  overflow: hidden;
}

.prev_image {
  border-style: none;
  display: block;
  height: 15rem;
  /* -o-object-fit: contain; */
  object-fit: contain;
  width: 100%;
}

.preview {
  border: 1px solid gray;
  display: inline-block;
  width: 15%;
  margin-right: 10px;
  height: 100%;
}
.active_i {
  border: 2px solid  yellowgreen;
}
.item-rating .mdi {
  font-size: 14px !important;
  color: #f6b01e !important;
}
.list-inline {
  flex-direction: row;
}

ul.list-inline li {
  display: inline-block;
}

.active-class {
  color: #f26b31;
}

.desc p img {
  width: 100% !important;
}
.skills .progress {
  height: 60px;
  display: block;
  background: none;
  border-radius: 0;
}
.skills .progress .skill {
  padding: 10px 0;
  margin: 0;
  text-transform: uppercase;
  display: block;
  font-weight: 600;
  font-family: "Poppins", sans-serif;
  color: #45505b;
}
.skills .progress .skill .val {
  float: right;
  font-style: normal;
}
.skills .progress-bar-wrap {
  background: #f2f3f5;
}
.skills .progress-bar {
  width: 1px;
  height: 10px;
  transition: 0.9s;
  background-color: #0563bb;
}
.review-popup label {
  color: #4f4f4f;
  font-size: 14px;
  margin-bottom: 5px;
  display: block;
}
section.rating-widget {
  position: relative;
  width: 42%;
  margin: 0 0 0 0;
}
.rating-stars ul {
  list-style-type: none;
  padding: 0;
  -moz-user-select: none;
  -webkit-user-select: none;
  margin-bottom: 0;
}
.rating-stars ul > li.smallstar {
  display: inline-block;
  cursor: pointer;
}
.post-review {
  width: 100%;
  height: 30px;
  margin-right: 0px;
  display: inline-block;
  font-weight: 700;
}
.score {
  display: flex;
}
.score-rating {
  font-size: 40px;
  font-weight: 600;
}

span.prev {
  position: absolute;
  left: 0;
  top: 0;
  margin-top: 118px;
  background-color: white;
  padding: 15px 18px;
  z-index: 1 !important;

  border-radius: 50%;
  font-weight: 700;
  box-shadow: 0 0 40px rgb(0 0 0 / 10%) !important;
  cursor: pointer;
}
span.next {
  position: absolute;
  right: 5%;
  top: 5%;
  margin-top: 100px;
  background-color: white;
  padding: 15px 18px;
  z-index: 1 !important;
  border-radius: 50%;
  font-weight: 700;
  box-shadow: 0 0 40px rgb(0 0 0 / 10%) !important;
  cursor: pointer;
}
.btn {
    background: transparent !important;
    padding: 2px !important;
}
</style>
