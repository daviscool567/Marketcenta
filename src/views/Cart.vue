<template>
    <ion-page>
        <BaseLayout>
            <div v-if="loading">
                <SkeletonText />
            </div>
            <div v-else>
                <div class="my-2">
                    <div class="container">
                        <ion-button color="primary" fill="outline" class="continue-button"
                        style="font-size: 12px; color: white !important" @click="this.$router.push('/')">
                        <i class="mdi mdi-arrow-left"></i>
                            CONTINUE SHOPPING
                        </ion-button>
                    </div>
                    <div>
                        <div class="bg-white" style="position:relative">
                            <div class="container">
                                <h5 style="font-size: 1.25rem;">Shopping Cart</h5>
                            </div>
                            <div v-if="carts_data.length" class="mt-3">
                                <div
                                    class=" row cart-content"
                                    v-for="(cat, i) in carts_data"
                                    :key="i"
                                >
                                    <div>
                                        <div class="d-flex mobile-product">
                                            <div class="justify-content-start">
                                                <div class="product-image-inner">
                                                    <div class="products-img-wrapper">
                                                        <a>
                                                            <img
                                                            :src="cat.image"
                                                            :alt="cat.product_name"
                                                            class="product-img img-fluid"
                                                            />
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="justify-content-end ml-3">
                                                <div class="product-content">
                                                    <h5
                                                    class="mb-2"
                                                    style="
                                                        color: #222222 !important;
                                                        font-weight: 500;
                                                        font-size: 18px !important;
                                                        margin-top: 0 !important;
                                                    "
                                                    >
                                                    {{ cat.product_name }}
                                                    </h5>
                                                    <h6 class="mt-4" style="font-size: 16px !important">
                                                        &#8358;{{ Number(cat.amount).toLocaleString() }}
                                                    </h6>
                                                </div>
                                            </div>
                                        </div>
                                        <ion-grid>
                                            <ion-row class="mobile-div mt-3">
                                                <ion-col size="6" class="col-6">
                                                <button
                                                    class="btn mdi mdi-cards-heart-outline mr-3"
                                                    :class="{
                                                    'active-class': cat.in_saved_items == true,
                                                    'mdi mdi-heart-circle': cat.in_saved_items == true,
                                                    }"
                                                    style="cursor: pointer"
                                                    :title="dynamicTitle(cat.in_saved_items)"
                                                    @click="
                                                    toggleWishlist(cat.product_id, cat.in_saved_items)
                                                    "
                                                ></button>
                                                <i
                                                    class="mdi mdi-delete-outline"
                                                    style="cursor: pointer; color: red"
                                                    title="Remove Cart"
                                                    @click="removeFromCat(cat.id)"
                                                    ><span
                                                    style="
                                                        font-style: normal !important;
                                                        font-weight: 500;
                                                        margin-left: 4px;
                                                        vertical-align: top;
                                                        font-size: 14px;
                                                    "
                                                    >REMOVE</span
                                                    ></i
                                                >
                                                </ion-col>
                                                <ion-col size="6">
                                                    <div
                                                        class="addbutton-bg d-flex float-right"
                                                        v-if="cat.product_type == 'self'"
                                                    >
                                                        <button
                                                        type="button"
                                                        class="btn"
                                                        @click="
                                                            setSelected(i);
                                                            removeQty({
                                                            id: cat.id,
                                                            quantity: cat.quantity,
                                                            actual_quantity: cat.actual_quantity,
                                                            })
                                                        "
                                                        >
                                                        <i class="mdi mdi-minus"></i>
                                                        </button>
                                                        <ion-input
                                                            :id="'input' + i"
                                                            type="text"
                                                            v-model="cat.quantity"
                                                            class="field-qty"
                                                        ></ion-input>
                                                        <!-- SPINNER -->
                                                        <ion-spinner 
                                                            :id="'spin' + i"
                                                            style="display: none"
                                                            name="dots">
                                                        </ion-spinner>
                                                        <button
                                                        type="button"
                                                        class="btn"
                                                        @click="
                                                            setSelected(i);
                                                            addQuantity({
                                                            id: cat.id,
                                                            quantity: cat.quantity,
                                                            actual_quantity: cat.actual_quantity,
                                                            })
                                                        "
                                                        >
                                                        <i class="mdi mdi-plus"></i>
                                                        </button>
                                                    </div>
                                                    <div
                                                        v-else
                                                        class="alert alert-info shadow-sm p-2"
                                                        style="font-size: 13px"
                                                    >
                                                        Shared with {{ cat.sharing_num }} others
                                                    </div>
                                                </ion-col>
                                            </ion-row>
                                        </ion-grid>
                                    </div>
                                </div>
                            </div>
                            <div class="text-center mt-5" v-else>
                                <h1>
                                    <img
                                    src="../assets/images/ecarts.webp"
                                    style="width: 200px"
                                    alt="nocarts"
                                    class="img-fluid"
                                    />
                                </h1>
                                <h5 class="text-muted mt-3">
                                    <b>Your Shopping Cart is empty</b>
                                </h5>
                                <p style="font-size: 13px !important">
                                    Browse our collections and discover great stuff
                                </p>
                            </div>
                        </div>
                    </div>
                    <div
                        class="container px-3 bg-white"
                        style="margin-top: 100px"
                        v-if="carts_data.length"
                    >
                        <div
                            class="bg-white fixed-bottom px-3 pb-4 pt-3"
                            style="margin-bottom: 60px; z-index: 1"
                        >
                            <ion-grid>
                                <ion-row>
                                    <ion-col size="6">
                                        <h6 style="margin-top: 0 !important">Total</h6>
                                    </ion-col>
                                    <ion-col size="6">
                                        <h6 class="float-right font-weight-bolder text-primary" 
                                        style="margin-top: 0 !important;">
                                        &#8358; {{ Number(cart_total).toLocaleString() }}
                                        </h6>
                                    </ion-col>
                                </ion-row>
                            </ion-grid>
                        </div>
                        <div
                            class="
                            checkout
                            fixed-bottom
                            bg-white
                            px-3
                            py-4
                            text-center
                            "
                            style="z-index: 1"
                        >
                            <ion-button
                            color="primary"
                            style="width: 100%; color: #f26b31; font-weight: 600"
                            @click="open = true">
                                COMPLETE YOUR ORDER
                            </ion-button>
                        </div>
                    </div>
                </div>

                 <!-- order summary modal dialog -->
                <ion-modal :is-open = open>
                    <ion-content>
                        <ion-header>
                            <ion-toolbar>
                                <ion-title>Order Details</ion-title>
                                <ion-buttons slot="end">
                                    <ion-button color="dark" @click="dismissModal">
                                        <ion-icon slot="icon-only" :icon="closeOutline"></ion-icon>
                                    </ion-button>
                                </ion-buttons>
                            </ion-toolbar>
                        </ion-header>
                        <div class="px-1 ion-padding" v-if="carts_data.length">
                            <div class="d-flex checkout-section pb-2">
                                <h4 style="margin-top: 0 !important">Order Summary</h4>
                                <div class="ml-auto">
                                <h4 style="margin-top: 0 !important" v-if="carts_data.length">{{ carts_data.length }} Items</h4>
                                </div>
                            </div>
                            <div class="d-flex checkout-section pb-2 pt-3 sticky-top bg-white">
                                <div>
                                    <h6 style="margin-top: 0 !important">Subtotal</h6>
                                    <h6 v-if="form.delivery == 'door'">Shipping Fee</h6>
                                    <h6 v-if="form.delivery == 'door'">TOTAL</h6>
                                </div>
                                <div class="ml-auto">
                                    <p style="font-size: 14px; font-weight: 600; margin-top: 0 !important">
                                        &#8358;
                                        {{ Number(cart_total).toLocaleString() }}
                                    </p>
                                    <p
                                        v-if="form.delivery == 'door'"
                                        style="font-size: 14px; font-weight: 600; margin-top: 0 !important"
                                    >
                                        <span v-if="defaultAddress.shipping_fee">
                                            &#8358; {{ defaultAddress.shipping_fee }}
                                        </span>
                                        <span v-else>
                                            <small>No default Address</small>
                                        </span>
                                    </p>
                                    <p
                                        v-if="form.delivery == 'door'"
                                        style="font-size: 14px; font-weight: 600; margin-top: 0 !important"
                                        class="text-primary"
                                    >
                                        <span v-if="defaultAddress.shipping_fee">
                                            &#8358;
                                            {{(Number(cart_total) + Number(defaultAddress.shipping_fee)).toLocaleString()
                                            }}
                                        </span>
                                        <span v-else>
                                            <small>No default Address</small>
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div class="checkout-section pb-3 pt-3">
                                <h6 style="margin-bottom: 1px !important; margin-top: 0 !important">DELIVERY TYPE</h6>
                                <div class="mt-2 mb-4">
                                    <ion-radio-group v-model="form.delivery">
                                        <ion-grid>
                                            <ion-row>
                                                <ion-col size="6">
                                                    <ion-radio class="order-radio" value="door"></ion-radio>
                                                    <ion-label class="order-type">Door delivery</ion-label>
                                                </ion-col>
                                                <ion-col size="6">
                                                    <ion-radio class="order-radio" value="pickup"></ion-radio>
                                                    <ion-label class="order-type">Pickup Station</ion-label>
                                                </ion-col>
                                            </ion-row>
                                        </ion-grid>
                                    </ion-radio-group>
                                </div>
                                <button
                                    v-if="form.delivery == 'pickup'"
                                    class="text-center btn btn-sm text-info"
                                    style="width: 100%"
                                    @click="pickupOpen = true"
                                >
                                 Click to select / change pickup station
                                </button>
                                <div
                                    class="mt-1 mb-4"
                                    v-if="selected_stations.title && form.delivery == 'pickup'"
                                >
                                Pickup station - {{ selected_stations.title }}
                                </div>
                            </div>
                            <div class="checkout-section pb-3 pt-3">
                                <div class="d-flex">
                                <h6 style="margin-top: 0 !important">DELIVERY ADDRESS</h6>
                                <div class="ml-auto">
                                    <ion-button
                                    color="primary"
                                    size="small"
                                    class="new-addr"
                                    @click="manageAddress"
                                    >
                                    <i class="mdi mdi-plus"></i>
                                    NEW ADDRESS
                                    </ion-button>
                                </div>
                                </div>
                                <div v-if="defaultAddress">
                                    <h5 style="margin-top: 0 !important">{{ defaultAddress.label }}</h5>
                                    <p>{{ defaultAddress.street_address }}</p>
                                    <p>{{ defaultAddress.name }}</p>
                                    <p v-if="defaultAddress.direction">
                                        {{ defaultAddress.direction }}
                                    </p>
                                    <p>{{ defaultAddress.phone }}</p>
                                    <p v-if="defaultAddress.second_number">
                                        {{ defaultAddress.second_number }}
                                    </p>
                                </div>
                                <div v-else class="alert alert-info my-2">
                                    <h6>No default shipping address selected</h6>
                                </div>
                            </div>
                            <div class="checkout-section pb-3 pt-3">
                                <h6 style="margin-top: 0 !important">DELIVERY TIME</h6>
                                <h6 class="mt-3">{{ distanceFromNow }}</h6>
                                <ion-radio-group v-model="form.time" class="mt-3">
                                    <ion-grid>
                                        <ion-row>
                                            <ion-col size="12">
                                                <ion-radio class="order-radio" value="morning"></ion-radio>
                                                <ion-label class="order-type">Morning (10AM to 1PM)</ion-label>
                                            </ion-col>
                                            <ion-col size="12">
                                                <ion-radio class="order-radio" value="evening"></ion-radio>
                                                <ion-label class="order-type">Evening (4PM to 8PM)</ion-label>
                                            </ion-col>
                                        </ion-row>
                                    </ion-grid>
                                </ion-radio-group>
                            </div>
                            <div class="checkout-section pb-3 pt-3">
                                <h6>Delivery Note / Instructions (optional )</h6>
                                <ion-item>
                                    <ion-textarea cols="30" rows="3"></ion-textarea>
                                </ion-item>
                            </div>
                            <div class="my-4">
                                <!-- <p v-show="user_wallet.total !=0 || user_membership.amount !=0"> -->
                                <p>
                                    Pay with <span>/ on</span>
                                </p>
                                <div class="row">
                                <div>
                                    <ion-button @click="checkout('straight')" color="primary" expand="block"
                                    >CHECKOUT</ion-button
                                    >
                                </div>
                                <!-- <div v-if="user_wallet.total !=0" class="mt-3"> -->
                                <div class="mt-3">
                                    <ion-button
                                        @click="checkout('wallet')"
                                        color="success"
                                        expand="block"
                                    >WALLET <ion-spinner v-if="load_wallet" name="crescent"></ion-spinner></ion-button
                                    >
                                </div>
                                <!-- <div class="mt-3" v-if="user_membership.amount !=0"> -->
                                <div class="mt-3">
                                    <ion-button
                                        color="secondary"
                                        @click="checkout('on_credit')"
                                        expand="block"
                                    >CREDIT <ion-spinner v-if="load_credit" name="crescent"></ion-spinner></ion-button
                                    >
                                </div>
                                </div>
                            </div>
                        </div>
                    </ion-content>
                </ion-modal>

                <!-- pickupstation modal -->
                <ion-modal :is-open = pickupOpen>
                    <ion-content>
                        <ion-header>
                            <ion-toolbar>
                                <ion-title>Pickup stations</ion-title>
                                <ion-buttons slot="end">
                                    <ion-button color="dark" @click="dismissPickupModal">
                                        <ion-icon slot="icon-only" :icon="closeOutline"></ion-icon>
                                    </ion-button>
                                </ion-buttons>
                            </ion-toolbar>
                        </ion-header>

                        <div class="ion-padding mt-4">
                            <div v-if="pickups.length">
                                <div v-for="(ps, i) in pickups" :key="i">
                                    <div class="bg-address">
                                        <div class="d-flex">
                                            <ion-list>
                                                <ion-radio-group v-model="selected_stations">
                                                    <ion-item class="border-none">
                                                        <ion-label class="address-content">
                                                            <h5 style="font-weight: 600; font-size: 16px">{{ ps.title }}</h5>
                                                            <p>{{ ps.street_address }}, {{ ps.name }}</p>
                                                            <p v-if="ps.direction">{{ ps.direction }}</p>
                                                        </ion-label>
                                                        <ion-radio slot="start" :value="ps"></ion-radio>
                                                    </ion-item>
                                                </ion-radio-group>
                                            </ion-list>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="alert alert-info shadow-sm" v-else>
                                <p>No pick up station found</p>
                            </div>
                            <div class="mt-4">
                                <ion-button
                                    class="btn"
                                    @click="dismissPickupModal"
                                    color="success"
                                    expand="block"
                                >
                                <span v-if="pickups.length">Select</span>
                                <span v-else>Close</span>
                                </ion-button>
                            </div>
                        </div>
                    </ion-content>
                </ion-modal>
            </div>
        </BaseLayout>
    </ion-page>
