<template>
  <ion-page>
    <BaseLayout>
      <div v-if="loading">
        <SkeletonText />
      </div>
      <div v-else class="main">
        <div class="ion-padding">
          <div class="" v-if="sharingLimit">
            <div class="container text-center" style="padding-top:100px">
              <img src="../assets/images/sorry.png" alt="Not allowed image" style="width:100px">
              <p class="text-warning display-3">Whoops!</p>
              <p class="p-2 shadow-sm">
                This product has exceeded its sharing limit.
              </p>

            </div>
          
          </div>
          <div style="height:100vh"  v-else-if="not_allowed">
            <div class="container text-center" style="padding-top:100px">
              <img src="../assets/images/sorry.png" alt="Not allowed image" style="width:100px">
              <p class="text-warning display-3">Whoops!</p>
              <p class="p-2 shadow-sm">
              You are not allowed to view this product
              </p>

            </div>
          </div>
          <ion-grid
            class="col-md-12"
            v-else-if="single_data && (notFound == false || sharingLimit == false)"
          >
            <ion-row>
              <ion-col  size="12">
                <ion-row>
                  <ion-col size="11">
                    <div class="box text-center border-bottom pb-3 mb-2" v-if="single_data.image">
                      <span
                        class="prev"
                        @click="prev_item"
                        v-show="img_ind != 0"
                        ><i
                          aria-hidden="true"
                          class="mdi mdi-arrow-left"
                          style="vertical-align: middle; font-size: 20px"
                        ></i
                      ></span>
                      <img
                        class="img-fluid w-100 prev_image"
                        style="cursor: pointer"
                        :src="single_data.image[img_ind].image"
                        @click="full_view(single_data.image[img_ind].image)"
                        alt=""
                      />
                      <span
                        data-v-fae5bece=""
                        class="next"
                        @click="next_item"
                        v-show="img_ind != single_data.image.length - 1"
                        ><i
                          aria-hidden="true"
                          class="mdi mdi-arrow-right"
                          style="vertical-align: middle; font-size: 20px"
                        ></i
                      ></span>
                    </div>
                    <div class="text-center">
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
                </ion-row>
              </ion-col>
              <ion-col size="12">
                <div class="content_header pb-2 border-bottom mb-3" >
                  <p class="text-right">
                    <button
                      type="button"
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
                  </p>
                  <p style="font-size: 1.3rem">
                    {{ single_data.name }}
                  </p>
                  <div class="item-rating d-flex">
                    <vue3-star-ratings
                      v-bind:increment="0.5"
                      v-bind:star-size="20"
                      :read-only="true"
                      v-model="avg"
                      :show-rating="false"
                  />
                  </div>
                </div>
                <div class="price_n_checkout" v-if="single_data.name">
                  <span
                    style="font-size: 1.5rem; font-weight: bold"
                    class="d-block"
                    >₦ {{ single_data.price.toLocaleString() }}</span
                  >
                  <!-- <span class="text-muted"><del>₦ 176,550</del></span>
                  <span class="ml-2 badge badge-warning">-2%</span> -->
                  <ion-row>
                    <ion-col 
                    v-if="user_wallet.total"
                    size="6"
                    >
                      <button
                        class="
                          btn btn-primary btn-block
                          mt-4
                          text-center
                          btn-lg
                        "
                        @click="
                          toggleProductDialog(
                            {
                              id: single_data.id,
                              name: single_data.name,
                              price: single_data.price,
                              product_type: [
                                single_data.allow_sharing,
                                single_data.sharing_limit,
                                single_data.quantity,
                              ],
                            },
                            true
                          )
                        "
                      >
                        <i
                          class="mdi mdi-cart-outline mr-1"
                          aria-hidden="true"
                        ></i>
                        <span style="margin: 0 auto"> Checkout</span>
                      </button>
                    </ion-col>
                    <ion-col 
                      v-else
                      size="12"
                      >
                      <button
                        class="
                          btn btn-primary btn-block
                          mt-4
                          text-center
                          btn-lg
                        "
                        @click="

                          toggleProductDialog(
                            {
                              id: single_data.id,
                              name: single_data.name,
                              price: single_data.price,
                              product_type: [
                                single_data.allow_sharing,
                                single_data.sharing_limit,
                                single_data.quantity,
                              ],
                            },
                            true
                          )
                        "
                      >
                        <i
                          class="mdi mdi-cart-outline mr-1"
                          aria-hidden="true"
                        ></i>
                        <span style="margin: 0 auto"> Checkout</span>
                      </button>
                    </ion-col>
                    <ion-col size="6" v-if="user_wallet.total">
                      <button
                        class="
                          btn btn-block btn-secondary
                          mt-4
                          text-center
                          btn-lg
                        "
                        @click="
                          toggleProductDialog(
                            {
                              id: single_data.id,
                              name: single_data.name,
                              price: single_data.price,
                              product_type: [
                                single_data.allow_sharing,
                                single_data.sharing_limit,
                                single_data.quantity,
                              ],
                            },
                            false
                          )
                        "
                      >
                        <i
                          class="mdi mdi-cart-outline mr-1"
                          aria-hidden="true"
                        ></i>
                        <span style="margin: 0 auto"> Pay from wallet</span>
                      </button>
                    </ion-col>
                  </ion-row>
                </div>
                <div class="share my-3">
                  <p style="font-size: 1.25rem">Share this product</p>
                  <a href=""><span class="mdi mdi-facebook"></span></a>
                  <a href=""> <span class="mdi mdi-twitter ml-3"></span></a>
                </div>
              </ion-col>
            </ion-row>
            <a class="bottom-fixed" href=""
              >Report incorrect product information</a
            >
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
                          <b-button
                          variant="primary"
                          
                          >
                          Write Review
                          </b-button>
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
          </ion-grid>
          <div class="" v-else>
            <div class="container text-center" style="padding-top:100px">
              <img src="../assets/images/sorry.png" alt="Not allowed image" style="width:100px">
              <h1 class="text-warning display-3">404</h1>
              <p class="p-2 shadow-sm">
                The product you are looking for does not exist.

              </p>

            </div>
          </div>
         
        </div>
        <!-- VIEW MODAL -->
      </div>
      <GDialog v-model="value" max-width="500" persistent
      >
        <CartSuccess :from_shared="true" :my_modal="this.$bvModal" />
      </GDialog>
    </BaseLayout>
  </ion-page>
