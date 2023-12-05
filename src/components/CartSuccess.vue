<template>
    <div class="cart-success">
        <div class="text-center">
            <img src="../assets/images/checkmark-removebg-preview.png" width="100" class="img-fluid" />
            <p>{{shareLink.mssg}}</p>
        </div>
        <div v-if="shareLink.link">
        <p class="share-header">SHARE</p>
        <div class="addbutton-bg d-flex">
            <p class="refer-link">
            {{ shareLink.link }}
            </p>
            <div
            class="ml-auto align-self-center refer_icon"
            style="cursor: pointer; margin-right: 10px"
            >
                <i class="mdi mdi-content-copy" @click="doCopy"></i>
            </div>
        </div>
        </div>
        <div class="order-btn">
            <ion-button
                fill="outline"
                color="success"
                @click="closeDialog2"
                expand="block"
            >
                CONTINUE SHOPPING
            </ion-button>
            <ion-button
                color="primary"
                @click="this.$router.push('/cart'); closeDialog2()"
                expand="block"
                style="margin-top: 15px"
            >
                GO TO CART
            </ion-button>
            <ion-button style="margin-top: 15px" color="light" @click="closeDialog2" expand="block">
                CLOSE
            </ion-button>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue'
import  { IonButton } from '@ionic/vue'
import { copyText } from 'vue3-clipboard'

export default defineComponent({
    name: 'cart-success',
    props:["shareLink"],
    components: {
        IonButton,
    },
    data() {
        return {
          
        }
    },
    methods: {
        closeDialog2() {
            this.$emit("close-cart-success");
        },
        doCopy() {
            const text = this.shareLink.link
            copyText(text, undefined, (error) => {
                if (error) {
                    this.openToast(" cannot copy link", "danger");
                } else {
                    this.openToast("Link Copied to clipboard", "success");
                }
            })
        },
    },
})
</script>
<style scoped>
.addbutton-bg {
  border: 2px solid #aaaaaa;
  background: #fcfcfc;
  width: 100%;
  height: 45px;
  margin: 0 auto;
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
.refer-link {
  white-space: nowrap;
  overflow: hidden;
  margin-right: 10px;
  margin: 5px;
}
.share-header {
  margin-bottom: 5px !important;
}
.order-btn {
    padding: 30px 0px 10px;
}
.btn {
    background: transparent !important;
}
.shadow-sm {
    margin-top: 20px;
    margin-left: 5px;
    margin-right: 5px;
}
.cart-success {
    padding: 15px;
}
</style>
