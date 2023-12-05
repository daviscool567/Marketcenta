<template>
    <ion-page>
        <BaseLayout>
          <div>
            <div class="main">
                <div class="jumbotron py-3 px-3 bg-dark text-white">
                    <h6>FREQUENTLY ASKED QUESTIONS</h6>
                </div>
                <button class="accordion">What is Marketcenta?</button>
                <div class="panel">
                    <p>
                        Marketcenta is an online platform that brings together 
                        several products at incredible prices we connect Farmers 
                        directly to consumers with aim to buy fresh foods from the farm. 
                        Through a simple click we deliver directly to your door steps.
                    </p>
                </div>

                <button class="accordion">I want to order, How does Marketcenta work?</button>
                <div class="panel">
                    <p>
                        1. Marketcenta is free to download from App stores on
                        Android and iOS devices or you can order directly on
                        our website at www.marketcenta.com
                    </p>
                    <p>
                        2. You can start shopping instantly as a guest or you can
                        create an account on the Marketcenta App or on the
                        website and have access to fresh farm produce and
                        several other items at cheapest price, shoppers on the
                        platform can spilt payment on a particular item by
                        inviting friends and families to join in sharing the
                        product bought on the platform were invitee or other
                        member pay their fair share through their wallets for
                        that particular item and all payments are made through
                        Flutterwave or bank transfer.
                    </p>
                    <p>
                    3. A confirmation of your registration will be sent to
                    your email address.
                    </p>
                </div>

                <button class="accordion">How do Marketcenta deliver?</button>
                <div class="panel">
                    <p>
                        On Marketcenta platform you can either choose to pick
                        up your groceries at a nearby pick up points at no
                        fees or choose to get your produce/ items deliver to
                        your door steps for a fee depending on your location.
                    </p>
                </div>

                <button class="accordion">What is Marketcenta Membership Program?</button>
                <div class="panel">
                    <p>
                        Marketcenta membership program are subscribed members
                        with the platform in different membership categories :
                        Personal Memberships (for individual), Group
                        Memberships( For Cooperatives societies, Clubs,
                        organizations) , Business Memberships (for all
                        Business organization ) , and Students Memberships (
                        for all higher learning institutional students).
                    </p>
                </div>

                <button class="accordion">Why will I become a member?</button>
                <div class="panel">
                    <p>
                        Our Membership programs comes with incentives and
                        benefits, the membership has a membership fee to be
                        paid at the point of registration and its valid for
                        12months renewable, as a subscribe member you get the
                        best discount offers , you are allow to buy food and
                        pay as you want either immediately or pay at a later
                        date but you can not buy on credit beyond your
                        membership subscription limit, get delivery for free
                        on certain amount of purchases.
                    </p>
                </div>

                <button class="accordion">Why Partner with us?</button>
                <div class="panel">
                    <p>
                        Becoming a partner of Marketcenta means responding to 
                        the new needs of customers and entering a constantly growing market.
                    </p>
                    <p>
                        Acquire new customers and retain current customers, you will be able 
                        to acquire new customers who already use Marketcenta and offer an 
                        additional service to your "multi-channel" customers.
                    </p>
                </div>

                <button class="accordion">Can I cancel my Membership subscription and get refund.?</button>
                <div class="panel">
                    <p>
                        You can cancel you subscription and get refund but you
                        will allow 15-20 days from the time of cancellation
                        request and only if you have not placed orders in this
                        time frame.
                    </p>
                </div>

                <button class="accordion">Can I return order or get refund?</button>
                <div class="panel">
                    <p>
                        Return is possible if the product received is
                        different from what is shown or describe on the
                        platform and you will have to make complain with our
                        customer services for refund or exchange of product .
                        please note that refund is processed within 24hrs .
                    </p>
                </div>

                <button class="accordion">The E-wallet on the Platform?</button>
                <div class="panel">
                    <p>
                        With the E-wallet you can save as low as N 1000 or more into 
                        the e-wallet for future purchases on the platform and also pay 
                        subscription membership fee into the wallet in which you will 
                        be able to view both your total amount in the wallet and your 
                        subscription deposit (Credit limit for members who wish to buy 
                        on credit and pay back at a later date)
                    </p>
                    <p>
                        Payment into the electronic wallet can be made through flutterwave 
                        or direct bank transfer.
                    </p>
                </div>

                <button class="accordion">Payment on Delivery?</button>
                <div class="panel">
                    <p>
                        Marketcenta do not accept payment on delivery all
                        payment are made online before items are dispatched.
                    </p>
                </div>

                <button class="accordion">Is my Payment information safe?</button>
                <div class="panel">
                    <p>
                        Our platform uses flutterwave payment gateway which is safe 
                        and pci-dss compliant. (<a href="https://www.pcisecuritystandards.org/faqs">https://www.pcisecuritystandards.org/faqs</a>)
                    </p>
                </div>

                <button class="accordion">How can I contact Marketcenta?</button>
                <div class="panel">
                    <p>
                        You can chat with us on our WhatsApp, follow us on all
                        social media handles Or give us a call :
                        +2347038894331, +2348034249104
                    </p>
                </div>
            </div>
          </div>
        </BaseLayout>
    </ion-page>
</template>
<script>
import { defineComponent } from 'vue';
import { IonPage } from '@ionic/vue';
import BaseLayout from '@/components/BaseLayout'


export default defineComponent({
    components: {
        BaseLayout,
        IonPage,
    },
    mounted() {
        var acc = document.getElementsByClassName("accordion");
        var i;
        for (i = 0; i < acc.length; i++) {
            acc[i].addEventListener("click", function() {
                this.classList.toggle("active");
                var panel = this.nextElementSibling;
                if (panel.style.maxHeight) {
                    panel.style.maxHeight = null;
                } else {
                    panel.style.maxHeight = panel.scrollHeight + "px";
                } 
            });
        }
    }
});
</script>
<style scoped>
.accordion {
  background-color: #eee;
  color: #444;
  cursor: pointer;
  padding: 18px;
  width: 100%;
  border: none;
  text-align: left;
  outline: none;
  font-size: 15px;
  transition: 0.4s;
  line-height: 1.5;
}

.active, .accordion:hover {
  background-color: #ccc;
}

.accordion:after {
  content: '\002B';
  color: #777;
  font-weight: bold;
  float: right;
  margin-left: 5px;
}

.active:after {
  content: "\2212";
}

.panel {
  padding: 0 18px;
  background-color: white;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.2s ease-out;
}
.panel p {
    font-size: 14px;
    line-height: 1.8;
    margin-bottom: 10px !important;
}
</style>