</template>

<script>
import { defineComponent } from 'vue'
import { IonPage, IonButton, modalController, IonGrid, IonRow, IonCol, IonInput, IonModal,
        IonContent, IonRadioGroup, IonRadio, IonLabel, IonHeader, IonToolbar, IonTitle, 
        IonButtons, IonTextarea, IonItem, IonList, IonIcon,alertController } from '@ionic/vue'
import { closeOutline } from 'ionicons/icons';
import axios from 'axios'
import { mapActions, mapGetters } from 'vuex'
import BaseLayout from '@/components/BaseLayout'
import moment from 'moment';
import ManageAddress from '@/components/AddressComponents/ManageAddress';
import SkeletonText from '@/components/SkeletonText'

export default defineComponent({
    components: {
        IonPage,
        IonButton,
        BaseLayout,
        IonGrid,
        IonRow,
        IonCol,
        IonInput,
        IonModal, IonIcon,
        IonContent, IonList,
        IonRadio, IonItem,
        IonRadioGroup, IonTextarea,
        IonLabel, IonHeader, IonToolbar, IonTitle, 
        IonButtons, SkeletonText
    },
    data() {
        return {
            closeOutline,
            load_wallet: false,
            load_credit:false,
            is_not_loading:true,
            form: {
                quantity: 1,
                delivery: "door",
                time: "morning",
            },
            summary: false,
            final_amount: 0,
            user_membership: false,
            user_wallet: false,
            pickups: [],
            selected_stations: {},
            open: false,
            pickupOpen: false,
            loading: false
        };
    },
    computed: {
        ...mapGetters(["auth_token", "auth_user", "carts_data", "cart_total", "defaultAddress"]),
        distanceFromNow() {
            return moment().add(this.defaultAddress.duration, "days");
        },
    },
    mounted() {
        this.getAuthData();
        this.fetchDefaultAddress();
        this.check_membership();
        this.fetchWallet();
        this.cartContent();
        this.pickup_station();
    },
    methods: {
        ...mapActions(["getCarts", "getAuthData", 'fetchDefaultAddress']),
        async cartContent() {
            this.loading = true
            await this.getCarts(this.auth_user.id)
            this.loading = false
        },
        //  function to style spinner
        setSelected(id){
            let input = 'input'+id;
            let spin = 'spin'+id; 
            let sel_input = document.getElementById(input);
            let sel_spin = document.getElementById(spin);
            sel_input.style.display = 'none';  
            sel_spin.style.display = 'inline';
        },
        removeSelected(){
            for (let i=0; i<this.carts_data.length; i++){
                let input = 'input'+i;
                let spin = 'spin'+i; 
                let sel_input = document.getElementById(input);
                let sel_spin = document.getElementById(spin);
                sel_input.style.display = 'inline';  
                sel_spin.style.display = 'none';
            }
        },
        addQuantity(data) {
            this.is_not_loading=false;
            axios
                .post(this.dynamic_route("products/carts/increase_quantity"), {filter: data.id},
                {
                    headers: {
                        authorization: `Bearer ${this.auth_token}`,
                    },
                })
                .then((res) => {
                    if (res.status == 201) {
                        this.getCarts(this.auth_user.id);
                    }
                })
                .catch((error) => {
                    this.openToast("An error occured. Please, try again.", 'danger');
                    this.tokenExpired(error);
                }).finally(() => {
                  this.removeSelected()
                });
        },
        removeQty(data) {
            if (data.quantity >= 2) {
                this.is_not_loading=false;
                axios
                    .post(
                        this.dynamic_route("products/carts/decrease_quantity"), {filter: data.id},
                        {
                            headers: {
                                authorization: `Bearer ${this.auth_token}`,
                            },
                        }
                    )
                    .then((res) => {
                        if (res.status == 201) {
                            this.getCarts(this.auth_user.id);
                        }
                    })
                    .catch((error) => {
                        this.openToast("An error occured. Please, try again.", 'danger');
                        this.tokenExpired(error);
                    }).finally(() => {
                        this.removeSelected()
                    });
            }
        },
        removeFromCat(id) {
            axios
                .post(
                this.dynamic_route("products/carts/remove"),
                { id: id },
                {
                    headers: {
                    authorization: `Bearer ${this.auth_token}`,
                    },
                }
                )
                .then((res) => {
                if (res.status == 201) {
                    this.openToast("Item removed from cart", 'success');
                    this.getCarts(this.auth_user.id);
                    return;
                }
                    this.openToast("Unable to  remove item", 'danger');
                })
                .catch(() => {});
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
                        this.getCarts(this.auth_user.id);
                        this.openToast("Item saved successfully", 'success');
                        return;
                    } else if (res.status == 203) {
                        //Duplicate entry
                        this.openToast(res.data.mssg, 'tertiary');
                        return;
                    }
                    this.openToast("Something went wrong, try again later", 'danger');
                })
                .catch((error) => {
                    this.openToast("Unable to save item, try again later", 'danger');
                    this.tokenExpired(error);
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
                        this.getCarts(this.auth_user.id);
                        this.openToast("Item removed from wishlist", 'success');
                        return;
                    }
                    this.openToast("Something went wrong, try again later", 'danger');
                })
                .catch((error) => {
                    this.openToast("Unable to remove item, try again later", 'danger');
                    this.tokenExpired(error)
                });
            }
        },
        dynamicTitle(status) {
            return status == true ? "Remove from wishlist" : "Add to wishlist";
        },
        check_membership() {
            const userId = this.$store.state.user.id;
            axios
                .get(this.dynamic_auth_route("membership/active/fetch/" + userId), {
                    headers: {
                        authorization: `Bearer ${this.auth_token}`,
                    },
                })
                .then((res) => {
                    this.user_membership = res.data;
                })
                .catch((error) => {
                    this.tokenExpired(error);
                })
                .finally(() => {});
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
        checkout(checkout_type = null) {
            if (this.form.delivery == "pickup" && !this.selected_stations.id) {
                return this.openToast("Please select a pick up station", 'danger');
            }
            if (this.form.delivery == "door" && !this.defaultAddress.id) {
                return this.openToast("Please select an active address", 'danger');
            }
            this.final_amount =
                this.form.delivery == "door"
                ? parseInt(this.cart_total) + parseInt(this.defaultAddress.shipping_fee)
                : parseInt(this.cart_total);
            if (checkout_type == "on_credit") {
                // eslint-disable-next-line no-unreachable

                this.presentOnCreditConfirm();
            } else if (checkout_type == "straight") {
                this.presentChekoutConfirm();
            } else {
               
                this.presentWithWalletConfirm();
               
            }
        },
        pickup_station() {
            axios
                .post(
                this.dynamic_auth_route("pickup/fetch"),
                { not_paginated: true },
                {
                    headers: {
                    authorization: `Bearer ${this.auth_token}`,
                    },
                }
                )
                .then((res) => {
                    this.pickups = res.data;
                })
                .catch((err) => {
                    this.openToast("Request not completed", 'danger');
                    this.tokenExpired(err);
                });
        },
        formatDate(date) {
            return moment(date).format("D MMM, YYYY, h:mm a");
        },
        async manageAddress() {
            const modal = await modalController.create({
                component: ManageAddress,
                cssClass: 'my-custom-class',
                componentProps: {
                    title: 'Manage Address',
                    userData: this.auth_user,
                    authToken: this.auth_token,
                    defaultAdd: this.defaultAddress
                },
            });
            return modal.present();
        },
        dismissModal() {
            this.open = false
        },
        dismissPickupModal() {
            this.pickupOpen = false
        },
        async presentOnCreditConfirm() {
            this.load_credit=true;
            const userId = this.$store.state.user.id;

            axios
            .get(this.dynamic_auth_route("membership/active/fetch/" + userId), {
                headers: {
                    authorization: `Bearer ${this.auth_token}`,
                },
            })
            .then( async (res) => {
                this.load_credit=false;

                if(res.data.total && res.data.status == 'active') {
                    if (parseInt(this.user_membership.amount) < parseInt(this.final_amount)) {
                        this.notifyCredit();return;
                    }
                    const alert = await alertController
                    .create({
                        cssClass: 'my-custom-class',
                        header: 'Checkout on credit ?',
                        message: 'Your carts total amount will be deducted from your membership subscription',
                        buttons: [
                            {
                            text: 'No, exit',
                            role: 'cancel',
                            cssClass: 'secondary',
                            id: 'cancel-button',
                            handler: () => {
                            },
                            },
                            {
                            text: 'Yes, continue',
                            id: 'confirm-button',
                            handler: () => {
                                this.payCredit()
                            },
                            },
                        ],
                    });
                    return alert.present();
                } else {
                    const alert = await alertController
                    .create({
                        cssClass: 'my-custom-class',
                        header: 'Sorry',
                        message: "You do not have an active membership !",
                        buttons: [
                            {
                            text: 'Got it',
                            role: 'cancel',
                            cssClass: 'secondary',
                            id: 'cancel-button',
                            handler: () => {
                            },
                            }
                        ],
                    });
                    return alert.present();
                }
            })
            .catch((error) => {
                this.load_credit=false;
                this.tokenExpired(error);
            })
            .finally(() => {this.load_credit=false});
           
        },
        async presentWithWalletConfirm() {
            this.load_wallet=true;
            const userId = this.$store.state.user.id;
            axios
            .get(this.dynamic_auth_route("wallets/fetch/" + userId), {
                headers: {
                    authorization: `Bearer ${this.auth_token}`,
                },
                })
            .then(async (res) => {
                this.load_wallet=false;

                    if(res.data.total && res.data.status =='active') {
                        if (parseInt(this.user_wallet.total) < parseInt(this.final_amount)) {
                            this.notifyWallet();return;
                        }
                        const alert = await alertController
                        .create({
                        cssClass: 'my-custom-class',
                        header: 'Checkout with wallet ?',
                        message: "Your carts total amount will be deducted from your wallet",
                        buttons: [
                            {
                            text: 'No, exit',
                            role: 'cancel',
                            cssClass: 'secondary',
                            id: 'cancel-button',
                            handler: () => {
                            },
                            },
                            {
                            text: 'Yes, continue',
                            id: 'confirm-button',
                            handler: () => {
                                this.payWallet()
                            },
                            },
                        ],
                        });
                        return alert.present();
                    } else {
                        const alert = await alertController
                        .create({
                        cssClass: 'my-custom-class',
                        header: 'Sorry',
                        message: "You do not have an active wallet",
                        buttons: [
                            {
                            text: 'Got it',
                            role: 'cancel',
                            cssClass: 'secondary',
                            id: 'cancel-button',
                            handler: () => {
                            },
                            }
                        ],
                        });
                        return alert.present();
                    }
                })
                .catch((error) => {
                    this.load_wallet=false;
                    this.tokenExpired(error);

                })
            .finally(() => {this.load_wallet=false});
        },
        async presentChekoutConfirm() {
            const alert = await alertController
            .create({
            cssClass: 'my-custom-class',
            header: 'Checkout all item ?',
            message: "This will route you to a payment gateway to complete your order process",
            buttons: [
                {
                text: 'No, exit',
                role: 'cancel',
                cssClass: 'secondary',
                id: 'cancel-button',
                handler: () => {
                },
                },
                {
                text: 'Yes, continue',
                id: 'confirm-button',
                handler: () => {
                    this.pay()
                },
                },
            ],
            });
            return alert.present();
        },
        async notifyCredit() {
            const alert = await alertController
            .create({
                cssClass: 'my-custom-class',
                header: 'Hi ' + this.auth_user.name,
                message: "Your cart total amount is greater than your membership plan. Try removing some items in your cart and try again !",
                buttons: [
                    {
                    text: 'Got it',
                    role: 'cancel',
                    cssClass: 'secondary',
                    id: 'cancel-button',
                    handler: () => {
                    },
                    }
                ],
            });
            return alert.present();
        },
        async notifyWallet() {
            const alert = await alertController
            .create({
            cssClass: 'my-custom-class',
            header: 'Hi ' + this.auth_user.name,
            message: "Your cart total amount is greater than your wallet balance. Remove some items in your cart and try again!",
            buttons: [
                {
                text: 'Got it',
                role: 'cancel',
                cssClass: 'secondary',
                id: 'cancel-button',
                handler: () => {
                },
                }
            ],
            });
            return alert.present();
        },
        payCredit(){
            let payload = {
            processed: this.auth_user.id,
            carts: this.carts_data,
            amt: this.final_amount,
            delivery_type: this.form.delivery,
            delivery_time: this.form.time,
            delivery_note: this.form.delivery_note,
            };
            if (this.form.delivery == "door") {
            payload.delivery_address_id = this.defaultAddress.id;
            } else {
            payload.pickup_station_id = this.selected_stations.id;
            }
            axios
            .post(
                this.dynamic_auth_route("client/products/checkout/on_credit"),
                payload,
                {
                headers: {
                    authorization: `Bearer ${this.auth_token}`,
                },
                }
            )
            .then(() => {
                this.openToast("Checkout successful", 'success');
                this.dismissModal();
                this.$router.push({ name: "Orders" });
                this.getCarts(this.auth_user.id);
            })
            .catch((err) => {
                if (err.response.status == 502) {
                    this.openToast("Your available balance is insufficient", 'danger');
                } else {
                this.tokenExpired(err);
                }
            });
        },
        payWallet() {
            let payload = {
            processed: this.auth_user.id,
            carts: this.carts_data,
            amt: this.final_amount,
            delivery_type: this.form.delivery,
            delivery_time: this.form.time,
            delivery_note: this.form.delivery_note,
            };
            if (this.form.delivery == "door") {
            payload.delivery_address_id = this.defaultAddress.id;
            } else {
            payload.pickup_station_id = this.selected_stations.id;
            }
            axios
            .post(
                this.dynamic_auth_route("client/products/checkout/wallet"),
                payload,
                {
                headers: {
                    authorization: `Bearer ${this.auth_token}`,
                },
                }
            )
            .then(() => {
                this.openToast("Checkout successful", 'success');
                this.$router.push({ name: "Orders" });
                this.getCarts(this.auth_user.id);
            })
            .catch((err) => {
                this.tokenExpired(err);
            });
        },
        pay() {
            let ref = Math.random().toString(36).substr(2, 6);
            const userId = this.$store.state.user.id;
            const route = this.dynamic_auth_route(
            "client/products/checkout/payment/verify"
            );
            let delivery_time = this.form.time;
            let delivery_type = this.form.delivery;
            let all_carts = this.carts_data;
            let delivery_address_id = this.defaultAddress.id;
            let pickup_station_id = this.selected_stations.id;
            let amt = parseInt(this.cart_total);
            const header = {
            headers: {
                authorization: `Bearer ${this.auth_token}`,
            },
            };
            // eslint-disable-next-line no-undef
            FlutterwaveCheckout({
            public_key: "FLWPUBK-049a53774a1dd9ca29dd26a6d3c23fa4-X",
            tx_ref: ref,
            amount: this.final_amount,
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
                all_carts,
                delivery_address_id,
                delivery_time,
                delivery_type,
                amt,
                pickup_station_id,
                };

                axios
                .post(route, payload, header)
                .then(() => {
                    location.reload();
                })
                .catch(() => {
                });
            },
            customizations: {
                title: "Marketcenta",
                description: "Payment for checkout",
                logo: "https://res.cloudinary.com/adetayoapplication/image/upload/v1636387496/marketlogosm_e7obw7.png",
            },
            });
        }
    },
})
</script>
<style scoped>
.mobile-product {
  align-items: flex-start;
}
.product-image-inner {
  min-height: auto;
  color: #333333;
}
th {
  font-size: 14px !important;
  color: #555555;
}
.products-img-wrapper {
  box-shadow: 0 0 1px 1px hsl(0deg 0% 0% / 5%);
  border-radius: 5px;
}
.mobile-product .products-img-wrapper,
#mobile-recommended .mobile-product .products-img-wrapper {
  width: 80px !important;
  height: 70px;
}
.item-img {
  border-bottom: 2px solid #f1f1f1;
}
.item-name {
  margin-top: 0 !important;
}
.mobile-product .product-img,
#mobile-recommended .mobile-product .product-img {
  max-height: 102px;
  min-height: 70px;
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
  font-size: 15px !important;
}

