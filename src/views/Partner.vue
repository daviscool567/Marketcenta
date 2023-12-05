<template>
    <ion-page>
      <BaseLayout>
        <div>
            <ion-card>
                <ion-card-content>
                    <h5 class="header-title">Partner With Us</h5>
                    <p class="header-subtitle">
                        Submit your product details and we will add them to our catalogue
                        once approved
                    </p>
                    <form @submit.prevent="submitPartnership" class=" mt-4">
                        <div class="text-center my-2">
                            <img
                                v-if="url"
                                :src="url"
                                alt=""
                                style="max-width: 100%; max-height: 100px"
                            />
                        </div>
                        <div>
                            <ion-item class="mt-3">
                                <ion-label position="stacked">Product Image</ion-label>
                                <ion-input type="file" accept="png,jpg,jpeg" @change="onFileChange" required></ion-input>
                            </ion-item>
                            <ion-item class="mt-3">
                                <ion-label position="floating">Product Name</ion-label>
                                <ion-input type="text" v-model="name" required></ion-input>
                            </ion-item>
                            <ion-item class="mt-3">
                                <ion-label position="floating">Product Barcode Number</ion-label>
                                <ion-input type="text" v-model="barcode" required></ion-input>
                            </ion-item>
                            <ion-item class="mt-3">
                                <ion-label>Category</ion-label>
                                <ion-select v-model="categoryId" ok-text="Select" cancel-text="Cancel" required>
                                    <ion-select-option v-for="(c, i) in allCategories" :value="c.id" :key="i">
                                        {{ c.name }}
                                    </ion-select-option>
                                </ion-select>
                            </ion-item>
                            <ion-item class="mt-3">
                                <ion-label position="floating">Proposed Price (&#8358;)</ion-label>
                                <ion-input type="text" v-model="proposedPrice" required></ion-input>
                            </ion-item>
                            <ion-item class="mt-3">
                                <ion-label>Manufacturer's Country</ion-label>
                                <ion-select v-model="manufactureCountry" ok-text="Select" cancel-text="Cancel" required>
                                    <ion-select-option v-for="(c, i) in countries" :value="c.country" :key="i">
                                        {{ c.country }}
                                    </ion-select-option>
                                </ion-select>
                            </ion-item>
                            <ion-item>
                                <ion-label position="floating">Short Product Description</ion-label>
                                <ion-textarea v-model="description" cols="30" rows="2" required></ion-textarea>
                            </ion-item>
                            <ion-item>
                                <ion-label position="floating">Product Details</ion-label>
                                <ion-textarea v-model="details" cols="30" rows="2" required></ion-textarea>
                            </ion-item>
                            <div class="mt-3">
                                <ion-radio-group v-model="packaging">
                                    <ion-grid>
                                        <p style="margin: 2px 0 5px !important; font-size: 14px; color: #000000">
                                            Does your product have packaging? (optional)
                                        </p>
                                        <ion-row>
                                            <ion-col size="6">
                                                <ion-radio class="order-radio" value="yes"></ion-radio>
                                                <ion-label class="order-type">Yes</ion-label>
                                            </ion-col>
                                            <ion-col size="6">
                                                <ion-radio class="order-radio" value="no"></ion-radio>
                                                <ion-label class="order-type">No</ion-label>
                                            </ion-col>
                                        </ion-row>
                                    </ion-grid>
                                </ion-radio-group>
                            </div>
                            <div class="mt-3">
                                <ion-radio-group v-model="ingredient">
                                    <ion-grid>
                                        <p style="margin: 2px 0 5px !important; font-size: 14px; color: #000000">
                                            Does your product have Ingredients? (optional)
                                        </p>
                                        <ion-row>
                                            <ion-col size="6">
                                                <ion-radio class="order-radio" value="yes"></ion-radio>
                                                <ion-label class="order-type">Yes</ion-label>
                                            </ion-col>
                                            <ion-col size="6">
                                                <ion-radio class="order-radio" value="no"></ion-radio>
                                                <ion-label class="order-type">No</ion-label>
                                            </ion-col>
                                        </ion-row>
                                    </ion-grid>
                                </ion-radio-group>
                            </div>
                            <div class="mt-3">
                                <ion-radio-group v-model="nutritionLabel">
                                    <ion-grid>
                                        <p style="margin: 2px 0 5px !important; font-size: 14px; color: #000000">
                                            Does your product have Nutritional Label? (optional)
                                        </p>
                                        <ion-row>
                                            <ion-col size="6">
                                                <ion-radio class="order-radio" value="yes"></ion-radio>
                                                <ion-label class="order-type">Yes</ion-label>
                                            </ion-col>
                                            <ion-col size="6">
                                                <ion-radio class="order-radio" value="no"></ion-radio>
                                                <ion-label class="order-type">No</ion-label>
                                            </ion-col>
                                        </ion-row>
                                    </ion-grid>
                                </ion-radio-group>
                                <div v-if="nutritionLabel == 'yes'">
                                    <div class="text-center my-2">
                                        <img v-if="nutritionurl" :src="nutritionurl" alt=""
                                        style="max-width: 100%; max-height: 100px" />
                                    </div>
                                    <ion-item class="mt-3">
                                        <ion-label position="stacked">Upload Label</ion-label>
                                        <ion-input type="file" accept="png,jpg,jpeg" @change="onNutritionFileChange">
                                        </ion-input>
                                    </ion-item>
                                </div>
                            </div>
                            <div class="mt-3">
                                <ion-radio-group v-model="sellType">
                                    <ion-grid>
                                        <p style="margin: 2px 0 5px !important; font-size: 14px; color: #000000">
                                            Does your product require selling or retailing? (optional)
                                        </p>
                                        <ion-row>
                                            <ion-col size="6">
                                                <ion-radio class="order-radio" value="bulk"></ion-radio>
                                                <ion-label class="order-type">Bulk</ion-label>
                                            </ion-col>
                                            <ion-col size="6">
                                                <ion-radio class="order-radio" value="retailing"></ion-radio>
                                                <ion-label class="order-type">Retailing</ion-label>
                                            </ion-col>
                                        </ion-row>
                                    </ion-grid>
                                </ion-radio-group>
                            </div>
                        </div>
                        <div class="order-btn">
                            <ion-button
                                class="mb-3"
                                color="primary"
                                expand="block"
                                type="submit"
                            >
                                SUBMIT
                            </ion-button>
                            <ion-button type="button" style="margin-top: 15px" color="light" expand="block">
                                CLEAR
                            </ion-button>
                        </div>
                    </form>
                </ion-card-content>
            </ion-card>

            <GDialog v-model="partner_dialog" max-width="500" persistent>
                <ion-card>
                    <ion-card-content>
                        <div class="text-center">
                            <img
                                src="../assets/images/checkmark-removebg-preview.png"
                                width="100"
                            />
                            <p>Request Submitted successfully</p>
                            <p>
                            You will ne notified via email once your request is approved and
                            added to our catalogue
                            </p>
                        </div>
                        <div class="text-center order-btn">
                            <ion-button @click="closeDialog();navigate('/')" fill="outline" color="success" expand="block">
                                CONTINUE SHOPPING
                            </ion-button>
                            <ion-button style="margin-top: 15px" color="light" @click="partner_dialog = false" expand="block">
                                CLOSE
                            </ion-button>
                        </div>
                    </ion-card-content>
                </ion-card>
            </GDialog>  
        </div>
      </BaseLayout>
    </ion-page>
</template>

<script>
import { defineComponent } from 'vue'
import  { IonCard, IonPage, IonCardContent, IonInput, IonItem, IonLabel, IonCol, IonTextarea,
        IonButton, IonSelect, IonSelectOption, IonRadioGroup, IonRadio, IonGrid, IonRow } from '@ionic/vue'
import BaseLayout from '@/components/BaseLayout'
import axios from "axios";
import { mapActions, mapGetters } from 'vuex'
import { GDialog } from "gitart-vue-dialog";

export default defineComponent({
    name: 'Account',
    components: {
        IonCard,
        BaseLayout,
        IonPage,
        IonCardContent,
        IonInput,
        IonItem, IonTextarea,
        IonLabel, IonCol,
        IonButton, IonGrid, IonRow,
        IonSelect, IonRadio,
        IonSelectOption, IonRadioGroup,
        GDialog
    },
    data() {
        return {
            cities: {},
            url: "",
            nutritionurl: "",
            imgValue: "",
            nutritionimgValue: "",
            file_ext2: "",
            name: "",
            categoryId: "",
            manufactureCountry: "",
            description: "",
            details: "",
            proposedPrice: "",
            packaging: "",
            ingredient: "",
            nutritionLabel: "",
            sellType: "",
            privateLabel: "",
            barcode: "",
            countries: {},
            partner_dialog: false,
        }
    },
    computed: mapGetters(["auth_token", "auth_user", "allCategories"]),
    mounted() {
        this.getAuthData();
        this.fetchCountries();
        this.getCategories(this.dynamic_route("products/categories/fetch"));
    },
    methods: {
        ...mapActions(['getAuthData', "getCategories"]),
        ////////function to convert image to base64, show preview image, show image name
        onFileChange(e) {
        const file = e.target.files[0];
        //////variable to preview image (image local url)
        this.url = URL.createObjectURL(file);
        //////variable to show image name
        this.fileName = file.name;
        const allowed_file = file.type.split("/");
        this.file_ext = allowed_file[1];
        this.imgValue = file;
        },
        fetchCountries() {
        axios.get("https://countriesnow.space/api/v0.1/countries").then((res) => {
            this.countries = res.data.data;
        });
        },
        onNutritionFileChange(e) {
        const file = e.target.files[0];
        //////variable to preview image (image local url)
        this.nutritionurl = URL.createObjectURL(file);
        //////variable to show image name
        this.fileName = file.name;
        const allowed_file = file.type.split("/");
        this.file_ext2 = allowed_file[1];
        this.nutritionimgValue = file;
        },
        submitPartnership() {
        this.presentLoading('Submitting');
        let form = new FormData();

        form.append("userId", this.auth_user.id);
        form.append("name", this.name);
        form.append("categoryId", this.categoryId);
        form.append("manufactureCountry", this.manufactureCountry);
        form.append("description", this.description);
        form.append("details", this.details);
        form.append("proposedPrice", this.proposedPrice);
        form.append("packaging", this.packaging);
        form.append("ingredient", this.ingredient);
        form.append("nutritionLabel", this.nutritionLabel);
        form.append("sellType", this.sellType);
        form.append("privateLabel", this.privateLabel);
        form.append("productImage", this.imgValue);
        form.append("labelImage", this.nutritionimgValue);
        form.append("barcode", this.barcode);

        axios
            .post(this.dynamic_route("products/partner"), form, {
                headers: {
                    authorization: `Bearer ${this.auth_token}`,
                },
            })
            .then(() => {
                this.partner_dialog = true;
            })
            .catch((error) => {
                this.openToast("An error occured. Please, try again.", 'danger');
                this.tokenExpired(error);
            })
            .finally(() => {
                this.dismissLoading();
            });
        },
        closeDialog() {
            this.partner_dialog = false
        },
        navigate(url){
            this.$router.push(url);
        }
    },
})
</script>
<style scoped>
.order-type {
    margin-left: 7px !important;
    vertical-align: middle !important;
    opacity: 0.7 !important;
    font-size: 14px !important;
}
.order-btn {
    padding: 30px 0 10px;
}
.order-radio {
    vertical-align: middle !important;
}
.header-title {
  font-weight: 600;
  font-size: 19px;
  color: #222222;
  line-height: 2.0;
}
.header-subtitle {
  font-size: 13px;
  margin-top: 2px !important;
  margin-bottom: 10px !important;
  font-weight: 400;
  color: #888888;
}
</style>
