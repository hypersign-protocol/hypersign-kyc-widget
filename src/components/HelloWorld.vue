<template>
  <div style="padding-top: 20px">
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
import AppFinalFail from "../components/AppFinalFail.vue";
import { mapGetters } from "vuex";
export default {
  name: "HelloWorld",
  components: {
    AppInstructions,
    AppScanQR,
    AppClickPic,
    AppFinalSuccess,
    AppFinalFail,
  },
  computed: {
    ...mapGetters(["getActiveStep"]),
  },
  props: {
    msg: String,
  },
  created() {
    console.log(this.$store.getters.getActiveStep);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
