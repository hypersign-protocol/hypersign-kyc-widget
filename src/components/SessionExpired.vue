<template>
  <div>
    <div class="center">
      <div class="row">
        <div class="col-md-2"></div>
        <div class="col-md-8">
          <ul style="list-style-type:none;">
            <li>
              <i class="bi bi-x-circle final-msg-icon fail"></i>
            </li>
            <li>
              <h5>We are sorry!</h5>
            </li>
            <li>
              <h7>This session is expired. You can close the window and restrart the KYC process from the
                service provider's app</h7>
            </li>
          </ul>
        </div>
        <div class="col-md-2"></div>
      </div>
    </div>
    <div class="card-footer">
      <PoweredBy />
    </div>
  </div>
</template>

<script type="text/javascript">
import PoweredBy from "./commons/PoweredBy.vue";
// import VerificationDetails from "./commons/VerificationDetails.vue";
export default {
  name: "SessionExpired",
  components: {
    PoweredBy,
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
