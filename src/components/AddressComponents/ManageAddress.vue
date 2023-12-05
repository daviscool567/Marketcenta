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
    <div v-if="loading">
      <SkeletonText />
    </div>
    <div v-else>
      <div class="d-flex ion-padding mb-3">
        <h5 style="margin-bottom: 0 !important">My Addresses</h5>
        <div class="ml-auto">
          <ion-button
            color="primary"
            size="sm"
            fill="outline"
            class="add-address"
            @click="createAddress"
          >
            ADD NEW ADDRESS
          </ion-button>
        </div>
      </div>
      <div>
        <div v-if="addresses.length">
          <div v-for="(add, i) in addresses" :key="i">
              <div class="bg-address">
                  <div class="d-flex">
                      <ion-list>
                          <ion-radio-group v-model="selectedAddress">
                              <ion-item class="border-none">
                                  <ion-label class="address-content">
                                      <h5 style="font-weight: 600; font-size: 16px">{{ add.label }}</h5>
                                      <p>{{ add.street_address }}, {{ add.name }}</p>
                                      <p v-if="add.direction">{{ add.direction }}</p>
                                      <p>{{ add.phone }}</p>
                                      <p v-if="add.second_number">{{ add.second_number }}</p>
                                  </ion-label>
                                  <ion-radio slot="start" :value="add" :checked="add == defaultAdd"></ion-radio>
                              </ion-item>
                          </ion-radio-group>
                      </ion-list>
                      <div class="ml-auto">
                          <a @click=" setCurrent(add); updateAddress()">EDIT</a>
                      </div>
                  </div>
              </div>
          </div>
          <div class="order-btn">
          <ion-button
              class="mb-3"
              color="primary"
              expand="block"
              @click="useAddress"
          >
              USE ADDRESS
          </ion-button>
          <ion-button type="button" style="margin-top: 15px" color="light" @click="dismissModal" expand="block">
              CANCEL
          </ion-button>
      </div>

        </div>
        <div v-else class="alert alert-info" style="margin: 10px">
          <h6>No address created yet</h6>
        </div>
      </div>
    </div>
  </ion-content>
</template>
<script>
import { defineComponent } from 'vue'
import  { IonItem, IonHeader, IonToolbar, IonTitle, IonList,
IonLabel, IonButton, IonButtons, IonRadio, IonRadioGroup, IonContent, IonIcon } from '@ionic/vue'
import { closeOutline } from 'ionicons/icons';
import { modalController } from "@ionic/vue";
import axios from "axios";
import { mapActions, mapGetters } from "vuex";
import CreateAddress from '@/components/AddressComponents/CreateAddress'
import EditAddress from '@/components/AddressComponents/EditAddress'
import SkeletonText from '@/components/SkeletonText'
export default defineComponent({
  components: {
    IonItem,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonLabel,
    IonButton,
    IonButtons,
    IonRadioGroup,
    IonRadio, 
    IonList,
    IonContent,
    IonIcon,
    SkeletonText
  },
  props: {
      title: String,
      defaultAdd: Object
  },
  computed: mapGetters(["auth_token", "addresses"]),
  data() {
    return {
      loading: false,
      useLoading: false,
      selectedAddress: this.defaultAdd,
      currentAddress: {},
      closeOutline
    };
  },
  mounted() {
    this.getAuthData();
    this.fetchAdd();
  },
  methods: {
    ...mapActions(["getAuthData", "fetchDefaultAddress", "fetchUserAddress"]),
    async fetchAdd() {
      this.loading = true
      await this.fetchUserAddress()
      this.loading = false
    },
    useAddress() {
      this.presentLoading('Setting default address');
      axios
        .post(
          this.dynamic_auth_route("user/address/default"),
          this.selectedAddress,
          {
            headers: {
              authorization: `Bearer ${this.auth_token}`,
            },
          }
        )
        .then((res) => {
          if (res.data.status == "success") {
            this.fetchDefaultAddress()
            this.openToast(res.data.message, 'success');
            this.dismissModal();
          }
        })
        .catch((error) => {
            this.openToast("An error occured. Please, try again.", 'danger');
            this.tokenExpired(error);
        })
        .finally(() => {
          this.dismissLoading();
        });
    },
    async createAddress() {
        const modal = await modalController.create({
          component: CreateAddress,
          cssClass: 'my-custom-class',
          componentProps: {
            title: 'Create Address',
          },
        });
        return modal.present();
    },
    async updateAddress() {
        const modal = await modalController.create({
          component: EditAddress,
          cssClass: 'my-custom-class',
          componentProps: {
            title: `Edit ${this.currentAddress.label} Address`,
            currentAddress:this.currentAddress
          },
        });
        return modal.present();
    },
    setCurrent(add) {
      this.currentAddress = add;
    },
    async dismissModal() {
        await modalController.dismiss();
    }
  },
});
</script>
<style scoped>
.add-address {
  font-size: 13px !important;
  font-weight: 600;
  color: #f26b31;
}
.add-address:hover {
  color: #ffffff !important;
}
.bg-address {
  border-radius: 4px;
  border: 1px solid #ededed;
  padding: 8px 15px 8px 1px;
  word-break: break-all;
}
.address-content{
    width: 220px;
    white-space: normal !important;
}
.address-content h5 {
  font-size: 22px;
}
.address-content p {
  font-size: 14px;
  line-height: 1.6 !important;
}
.border-none {
    --border-color: transparent !important;
}
.order-btn {
    padding: 20px 10px 20px;
}
</style>
