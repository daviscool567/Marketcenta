<template>
    <ion-content>
        <ion-header>
            <ion-toolbar>
                <ion-title>{{ title }}</ion-title>
                <ion-buttons slot="end">
                    <ion-button color="dark" @click="dismissModal">
                        <ion-icon slot="icon-only" :icon="closeOutline"></ion-icon>
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <div class=" order-detail ion-padding">
            <div class="mb-3">
                <h6>Order No: {{ details.order_number }}</h6>
                <p>Placed on: {{ formatDate(details.created_at) }}</p>
                <p v-if="details.quantity">No of Items: {{ details.quantity }}</p>
                <p v-else>Shared with: {{ details.sharing_num }} people</p>
                <p v-if="details.add_shipping">
                    <span v-if="details.sharing_num">
                    Total: &#8358;
                    {{
                        (Number(details.price) / Number(details.sharing_num) + Number(details.add_shipping)).toLocaleString()
                    }}
                    </span>
                    <span v-else>
                    Total: &#8358;
                    {{
                        Number(
                        Number(details.price) + Number(details.add_shipping)
                        ).toLocaleString()
                    }}
                    </span>
                </p>
                <p v-else>
                    <span v-if="details.sharing_num">
                    Total: &#8358;{{
                        (Number(details.price) / Number(details.sharing_num)).toLocaleString()
                    }}
                    </span>
                    <span v-else>
                    Total: &#8358;{{ Number(details.price).toLocaleString() }}
                    </span>
                </p>
            </div>
            <div class="divider"><h5>ITEMS IN YOUR ORDER</h5></div>
            <div>
                <div
                    class="badge mt-md-2 mt-2 text-uppercase px-2 py-1"
                    style="font-size: 10px"
                    :class="{
                    'badge-success': details.status == 'delivered',
                    'badge-warning': details.status == 'shipped',
                    'badge-info': details.status == 'pending',
                    'badge-danger': details.status == 'cancelled',
                    'badge-secondary': details.status == 'refunded',
                    }"
                >
                    {{ details.status }}
                </div>
                <h6><b>On </b></h6>
                <div class="mt-3 mb-3">
                    <div class="d-flex">
                    <img
                        class="mr-3"
                        :src="details.image[0].image"
                        width="60"
                        height="60"
                        alt=""
                    />
                    <div class="mr-auto">
                        <h6>{{ details.name }}</h6>
                        <p style="font-size: 12px">QTY: {{ details.quantity }}</p>
                        <p style="font-weight: 700; color: #777777; margin-top: 5px">
                        &#8358; {{ Number(details.price).toLocaleString() }}
                        </p>
                    </div>
                    </div>
                </div>
                <div class="divider"><h5>PAYMENT</h5></div>
                <div class="my-2 pb-2" style="border-bottom: 1px solid #dddddd">
                    <h6>Payment Method</h6>
                    <p>
                    {{
                        details.delivery_type == "door" ? "Door delivery" : "Pickup Station"
                    }}
                    </p>
                </div>
                <div class="mb-2" style="margin: 10px 0">
                    <h6>Payment Details</h6>
                    <p class="mt-1">
                    Items Total: &nbsp;
                    <span class="font-weight-bold text-dark">
                        &#8358; {{ Number(details.price).toLocaleString() }}
                    </span>
                    </p>
                    <p>
                    Shipping Fees: &nbsp;
                    <span class="font-weight-bold text-dark"
                        >&#8358;
                        {{
                        details.add_shipping
                            ? Number(details.add_shipping).toLocaleString()
                            : "FREE"
                        }}
                    </span>
                    </p>
                    <p v-if="details.add_shipping">
                    Total: &nbsp;
                    <span class="font-weight-bold text-dark">
                        &#8358;
                        {{
                        Number(
                            Number(details.price) + Number(details.add_shipping)
                        ).toLocaleString()
                        }}
                    </span>
                    </p>
                    <p v-else>
                    Total: &nbsp;
                    <span class="font-weight-bold text-dark">
                        &#8358;{{ Number(details.price).toLocaleString() }}
                    </span>
                    </p>
                </div>
                <div class="divider"><h5>DELIVERY</h5></div>
                <div class="my-2 pb-2" style="border-bottom: 1px solid #dddddd">
                    <h6>Delivery Option</h6>
                    <p>
                    {{
                        details.delivery_type == "door"
                        ? "Delivery to selected address"
                        : "Delivery at a pickup station"
                    }}
                    </p>
                </div>
                <div v-if="details.delivery_type == 'door'" style="margin: 10px 0">
                    <h6>{{ details.label }}</h6>
                    <p class="mt-1">{{ details.street_address }}, {{ details.add_city }}</p>
                    <p>{{ details.direction }}</p>
                    <p>{{ details.phone }}</p>
                    <p>{{ details.second_number }}</p>
                    <p>Delivery Note: {{ details.delivery_note }}</p>
                    <p>
                    {{
                        details.delivery_time == "morning"
                        ? "Morning (10am - 1pm)"
                        : "Evening (4pm - 8pm)"
                    }}
                    </p>
                </div>
                <div v-if="details.delivery_type == 'pickup'" style="margin: 10px 0">
                    <h6>{{ details.title }}</h6>
                    <p class="mt-1">{{ details.pst_add }}, {{ details.pickup_location }}</p>
                    <p>{{ details.pst_direction }}</p>
                    <p class="mt-2">
                    <span style="font-weight: 500">Opening Hours:</span> <br />
                    {{ details.opening_hours }}
                    </p>
                    <p>{{ details.second_number }}</p>
                    <p class="mt-2">
                    <span style="font-weight: 500">Delivery Note: </span> <br />
                    {{ details.delivery_note }}
                    </p>
                    <p class="mt-2">
                    <span style="font-weight: 500">Delivery Time: </span>
                    {{
                        details.delivery_time == "morning"
                        ? "Morning (10am - 1pm)"
                        : "Evening (4pm - 8pm)"
                    }}
                    </p>
                    <p class="mt-2"><a href="#">See Location</a></p>
                </div>
            </div>
        </div>
    </ion-content>
