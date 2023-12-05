<template>
    <div class="order-container">
        <div v-if="data.existed == false">
            <h6 style="margin-left: 10px">
                Select Order Type for
                <span class="item_name"> ({{ data.name }})</span>
            </h6>
            <form action="">
                <ion-radio-group v-model="form.payStructure">
                    <ion-grid>
                        <ion-row v-if="data.product_type">
                            <ion-col size="6" v-if="data.product_type[0] == 'yes'">
                                <ion-radio class="order-radio " value="split"></ion-radio>
                                <ion-label class="order-type">Share Payment</ion-label>
                            </ion-col>
                            <ion-col size="6" v-if="data.product_type[0] == 'yes' || data.product_type[0] == 'no'">
                                <ion-radio class="order-radio" value="self"></ion-radio>
                                <ion-label class="order-type">Make Payment</ion-label>
                            </ion-col>
                        </ion-row>
                    </ion-grid>
                </ion-radio-group>
                <div style="margin-left: 10px" class="pay-input">
                    <div v-if="form.payStructure == 'split'">
                        <p>
                            Number of people to share payment with (Max   {{ data.product_type[3] }})
                        </p>
                        <ion-row>
                            <ion-col size="12">
                                <div class="addbutton-bg2 d-flex">
                                    <ion-input v-model="cart_data.sharing_num" ref="sharing"
                                        @input="checkLen(cart_data.sharing_num, data.product_type[3])"
                                        required
                                    ></ion-input>
                                </div>
                            </ion-col>
                        </ion-row>
                    </div>
                    <div v-if="form.payStructure == 'self'">
                    <p>
                        Quantity (available quantity ({{ data.product_type[2] }}))
                    </p>
                    <ion-row>
                        <ion-col size="12">
                            <div class="addbutton-bg d-flex">
                                <button class="btn" type="button" @click="removeQty">
                                <i class="mdi mdi-minus"></i>
                                </button>
                                <ion-input
                                
                                v-model="cart_data.quantity"
                                class="field-qty"
                                />
                                <button class="btn" type="button" @click="addQty">
                                <i class="mdi mdi-plus"></i>
                                </button>
                            </div>
                        </ion-col>
                    </ion-row>
                    </div>
                </div>
            </form>
        </div>
        <div v-else class="alert alert-info shadow-sm">
            <p>Selected item already exist in cart</p>
        </div>
        <div class="order-btn">
            <ion-button
              v-if="data.existed == false"
              class="mb-3"
              color="primary"
              @click="addToCart"
              :disabled="button_disable"
              expand="block"
            >
              ADD TO CART
            </ion-button>
            <ion-button style="margin-top: 15px" color="light" @click="closeDialog" expand="block">
              CLOSE
            </ion-button>
        </div>

        <GDialog v-model="value" max-width="500" persistent>
            <CartSuccess @close-cart-success = "closeDialog2" :shareLink="link" />
        </GDialog>  
    </div>
</template>
<script>
import { defineComponent } from 'vue'
import  { IonRadioGroup, IonRadio, IonLabel, IonGrid, IonRow, IonCol, IonButton, IonInput } from '@ionic/vue'
import { GDialog } from "gitart-vue-dialog";
import CartSuccess from '@/components/CartSuccess'
import axios from "axios";
import { mapActions, mapGetters } from "vuex";

export default defineComponent({
    name: 'OrderType',
    props:["data"],
    components: {
        IonRadioGroup,
        IonRadio, 
        IonLabel,
        IonGrid, 
        IonRow, 
        IonCol,
        IonButton,
        GDialog,
        CartSuccess,
        IonInput
    },
    computed:{
        ...mapGetters(["auth_user", "auth_token", "loggedIn"]),

    },
    data() {
        return {
            form: {
                payStructure: "self",
            },
            cart_data: { quantity: 1,  sharing_num: 1},
            value: false,
            button_disable: false,
            link: null,
        }
    },
    mounted(){
        this.getAuthData()
    },
    methods: {
        ...mapActions(["getAuthData", "getCarts"]),
        closeDialog() {
            this.$emit('close-dialog')
        },
        closeDialog2() {
            this.value = false
            this.$emit('close-dialog')
        },
        addQty() {
            this.cart_data.quantity++;
        },
        removeQty() {
            if (this.cart_data.quantity > 1) {
                this.cart_data.quantity--;
            }
        },
        checkLen(val, len) {
            if (Number(val) > Number(len)) {
                this.openToast("Cannot exceed the sharing limit", "danger");
                this.button_disable = true;
            } else {
                this.button_disable = false;
            }
        },
        addToCart() {
            let payload = new FormData();
            payload.append("amount", this.data.price);
            if (this.form.payStructure == "self") {
                payload.append("quantity", this.cart_data.quantity);
                payload.append(
                    "total_amount",
                    Math.floor(this.data.price * this.cart_data.quantity)
                );
            } else {
                payload.append("sharing_num", this.cart_data.sharing_num);
                payload.append(
                    "total_amount",
                    Math.floor(this.data.price / this.cart_data.sharing_num)
                );
            }
            payload.append("product_type", this.form.payStructure);
            payload.append("user_id", this.auth_user.id);
            payload.append("product_id", this.data.id);

            axios
            .post(this.dynamic_route("products/carts/add_item"), payload, {
                headers: {
                authorization: `Bearer ${this.auth_token}`,
                },
            })
            .then((res) => {
                if (res.status == 202) {
                    this.link = res.data;
                    this.value = true
                    this.getCarts(this.auth_user.id);
                    return this.openToast("Item added to cart", "success");
                }
                this.openToast("Unable to add, please try again", "danger");
            })
            .catch(() => {
                this.openToast("An error occured. Please try again", "danger");
            });
          
        }
    }
})
</script>
<style scoped>
.order-container {
    padding: 5px;
}
.order-type {
    margin-left: 7px !important;
    vertical-align: middle !important;
}
.order-radio {
    vertical-align: middle !important;
}
.addbutton-bg,
.addbutton-bg2 {
  border: 2px solid #aaaaaa;
  /* background: #fcfcfc; */
  width: 40%;
  float: left;
  height: 40px;
  margin: 0 auto;
  text-align: center;
  padding: 2px 0 0px 0;
  border-radius: 4px;
}
.addbutton-bg input {
  border: none !important;
  text-align: center;
  /* width: 30%; */
  background: transparent !important;
  font-size: 18px;
}
.addbutton-bg2 input {
  border: none !important;
  /* width: 30%; */
  background: transparent !important;
  font-size: 18px;
}
.form-control:focus {
  border-color: #ccc !important;
  outline: 0 !important;
  -webkit-appearance: none !important;
  -webkit-box-shadow: none !important;
  box-shadow: none !important;
}
.d-flex {
    display: flex
}
.pay-input p{
    font-size: 14px;
    margin-bottom: 2px !important;
    margin-top: 10px !important;
    line-height: 2.0;
}
.order-btn {
    padding: 30px 10px 10px;
}
.btn {
    background: transparent !important;
}
.shadow-sm {
    margin-top: 20px;
    margin-left: 5px;
    margin-right: 5px;
}
</style>
