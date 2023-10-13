<template>
  <div>
    <template>
      <component :is="getActiveStep.stepName"> </component>
    </template>
  </div>
</template>

<script>
import AppInstructions from "../components/AppInstructions.vue";
import AppScanQR from "../components/AppScanQR.vue";
import AppClickPic from "../components/AppClickPic.vue";
import AppFinalSuccess from "../components/AppFinalSuccess.vue";
import { mapGetters } from "vuex";

export default {
  name: "AadhaarId",
  components: {
    AppInstructions,
    AppScanQR,
    AppClickPic,
    AppFinalSuccess,
  },
  computed: {
    ...mapGetters(["getActiveStep"]),
  },
};
</script>
