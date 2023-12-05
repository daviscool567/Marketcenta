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
        <form @submit.prevent="updatePassword" class=" mt-4">
            <div class="alert alert-danger" v-if="errorMsg" style="margin-left: 10px; margin-right: 10px">
                <p style="margin-bottom: 0 !important; margin-top: 0 !important" v-for="(msg, i) in errorMsg" :key="i">
                {{ msg.message }}
                </p>
            </div>
            <div>
                <ion-item>
                    <ion-label position="floating">Old Password</ion-label>
                    <ion-input type="password" v-model="form.oldpassword" required></ion-input>
                </ion-item>
                <ion-item class="mt-3">
                    <ion-label position="floating">New Password</ion-label>
                    <ion-input type="password" v-model="form.password" @change="checkConfirm" required></ion-input>
                </ion-item>
                <ion-item class="mt-3">
                    <ion-label position="floating">Confirm New Password</ion-label>
                    <ion-input type="password" v-model="form.confirm" @change="checkConfirm"></ion-input>
                </ion-item>
                <p v-if="confirmError" class="text-danger error-p">{{confirmError}}</p>
            </div>
            <div class="order-btn">
                <ion-button
                    class="mb-3"
                    color="primary"
                    expand="block"
                    type="submit"
                >
                    CHANGE
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
            form: {
                oldpassword: "",
                password: "",
                confirm: "",
                id: this.userData.id,
            },
            confirmError: "",
            errorMsg: "",
        }
    },
    methods: {
        ...mapActions(["showUser"]),
        updatePassword() {
            if (this.confirmError == "") {
                this.presentLoading('Updating');
                axios
                .post(this.dynamic_auth_route("user/password/change"), this.form, {
                    headers: {
                    authorization: `Bearer ${this.authToken}`,
                    },
                })
                .then(() => {
                    this.openToast("Password Changed successfully", 'success');
                    this.dismissModal();
                })
                .catch((err) => {
                    this.errorMsg = err.response.data;
                })
                .finally(() => {
                    this.dismissLoading();
                });
            }
        },
        checkConfirm() {
            this.confirmError = "";
            if (this.form.confirm != "" && this.form.password != "") {
                if (this.form.confirm != this.form.password) {
                this.confirmError = "Passwords do not match";
                }
            }
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
.error-p {
    margin: 2px 15px !important;
    font-size: 12px;
}
</style>
