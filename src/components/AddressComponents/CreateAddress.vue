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
        <form @submit.prevent="createAddress" class=" mt-4">
            <div>
                <ion-item>
                    <ion-label position="floating">Address Label</ion-label>
                    <ion-input type="text" v-model="form.label" required></ion-input>
                </ion-item>
                <ion-item class="mt-3">
                    <ion-label position="floating">Phone Number</ion-label>
                    <ion-input type="text" v-model="form.phone" required></ion-input>
                </ion-item>
                <ion-item class="mt-3">
                    <ion-label position="floating">House / Office Number</ion-label>
                    <ion-input type="text" v-model="form.number2"></ion-input>
                </ion-item>
                <ion-item class="mt-3">
                    <ion-label position="floating">Street Address</ion-label>
                    <ion-input type="text" v-model="form.address"></ion-input>
                </ion-item>
                <ion-item class="mt-3">
                    <ion-label position="floating">Direction / Landmark</ion-label>
                    <ion-input type="text" v-model="form.description"></ion-input>
                </ion-item>
                <ion-item class="mt-3">
                    <ion-label>City</ion-label>
                    <ion-select v-model="form.cityId" ok-text="Select" cancel-text="Cancel" required>
                        <ion-select-option v-for="city in cities" :key="city.id" :value="city.id">
                            {{ city.name }}
                        </ion-select-option>
                    </ion-select>
                </ion-item>
            </div>
            <div class="order-btn">
                <ion-button
                    class="mb-3"
                    color="primary"
                    expand="block"
                    type="submit"
                >
                    CREATE
                </ion-button>
                <ion-button type="button" style="margin-top: 15px" color="light" @click="dismissModal" expand="block">
                    CANCEL
                </ion-button>
            </div>
        </form>
    </ion-content>
</template>
<script>
import { defineComponent } from 'vue'
import  { IonInput, IonItem, IonHeader, IonToolbar, IonTitle, 
IonLabel, IonButton, IonButtons, IonSelect, IonSelectOption, IonContent, IonIcon } from '@ionic/vue'
import { closeOutline } from 'ionicons/icons';
import { modalController } from "@ionic/vue";
import { mapActions, mapGetters } from "vuex";
import axios from "axios";

export default defineComponent({
    props: {
        title: String,
        userData: Object,
        authToken: String,
    },
    components: {
        IonInput,
        IonItem,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonLabel,
        IonButton,
        IonButtons,
        IonSelect,
        IonSelectOption,
        IonContent, 
        IonIcon
    },
    computed: mapGetters(["auth_token", "auth_user"]),
    data() {
        return {
            closeOutline,
            cities: {},
            form: {
                label: "",
                phone: "",
                number2: "",
                address: "",
                description: "",
                cityId: "",
            },
        }
    },
    mounted() {
        this.getAuthData();
        this.fetchCities();
    },
    methods: {
        ...mapActions(["getAuthData","fetchUserAddress"]),
        fetchCities() {
            this.presentLoading('Loading');
            axios
                .get(this.dynamic_auth_route("cities"), {
                headers: {
                    authorization: `Bearer ${this.auth_token}`,
                },
                })
                .then((res) => {
                    this.cities = res.data;
                })
                .catch((error) => {
                this.tokenExpired(error);
                })
                .finally(() => {
                    this.dismissLoading();
                });
        },
        createAddress() {
            this.presentLoading('Creating');
            this.form.id = this.auth_user.id;
            axios
                .post(this.dynamic_auth_route("user/address/create"), this.form, {
                headers: {
                    authorization: `Bearer ${this.auth_token}`,
                },
                })
                .then((res) => {
                    if (res.data.status == "success") {
                        this.openToast(res.data.message, 'success');
                        this.fetchUserAddress()
                        this.dismissModal();
                    }
                })
                .catch((error) => {
                    this.tokenExpired(error);
                })
                .finally(() => {
                    this.dismissLoading();
                });
        },
        async dismissModal() {
            await modalController.dismiss();
        }
        
    }
})
</script>
<style scoped>
.order-btn {
    padding: 30px 10px 10px;
}
</style>
