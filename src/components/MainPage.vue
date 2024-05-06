<template>
  <div class="mt-2">
    <template>
      <div class="container maincontainer" style="text-align: center;min-height: 80vh;">
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
import LiveLiness2 from './e-kyc/Liveliness.vue';
import IdDocs2 from './e-kyc/IdentityDocuments.vue'

import FinalResult from './e-kyc/Result.vue'
import { mapGetters } from "vuex";
import SignIn from "./e-kyc/SignIn.vue"
import VaultPIN from './e-kyc/VaultPIN.vue'
import UserConsent from './e-kyc/UserConsent.vue'
import OnChainId from "./e-kyc/OnChainId.vue";

export default {
  name: "HelloWorld",
  components: {
    AppInstructions,
    AppScanQR,
    AppClickPic,
    AppFinalSuccess,
    AppFinalFail,
    AppOtp,
    LiveLiness2,
    IdDocs2,
    FinalResult,
    SignIn,
    VaultPIN,
    UserConsent,
    OnChainId
  },
  computed: {
    ...mapGetters(["getActiveStep"]),
  },

};
</script>