<template>
  <div class="card maincontainer">
    <load-ing
      :active.sync="isLoading"
      :can-cancel="true"
      :is-full-page="fullPage"
    ></load-ing>
    <NavBar />
    <div class="card-body">
      <PageHeading
        :header="'Aadhaar Verification'"
        :subHeader="'Scan QR code on your Aadhaar Card'"
      />
      <div class="scanQR">
        <qrcode-stream
          @detect="onDetect"
          @init="onInit"
          @camera-on="onReady"
          @error="onError"
          v-if="isScan"
        >
          <span v-if="loading">Waiting for camera...</span>
        </qrcode-stream>
        <i
          v-else
          class="bi bi-qr-code-scan"
          style="font-size: 170px; color: rgb(59, 58, 58)"
        ></i>
      </div>
      <div style="padding: 20px">
        <button
          class="btn btn-outline-dark"
          @click="openScanner"
          v-if="!isScan"
        >
          <i class="bi bi-camera"></i> Scan
        </button>
        <button class="btn btn-link btn-dark" @click="cancelScanner" v-else>
          Cancel
        </button>
      </div>
      <NextPage />
    </div>
    <MessageBox :msg="toastMessage" :type="toastType" v-if="isToast" />
    <div class="card-footer"><PoweredBy /></div>
  </div>
</template>

<script type="text/javascript">
import { QrcodeStream } from "vue-qrcode-reader";
import NextPage from "./commons/NextPage.vue";
import { mapActions, mapMutations } from "vuex";

export default {
  name: "AppScanQR",
  data() {
    return {
      qrData: "",
      error: "",
      loading: false,
      isScan: false,
      isLoading: false,
      fullPage: true,
      toastMessage: "",
      toastType: "success",
      isToast: false,
    };
  },
  components: {
    QrcodeStream,
    NextPage,
  },
  methods: {
    ...mapMutations(["nextStep", "setQrString"]),
    ...mapActions(["addharQRVerify"]),
    wait(time = 3000) {
      return new Promise((resolve) => {
        return setTimeout(() => {
          resolve();
        }, time);
      });
    },
    async onDetect(promise) {
      try {
        const { content } = await promise;
        if (content) {
          // setting in the store...
          this.setQrString(content);
          this.toast("Verifying the QR code...");
          // TODO: Verify this QR string; faking it for now..
          this.isLoading = true;
          const result = await this.addharQRVerify();
          await this.wait(1000);
          if (result && result.verified === true) {
            console.log("QR verified successfully");
            // Moving to next step...
            this.nextStep();
          } else {
            throw new Error("Invalid QR Code");
          }
          this.isLoading = false;
        } else {
          throw new Error("Could not scan the QR");
        }
      } catch (e) {
        console.error(e);
        this.isLoading = false;
        this.toast(e.message, "error");
      } finally {
        // Closing the camera
        this.cancelScanner();
      }
    },
    async onInit(promise) {
      console.log("On init");
      this.loading = true;
      try {
        const { capabilities } = await promise;
        console.log(capabilities);
        this.loading = false;
      } catch (e) {
        console.error(e);
        this.toast(e.message, "error");
      }
    },
    onReady(capabilities) {
      console.log("Camera is ready");
      console.log(capabilities);
    },
    onError(e) {
      if (e.name === "NotAllowedError") {
        this.error = "User denied camera access permission";
      }

      if (e.name === "NotFoundError") {
        this.error = "No suitable camera found";
      }

      if (e.name === "NotSupportedError") {
        this.error =
          "Page is not supported to served over HTTPs (or localhost)";
      }

      if (e.name === "NotReadableError") {
        this.error = "May be camera already in use";
      }

      if (e.name === "OverconstrainedError") {
        this.error = "REquested camera not present";
      }

      if (e.name === "StreamApiNotSupportedError") {
        this.error = "Brower seems to be lacking camera feature";
      }

      this.toast(this.error, "error");
    },
    openScanner() {
      this.isScan = true;
    },
    cancelScanner() {
      this.isScan = false;
    },
    toast(msg, type = "success") {
      this.isToast = true;
      this.toastMessage = msg;
      this.toastType = type;

      setTimeout(() => {
        this.isToast = false;
        this.toastMessage = "";
      }, 2000);
    },
  },
};
</script>
<style type="text/css" scoped>
.scanQR {
  width: 250px;
  height: 250px;
  background-color: white;
  border: 1px solid grey;
  border-radius: 5px;
  margin: 0 auto;
}
</style>
