<template>
    <ion-page>
      <BaseLayout>
        <div class="refer">
            <ion-card class="card ion-padding">
                <h6 style="margin-bottom: 0 !important" class="overview">REFER & EARN</h6>
                <div>
                    <div class="text-center refer-content">
                        <img
                            :src="auth_user.avatar"
                            class="img-fluid rounded-circle"
                            width="150"
                        />
                        <h5 style="margin-bottom: 0.5rem !important; margin-top: 0 !important; 
                            font-size: 1.25rem; color: #222222; line-height: 1.2; font-weight: 500">Referral Code
                        </h5>
                        <h2>{{ auth_user.referral_code }}</h2>
                        <p class="mb-3">
                            Invite friends with this referral code and earn
                            <span class="refer-prize">&#8358;1500</span>
                        </p>
                        <div class="alert alert-info d-flex">
                            <span class="ref-link">
                                {{ auth_user.referral_link }}
                            </span>
                            <div
                                class="ml-auto align-self-center refer_icon"
                                style="cursor: pointer"
                            >
                                <i class="mdi mdi-content-copy" @click="doCopy"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="reffered" v-if="referred.length != ''">
                        <h6>Referred Users ({{ referred.length }})</h6>
                        <hr />
                        <div class="d-flex mt-3 mb-2" v-for="(ref, i) in referred" :key="i">
                        <img :src="ref.avatar" alt="" width="50" />
                        <div class="mr-auto ml-2">
                            <p class="user-name">{{ ref.name }}</p>
                            <small class="user-date">{{
                                formatDate(ref.created_at)
                            }}</small>
                        </div>
                        </div>
                    </div>
                    <div class="alert alert-info mt-4" v-else>
                        <small style="font-size: 14px">No referred users</small>
                    </div>
                </div>
            </ion-card>
        </div>
      </BaseLayout>
    </ion-page>
</template>

<script>
import { defineComponent } from 'vue'
import  { IonCard, IonPage } from '@ionic/vue'
import BaseLayout from '@/components/BaseLayout'
import axios from "axios";
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment';
import { copyText } from 'vue3-clipboard'

export default defineComponent({
    name: 'Account',
    components: {
        IonCard,
        BaseLayout,
        IonPage,
    },
    data() {
        return {
            referred: {},
        }
    },
    computed: mapGetters(["auth_token", "auth_user"]),
    mounted() {
      this.fetchReferredUsers();
    },
    methods: {
        ...mapActions(['getAuthData']),
        fetchReferredUsers() {
            const userId = this.$store.state.user.id;
            this.loading = true;
            axios
                .get(this.dynamic_auth_route("user/referred/fetch/" + userId), {
                headers: {
                    authorization: `Bearer ${this.auth_token}`,
                },
                })
                .then((res) => {
                this.referred = res.data;
                })
                .catch((error) => {
                this.tokenExpired(error);
                })
                .finally(() => {
                this.loading = false;
                });
        },
        formatDate(date) {
            return moment(date).format("D-MM-YYYY");
        },
        doCopy() {
            const text = this.auth_user.referral_link
            copyText(text, undefined, (error) => {
                if (error) {
                    this.openToast(" cannot copy referral link", "danger");
                } else {
                    this.openToast("Referral Link Copied to clipboard", "success");
                }
            })
        },
    },
})
</script>
<style scoped>
.refer {
    margin-top: 20px;
}
.ref-link {
  white-space: nowrap;
  overflow: hidden;
  margin: 5px 10px 5px 5px;
  text-align: left !important;
}
.refer-content h2 {
  color: #4c1c80;
  font-weight: 500;
  font-size: 40px;
  margin-bottom: 15px !important;
  margin-top: 0 !important
}
.refer-content p {
    color: #222222;
    font-size: 15px;
    line-height: 1.5;
}
.refer-prize {
  font-weight: 700;
  font-size: 20px;
  color: green;
}
.reffered {
  border: 1px solid #e0e0e0;
  padding: 10px 15px;
  border-radius: 5px;
  box-shadow: 0 0 1px 1px hsl(0deg 0% 0% / 5%);
}
.user-name {
  margin-bottom: 0 !important;
  font-size: 14px;
  margin-top: 1px !important;
  font-weight: 600;
  color: #333333;
}
.user-date {
  font-size: 12px;
  color: #777777;
}
.overview {
  color: #333333;
  margin-top: 10px !important;
  margin-bottom: 25px !important;
}
</style>
