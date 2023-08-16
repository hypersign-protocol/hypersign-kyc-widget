<template>
  <div class="card maincontainer">
    <div class="card-body">
      <span class="">Scan QR code on your Addhaar</span>
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
      <span class="">{{ error }}</span>
      <div style="padding: 10px">
        <button class="btn btn-primary" @click="openScanner" v-if="!isScan">
          <i class="bi bi-camera"></i> Scan
        </button>
        <button class="btn btn-link" @click="cancelScanner" v-else>
          Cancel
        </button>
      </div>
      <ConsentBox />
    </div>
    <div class="card-footer"><PoweredBy /></div>
  </div>
</template>

<script type="text/javascript">
import PoweredBy from "../components/PoweredBy.vue";
import ConsentBox from "../components/ConsentBox.vue";
import { QrcodeStream } from "vue-qrcode-reader";
export default {
  name: "AppScanQR",
  data() {
    return {
      qrDataRaw: "",
      qrData: "",
      error: "",
      loading: false,
      isScan: false,
    };
  },
  components: {
    PoweredBy,
    ConsentBox,
    QrcodeStream,
  },
  methods: {
    async onDetect(promise) {
      try {
        const { content } = await promise;
        this.qrDataRaw = content;
        console.log(this.qrDataRaw);
      } catch (e) {
        console.error(e);
      }
    },
    async onInit(promise) {
      console.log("On init");
      this.loading = true;
      try {
        const { capabilities } = await promise;
        console.log(capabilities);
        this.loading = false;
        console.log("Successfully initialized");
      } catch (e) {
        console.error(e);
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
    },
    openScanner() {
      this.isScan = true;
    },
    cancelScanner() {
      this.isScan = false;
    },
  },
};
</script>
<style type="text/css" scoped>
.maincontainer {
  width: 350px;
  height: 550px;
  background-color: #f5f5f5;
  border: 1px solid grey;
  border-radius: 20px;
  box-shadow: 2px 5px 5px grey;
  margin: 0 auto;
}

.scanQR {
  width: 250px;
  height: 250px;
  background-color: white;
  border: 1px solid grey;
  border-radius: 5px;
  margin: 0 auto;
}
</style>