</template>
<script>
import vue3starRatings from "vue3-star-ratings";
import { defineComponent } from "vue";
import { IonPage,IonCol,IonRow,IonGrid,IonSegment } from '@ionic/vue';
import BaseLayout from '@/components/BaseLayout'
import axios from "axios";
import { mapActions, mapGetters } from "vuex";
import { GDialog } from "gitart-vue-dialog";
import CartSuccess from "@/components/CartSuccess";
import SkeletonText from '@/components/SkeletonText'

export default defineComponent({
  components: {
    CartSuccess,IonPage,IonCol,IonRow,IonGrid,IonSegment,GDialog,
    BaseLayout,"vue3-star-ratings":vue3starRatings,SkeletonText
  },
  data() {
    return {
      single_data: {},
      slideIndex: 1,
      img_ind: 0,
      curr_img: "",
      payload: {},
      dialogBox: false,
      user_wallet: {},
      notFound: false,
      sharingLimit: false,
      not_allowed:false,
      avg:2,
      value: false,
      tab: "description",
      loading:true,

    };
  },
  computed: {
    ...mapGetters(["auth_user", "auth_token", "loggedIn"]),
  },
  mounted() {
    this.getAuthData();
    this.fetch_single();
    this.fetchWallet()
  },
  methods: {
    ...mapActions(["getAuthData"]),
    prev_item() {
      if (this.img_ind !== 0) {
        this.img_ind--;
      }
    },
    next_item() {
      if (this.img_ind !== this.single_data.image.length - 1) {
        this.img_ind++;
      }
    },

    full_view(img) {
      this.curr_img = img;
    },
    toggleWishlist(product_id, status) {
      this.presentLoading('Processing');

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
              this.openToast(res.data.mssg, "danger");
              return;
            }
            this.openToast("Something went wrong, try again later", "danger");
          })
          .catch(() => {
            this.openToast("Unable to save item, try again later", "danger");
          }).finally(() => {
            this.dismissLoading();

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
          }).finally(() => {
            this.dismissLoading();

          });
      }
    },
    dynamicTitle(status) {
      return status == true ? "Remove from wishlist" : "Add to wishlist";
    },
    toggleProductDialog(data, checkout) {
      this.getAuthData();
      this.presentLoading("Processing");

      const userId = this.$store.state.user.id;
      const product_id = data.id;
      const initiator = this.$route.params.userid;
      let amt = this.single_data.shared_amt;
      if (checkout) {
        let ref = Math.random().toString(36).substr(2, 6);

        const route = this.dynamic_auth_route(
          "client/products/checkout/shared-payment/verify"
        );
        const header = {
          headers: {
            authorization: `Bearer ${this.auth_token}`,
          },
        };
        // eslint-disable-next-line no-undef
        FlutterwaveCheckout({
          public_key: "FLWPUBK-049a53774a1dd9ca29dd26a6d3c23fa4-X",
          tx_ref: ref,
          amount: amt,
          currency: "NGN",
          country: "NG",
          payment_options: " ",
          customer: {
            email: this.$store.state.user.email,
            phone_number: this.$store.state.user.phone,
            name: this.$store.state.user.name,
          },
          callback: function (data) {
            // specified callback function
            let payload = {
              transRef: data.transaction_id,
              userId,
              product_id,
              amt,
              initiator,
            };

            axios
              .post(route, payload, header)
              .then(() => {
                location.reload();
              })
              .catch(() => {});
          },
          customizations: {
            title: "Marketcenta",
            description: "Payment for checkout",
            logo: "https://res.cloudinary.com/adetayoapplication/image/upload/v1636387496/marketlogosm_e7obw7.png",
          },
        });
        this.dismissLoading();

      } else {
        if (this.user_wallet.total < amt) {
          // return swal({
          //   title: "Hi, " + this.auth_user.name,
          //   text: "Your cart total amount is greater than your wallet balance. Remove some items in your cart and try again!",
          //   icon: "info",
          //   button: "Got it!",
          // });
        }
        let payload = {
          initiator,
          amt,
          userId,
          product_id,
        };
        axios
          .post(
            this.dynamic_auth_route("client/products/checkout/shared_products_wallet_checkout"),
            payload,
            {
              headers: {
                authorization: `Bearer ${this.auth_token}`,
              },
            }
          )
          .then(() => {
            this.openToast("Checkout successful", "danger");
            this.value = true;
          })
          .catch((err) => {
            this.tokenExpired(err);
          });
      }
    },
    fetch_single() {
      axios
        .post(
          this.dynamic_route(`products/view`),
          {
            check: this.$route.params.userid,
            item_id: this.$route.params.item_id,
          },
          {
            headers: {
              authorization: `Bearer ${this.auth_token}`,
            },
          }
        )
        .then((res) => {
          this.single_data = res.data;
        })
        .catch((err) => {
          if (err.response.status == 408) {
            this.sharingLimit = true;
            return this.openToast("Sharing limit exceed", "danger");
          } else if (err.response.status == 404) {
            this.openToast("Product not found", "danger");

            return (this.notFound = true);
          } else if(err.response.status == 405){
            this.openToast("You are not allowed to view this product", "danger");
            this.not_allowed = true;
          }

          this.tokenExpired(err);
        }).finally(() => this.loading=false);
    },
    fetchWallet() {
      const userId = this.$store.state.user.id;
      axios
        .get(this.dynamic_auth_route("wallets/fetch/" + userId), {
          headers: {
            authorization: `Bearer ${this.auth_token}`,
          },
        })
        .then((res) => {
          this.user_wallet = res.data;
        })
        .catch((error) => {
          this.tokenExpired(error);
        })
        .finally(() => {});
    },
    pay_with_wallet() {},
    closeDialog2() {
      this.$bvModal.hide("cart_success");
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
  /* vertical-align: top; */
  height: 380px;
  /* border: 1px solid; */
  overflow: hidden;
}

.prev_image {
  border-style: none;
  display: block;
  height: 22rem;
  /* -o-object-fit: contain; */
  object-fit: contain;
  width: 100%;
}

.preview {
  border: 1px solid gray;
  display: inline-block;
  width: 10%;
  height: 100%;
}
.active_i {
  border: 2px solid yellow;
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
  margin-top: 120px;
  background-color: white;
  padding: 15px 18px;
  z-index: 1 !important;
  border-radius: 50%;
  font-weight: 700;
  box-shadow: 0 0 40px rgb(0 0 0 / 10%) !important;
  cursor: pointer;
}
</style>
