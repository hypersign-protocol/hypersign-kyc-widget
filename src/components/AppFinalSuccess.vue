<template>
  <div class="card maincontainer">
    <NavBar />
    <div class="card-body">
      <p>
        <i class="bi bi-check-circle final-msg-icon success"></i>
      </p>
      <h5 class="">You ID is verified!</h5>

      <VerificationDetails />
    </div>
    <div class="card-footer"><PoweredBy /></div>
  </div>
</template>

<script type="text/javascript">
import PoweredBy from "./commons/PoweredBy.vue";
import VerificationDetails from "./commons/VerificationDetails.vue";
export default {
  name: "AppFinalSuccess",
  components: {
    PoweredBy,
    VerificationDetails,
  },
  mounted() {
    this.$emit("finalresult", "Ok");
  },
};
</script>
<style type="text/css" scoped>
.success {
  color: green;
}
</style>
