<template>
    <div>
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
        <form @submit.prevent="updateUser" class=" mt-4">
            <div>
                <ion-item>
                    <ion-label position="floating">Name</ion-label>
                    <ion-input type="text" v-model="form.name" required></ion-input>
                </ion-item>
                <ion-item class="mt-3">
                    <ion-label position="floating">Email</ion-label>
                    <ion-input type="email" v-model="form.email" required></ion-input>
                </ion-item>
                <ion-item class="mt-3">
                    <ion-label position="floating">Phone</ion-label>
                    <ion-input type="text" v-model="form.phone"></ion-input>
                </ion-item>
            </div>
            <div class="order-btn">
                <ion-button
                    class="mb-3"
                    color="primary"
                    expand="block"
                    type="submit"
                >
                    UPDATE
                </ion-button>
                <ion-button type="button" style="margin-top: 15px" color="light" @click="dismissModal" expand="block">
                    CANCEL
                </ion-button>
            </div>
        </form>
    </div>
</template>
<script>
import { defineComponent } from 'vue'
import  { IonInput, IonItem, IonHeader, IonToolbar, IonTitle, 
IonLabel, IonButton, IonButtons } from '@ionic/vue'
import { closeOutline } from 'ionicons/icons';
import { modalController } from "@ionic/vue";
import { mapActions } from "vuex";
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
        IonButtons
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
        }
        
    }
})
</script>
<style scoped>
.order-btn {
    padding: 30px 10px 10px;
}
</style>
