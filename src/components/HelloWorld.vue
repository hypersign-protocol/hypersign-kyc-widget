<template>
  <div>
    <!-- Instructions Page-->
    <AppInstructions />

    <!-- Scan QR code Page -->
    <AppScanQR />

    <!-- Click Picture Page-->
    <AppClickPic />

    <!-- Success Page -->
    <AppFinalSuccess />

    <!-- Fail Page-->
    <AppFinalFail />
  </div>
</template>

<script>
import AppInstructions from "../components/AppInstructions.vue";
import AppScanQR from "../components/AppScanQR.vue";
import AppClickPic from "../components/AppClickPic.vue";
import AppFinalSuccess from "../components/AppFinalSuccess.vue";
import AppFinalFail from "../components/AppFinalFail.vue";
export default {
  name: "HelloWorld",
  components: {
    AppInstructions,
    AppScanQR,
    AppClickPic,
    AppFinalSuccess,
    AppFinalFail,
  },
  props: {
    msg: String,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
