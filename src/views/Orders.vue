<template>
    <ion-page>
      <BaseLayout>
        <div class="order">
            <ion-card class="card ion-padding">
                <h5 class="overview">ORDERS</h5>
                <!-- Scrollable Segment -->
                <ion-segment v-model="tab">
                    <ion-segment-button value="open">
                        <ion-label class="segment-button">OPEN</ion-label>
                    </ion-segment-button>
                    <ion-segment-button value="closed">
                        <ion-label class="segment-button">CLOSED</ion-label>
                    </ion-segment-button>
                    <ion-segment-button value="credit">
                        <ion-label class="segment-button">ON CREDIT</ion-label>
                    </ion-segment-button>
                </ion-segment>
                <div class="order-content">
                    <div v-if="tab=='open'">
                        <OpenOrders />
                    </div>
                    <div v-if="tab=='closed'">
                        <ClosedOrders />
                    </div>
                    <div v-if="tab=='credit'">
                        <CreditPurchases />
                    </div>
                </div>
            </ion-card>
        </div>
      </BaseLayout>
    </ion-page>
</template>

<script>
import { defineComponent } from 'vue'
import  { IonCard, IonPage, IonSegment, IonSegmentButton, IonLabel } from '@ionic/vue'
import BaseLayout from '@/components/BaseLayout'
// import axios from "axios";
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment';
import OpenOrders from '@/components/OrdersComponent/OpenOrders'
import ClosedOrders from '@/components/OrdersComponent/ClosedOrders'
import CreditPurchases from '@/components/OrdersComponent/CreditPurchases'

export default defineComponent({
    name: 'Account',
    components: {
        IonCard,
        BaseLayout,
        IonPage,
        IonSegment, 
        IonSegmentButton, 
        IonLabel,
        OpenOrders,
        ClosedOrders,
        CreditPurchases,
    },
    data() {
        return {
            referred: {},
            tab: 'open'
        }
    },
    computed: mapGetters(["auth_token", "auth_user"]),
    mounted() {
    },
    methods: {
        ...mapActions(['getAuthData']),
        
        formatDate(date) {
            return moment(date).format("D-MM-YYYY");
        },
    },
})
</script>
<style scoped>
.overview {
  color: #111111;
  margin-top: 10px !important;
  margin-bottom: 25px !important;
  /* font-size: 24px; */
}
.order {
    margin-top: 20px;
}
.segment-button {
    color: #111111 !important;
}
.order-content {
    padding-top: 20px;
}
</style>