.product-content h6 {
  font-size: 14px !important;
  font-weight: 600;
  color: #666666;
}

.cart-content {
  border-bottom: 8px solid #f2f2f2;
  padding: 10px;
}

.item-count h5 {
  font-weight: 600;
  opacity: 0.8;
}
.addbutton-bg {
  border: 2px solid #aaaaaa;
  background: #fcfcfc;
  width: 90%;
  height: 45px;
  margin: 0 auto;
  text-align: center;
  padding: 2px 0 0px 0;
  border-radius: 4px;
}

.mobile-div .addbutton-bg {
  border: 2px solid #aaaaaa;
  background: #fcfcfc;
  width: 60%;
  height: 32px;
  margin: 0 auto;
  text-align: center;
  padding: 2px 2px 0px 2px;
  border-radius: 20px;
}

.mobile-div .addbutton-bg input {
  padding-bottom: 25px;
  font-size: 17px;
}
.addbutton-bg input {
  border: none !important;
  text-align: center;
  /* width: 30%; */
  background: transparent !important;
  font-size: 18px;
}
.field-qty {
    --padding-start: 0 !important;
}
.checkout-section {
  border-bottom: 1px solid #f2f2f2;
}
.checkout-section h6 {
  font-size: 14px;
  font-weight: 600;
  color: #555555;
}
.checkout-section p {
  font-size: 14px;
  font-weight: 400;
  color: #333333;
  margin-bottom: 3px !important;
}
.checkout-section h4 {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
}
.checkout-section h5 {
  font-size: 18px;
  font-weight: 600;
  color: #444444;
}
.new-addr {
  font-size: 11px;
}

.active-class {
  color: #f26b31;
}

.checkout:hover {
  color: #ffffff !important;
}
.bg-gradient-danger,
[dir="ltr"] .btn-gradient-danger {
  background-image: linear-gradient(47deg, #f26b31, #4c1c80);
  color: #ffffff;
}
.bg-address {
  border-radius: 4px;
  border: 1px solid #ededed;
  padding: 8px 15px 8px 1px;
  word-break: break-all;
  margin-bottom: 20px;
}
.address-content{
    width: 220px;
    white-space: normal !important;
}
.address-content h5 {
  font-size: 24px;
  line-height: 2.0;
  margin-top: 0 !important;
}
.address-content p {
  font-size: 14px;
  line-height: 1.8 !important;
}
.order-type {
    margin-left: 7px !important;
    vertical-align: middle !important;
    opacity: 0.7 !important;
    font-size: 14px !important;
}
.order-radio {
    vertical-align: middle !important;
}
.btn {
    background: transparent !important;
    padding: 2px !important;
}
.border-none {
    --border-color: transparent !important;
}
</style>
