<template>
  <div class="row">
    <div class="col-md-4">
      ID Verification
      <aadhaarid></aadhaarid>
    </div>
    <div class="col-md-4">
      Day Pass From
      <daypassform></daypassform>
    </div>
    <div class="col-md-4">
      Payment Gateway
      <paymentgateway></paymentgateway>
    </div>
  </div>
</template>

<script type="text/javascript">
import daypassform from "./day-pass-form.vue";
import aadhaarid from "./aadhaar-id.vue";
import paymentgateway from "./payment-gateway.vue";
export default {
  name: "day-pass",
  components: {
    daypassform,
    aadhaarid,
    paymentgateway,
  },
};
</script>
