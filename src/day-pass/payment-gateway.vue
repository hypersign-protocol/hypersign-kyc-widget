<template>
  <div class="card maincontainer" style="text-align: left; padding: 10px">
    <load-ing
      :active.sync="isLoadingPage"
      :can-cancel="true"
      :is-full-page="true"
    ></load-ing>
    <div class="mb-3">
      <div v-if="!hasPaid" class="center" style="text-align: center">
        <div style="text-align: center">
          Scan the QR code to pay throug your UPI app. Once payment is done,
          press Submit
        </div>
        <i class="bi bi-qr-code" style="font-size: 200px"></i>
        <button class="btn btn-primary" @click="pay()">Submit</button>
      </div>
      <div v-else class="center" style="text-align: center">
        <i class="bi bi-check-circle-fill" style="font-size: 200px"></i>
        <!-- <i class="bi bi-check-circle final-msg-icon success"></i> -->
        <div style="text-align: center">You payment was successfully!</div>
      </div>
    </div>
  </div>
</template>

<script>
// import { HypersignDID } from "hs-ssi-sdk";

export default {
  data() {
    return {
      hasPaid: false,
      isLoadingPage: false,
    };
  },
  mounted() {
    window.addEventListener("beforeunload", () => {
      window.opener.postMessage("pay-popup-closed", "*");
    });
  },
  methods: {
    initiateHypersignSDK() {
      //   const hypersignDID = new HypersignDID({ namespace: "testnet" });
    },
    wait() {
      return new Promise((resolve) => {
        return setTimeout(() => {
          resolve();
        }, 3000);
      });
    },
    async pay() {
      this.isLoadingPage = true;
      await this.wait();
      this.hasPaid = true;
      this.isLoadingPage = false;
    },
  },
};
</script>
