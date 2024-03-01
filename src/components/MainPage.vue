<template>
  <div style="padding-top: 10px">
    <template>
      <div class="card maincontainer" style="text-align: center;">
        <NavBar />
        <!-- <Stepper /> -->
        <component :is="getActiveStep.stepName"> </component>
        <MessageBox :msg="toastMessage" :type="toastType" v-if="isToast" />
        <div class="card-footer">
          <PoweredBy />
        </div>
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
import Liveliness from './e-kyc/Liveliness.vue';
import IdDocs from './e-kyc/IdentityDocuments.vue'
import PreviewData from './e-kyc/Preview.vue'
import FinalResult from './e-kyc/Result.vue'
import { mapGetters } from "vuex";
import Stepper from "./commons/Stepper.vue"

export default {
  name: "HelloWorld",
  components: {
    AppInstructions,
    AppScanQR,
    AppClickPic,
    AppFinalSuccess,
    AppFinalFail,
    AppOtp,
    Liveliness,
    IdDocs,
    PreviewData,
    FinalResult,
    Stepper
  },
  computed: {
    ...mapGetters(["getActiveStep"]),
  },
};
</script>
