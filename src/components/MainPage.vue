<template>
  <div style="padding-top: 10px">
    <template>
      <component :is="getActiveStep.stepName"> </component>
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
import { mapGetters } from "vuex";
export default {
  name: "HelloWorld",
  components: {
    AppInstructions,
    AppScanQR,
    AppClickPic,
    AppFinalSuccess,
    AppFinalFail,
    AppOtp,
  },
  computed: {
    ...mapGetters(["getActiveStep"]),
  },
};
</script>
