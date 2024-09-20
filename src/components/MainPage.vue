<template>
  <div class="mt-2">
    <template>
      <div class="container maincontainer" style="text-align: center;min-height: 83vh; max-height: 90vh">
        <NavBar />
        <component :is="getActiveStep.stepName">
        </component>
      </div>
    </template>
  </div>
</template>

<script>
import AppInstructions from "./AppInstructions.vue";
import AppScanQR from "./AppScanQR.vue";
import AppClickPic from "./AppClickPic.vue";
import AppFinalSuccess from "./AppFinalSuccess.vue";
import AppFinalFail from "./AppFinalFail.vue";
import AppOtp from "./AppOtp.vue";
import LiveLiness3 from './e-kyc/Liveliness.vue';
import IdDocs4 from './e-kyc/IdentityDocuments.vue'

import FinalResult from './e-kyc/Result.vue'
import { mapGetters } from "vuex";
import SignIn from "./e-kyc/SignIn.vue"
import VaultPIN from './e-kyc/VaultPIN.vue'
import UserConsent from './e-kyc/UserConsent.vue'
import OnChainId4 from "./e-kyc/OnChainId.vue";

import SessionExpired from './SessionExpired.vue';

export default {
  name: "HelloWorld",
  components: {
    AppInstructions,
    AppScanQR,
    AppClickPic,
    AppFinalSuccess,
    AppFinalFail,
    AppOtp,
    LiveLiness3,
    IdDocs4,
    FinalResult,
    SignIn,
    VaultPIN,
    UserConsent,
    OnChainId4,
    SessionExpired
  },
  computed: {
    ...mapGetters(["getActiveStep"]),
  },

};
</script>