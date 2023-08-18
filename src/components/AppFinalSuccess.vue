<template>
  <div class="card maincontainer">
    <NavBar />
    <div class="card-body">
      <p>
        <i class="bi bi-check-circle final-msg-icon success"></i>
      </p>
      <h5 class="">Verified Successfully!</h5>

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
};
</script>
<style type="text/css" scoped>
.final-msg-icon {
  font-size: 150px;
}

.success {
  color: green;
}
</style>
