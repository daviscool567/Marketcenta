<template>
    <ion-page>
      <div v-if="loading">
        <SkeletonText />
      </div>
      <BaseLayout v-else>
        <div class="account">
            <ion-card class="card ion-padding">
                <h6 class="overview">ACCOUNT OVERVIEW</h6>
                <div class="reffered">
                    <div class="referred-header">
                      <div class="d-flex reffered-inner">
                          <h6 class="referred-title">ACCOUNT DETAILS</h6>
                          <div class="ml-auto edit-btn">
                          <i
                            @click="editAccount"
                            class="mdi mdi-pen"
                            style="color: #f26b31; cursor: pointer"
                          ></i>
                          </div>
                      </div>
                    </div>
                    <div class="referred-body">
                      <div class="d-flex mt-3 mb-2">
                          <img
                          :src="auth_user.avatar"
                          alt=""
                          width="70"
                          class="rounded-circle img-fluid"
                          />
                          <div class="mr-auto ml-2">
                          <p class="user-name">{{ auth_user.name }}</p>
                          <small class="user-email">{{ auth_user.email }}</small>
                          </div>
                      </div>
                      <div class="mt-3 mb-3">
                          <ion-button color="primary" size="small" @click="changePassword">
                            CHANGE PASSWORD
                          </ion-button>
                      </div>
                    </div>
                </div>
                <div class="reffered mt-4">
                  <div class="referred-header">
                    <div class="d-flex reffered-inner">
                      <h6 class="referred-title">ADDRESS BOOK</h6>
                      <div class="ml-auto edit-btn">
                        <i
                          class="mdi mdi-pen"
                          style="color: #f26b31; cursor: pointer"
                          @click="manageAddress"
                        ></i>
                      </div>
                    </div>
                  </div>
                  <div class="referred-body">
                    <div class="mt-1 mb-2 user-address" v-if="defaultAddress">
                      <p class="default">Your default shipping address:</p>
                      <h6 class="user-email mt-3">{{ defaultAddress.label }}</h6>
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
                    <div v-else class="alert alert-info my-4">
                      <h6>No default shipping address selected</h6>
                    </div>
                  </div>
              </div>
            </ion-card>
        </div>
      </BaseLayout>
    </ion-page>
</template>

<script>
import { defineComponent } from 'vue'
import  { IonCard, IonButton, IonPage, modalController } from '@ionic/vue'
import BaseLayout from '@/components/BaseLayout'
import EditUser from '@/components/AccountComponents/EditUser.vue'
import ChangePassword from '@/components/AccountComponents/ChangePassword'
import ManageAddress from '@/components/AddressComponents/ManageAddress'
import { mapActions, mapGetters } from 'vuex'
import SkeletonText from '@/components/SkeletonText'

export default defineComponent({
    name: 'Account',
    components: {
        IonCard,
        IonButton,
        BaseLayout,
        IonPage,
        SkeletonText
    },
    data() {
        return {
            shareLink: {
                link: 'https://marketcenta.com/rice/12333'
            },
            loading: false,
        }
    },
    computed: mapGetters(["auth_token", "auth_user", "defaultAddress"]),
    mounted() {
      this.getAuthData()
      this.fetchDefault()
    },
    methods: {
      ...mapActions(['getAuthData', 'fetchDefaultAddress']),
      async fetchDefault() {
        this.loading = true
        await this.fetchDefaultAddress()
        this.loading = false
      },
      async editAccount() {
        const modal = await modalController.create({
          component: EditUser,
          cssClass: 'my-custom-class',
          componentProps: {
            title: `Edit ${this.auth_user.name}'s details`,
            userData: this.auth_user,
            authToken: this.auth_token
          },
        });
        return modal.present();
      },
      async changePassword() {
        const modal = await modalController.create({
          component: ChangePassword,
          cssClass: 'my-custom-class',
          componentProps: {
            title: `Change ${this.auth_user.name}'s password`,
            userData: this.auth_user,
            authToken: this.auth_token
          },
        });
        return modal.present();
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
    },
})
</script>
<style scoped>
.account {
  --padding-start: 5px !important;
  --padding-end: 5px !important;
  padding-top: 30px !important;
  padding-bottom: 10px !important;
  -webkit-padding-start: 5px;
  -webkit-padding-end: 5px;
}
.reffered {
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  box-shadow: 0 0 1px 1px hsl(0deg 0% 0% / 5%);
}
.referred-header {
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 0 1px 1px hsl(0deg 0% 0% / 5%);
  /* padding: 10px 15px; */
  background-color: #fcfcfc;
  color: #333333;
}
.referred-body {
  padding: 10px 15px;
}
.reffered-inner {
  padding: 5px 15px;
}
.user-name {
  margin-bottom: 0 !important;
  font-size: 18px;
  margin-top: 10px !important;
  font-weight: 600;
  color: #333333;
  line-height: 1.8;
}
.user-email {
  font-size: 14px;
  color: #666666;
}
.user-address .default {
  font-weight: 400;
  font-size: 16px;
  color: #333333 !important;
}
.user-address h6 {
  color: #777777 !important;
  font-size: 16px;
}
.user-address p {
  color: #777777 !important;
  margin-bottom: 2px !important;
  font-size: 13px;
}
.edit-btn {
  margin-top: 16px !important;
  margin-bottom: 10px !important;
}
.overview {
  color: #333333;
  margin-top: 10px !important;
  margin-bottom: 25px !important;
}
</style>