</template>
<script>
import { defineComponent } from 'vue'
import  { IonHeader, IonToolbar, IonTitle, IonButton, IonButtons, IonContent } from '@ionic/vue'
import { closeOutline } from 'ionicons/icons';
import { modalController } from "@ionic/vue";
import { mapActions } from "vuex";
import axios from "axios";
import moment from 'moment'

export default defineComponent({
    props: {
        title: String,
        details: Object,
    },
    components: {
        IonHeader,
        IonToolbar,
        IonTitle,
        IonButton,
        IonButtons,
        IonContent,
    },
    data() {
        return {
            closeOutline,
            form: this.userData
        }
    },
    methods: {
        ...mapActions(["showUser"]),
        updateUser() {
            this.presentLoading('Updating');
            axios
                .post(this.dynamic_auth_route("user/update"), this.form, {
                headers: {
                    authorization: `Bearer ${this.authToken}`,
                },
                })
                .then((res) => {
                    this.openToast(res.data.message, 'success');
                    this.showUser(this.form.id);
                    this.dismissModal();
                })
                .catch((error) => {
                    this.openToast("An error occured. Please, try again.", 'danger');
                    this.tokenExpired(error);
                })
                .finally(() => {
                    this.dismissLoading();
                });
        },
        async dismissModal() {
            await modalController.dismiss();
        },
        formatDate(date) {
            return moment(date).format("D-MM-YYYY");
        },
    }
})
</script>
<style scoped>
.order-detail h6 {
  font-size: 14px;
  margin-bottom: 0 !important;
  margin-top: 0 !important;
  line-height: 1.5;
}
.order-detail h5 {
  font-size: 14px;
  margin-bottom: 0 !important;
  margin-top: 0 !important;
  line-height: 1.5;
}
.order-detail p {
  font-size: 14px;
  margin-bottom: 2px !important;
  margin-top: 0 !important;
  line-height: 1.5;
}
.divider {
  background-color: #dddddd;
  padding: 5px 5px;
  margin-bottom: 10px;
}
</style>
