<template>
    <ion-page>
      <BaseLayout>
        <div class="order">
            <ion-card class="card">
                <div class="text-center mt-4 mb-4">
                    <img src="../assets/images/marketlogosm.png" alt=""  width="100">
                </div>
                <!-- Scrollable Segment -->
                <ion-segment v-model="tab">
                    <ion-segment-button value="about">
                        <ion-label class="segment-button">About</ion-label>
                    </ion-segment-button>
                    <ion-segment-button value="terms">
                        <ion-label class="segment-button">Terms</ion-label>
                    </ion-segment-button>
                    <ion-segment-button value="privacy">
                        <ion-label class="segment-button">Privacy</ion-label>
                    </ion-segment-button>
                    <ion-segment-button value="return">
                        <ion-label class="segment-button">Return</ion-label>
                    </ion-segment-button>
                </ion-segment>
                <div class="order-content">
                    <div v-if="tab=='about'">
                        <About />
                    </div>
                    <div v-if="tab=='terms'">
                        <Terms />
                    </div>
                    <div v-if="tab=='privacy'">
                        <Privacy />
                    </div>
                    <div v-if="tab=='return'">
                        <Return />
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
import Terms from '@/views/Terms'
import Privacy from '@/views/Privacy'
import Return from '@/views/Return'
import About from '@/views/About'

export default defineComponent({
    name: 'Account',
    components: {
        IonCard,
        BaseLayout,
        IonPage,
        IonSegment, 
        IonSegmentButton, 
        IonLabel,
        Terms,
        Privacy,
        Return,
        About
    },
    data() {
        return {
            tab: 'about'
        }
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
