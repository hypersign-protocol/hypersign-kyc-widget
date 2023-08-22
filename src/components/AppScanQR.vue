<template>
  <div class="card maincontainer">
    <load-ing
      :active.sync="isLoading"
      :can-cancel="true"
      :is-full-page="fullPage"
    ></load-ing>
    <NavBar />
    <div class="card-body">
      <PageHeading :header="'Aadhaar Verification'" :subHeader="subheading" />
      <div v-if="!isAadhaarQRVerifiedAndDataExtracted">
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
      </div>
      <div v-else class="table-responsive-sm">
        <table
          class="table"
          style="text-align: left; font-size: x-small; padding-top: 10px"
        >
          <tbody>
            <!-- <tr>
              <th rowspan="5">
                <i class="bi bi-person-fill"></i>
              </th>
            </tr> -->
            <tr>
              <th scope="row">Name</th>
              <th colspan="2">{{ aadharData.name }}</th>
              <td rowspan="2" style="text-align: center">
                <img src="../assets/aadhaar-logo.png" height="30" />
              </td>
            </tr>
            <tr>
              <th scope="row">DOB</th>
              <td colspan="3">{{ aadharData.dob }}</td>
              <!--<td></td>-->
            </tr>
            <tr>
              <th scope="row">Gender</th>
              <td colspan="3">{{ aadharData.gender }}</td>
              <!--<td></td>-->
            </tr>
            <tr>
              <th scope="row">Address</th>
              <td colspan="3">
                {{ aadharData.house }} {{ aadharData.location }}
                {{ aadharData.state }} - {{ aadharData.pincode }}
              </td>
            </tr>
          </tbody>
        </table>

        <div style="padding: 20px">
          <button class="btn btn-outline-dark" @click="proceedNext()">
            Confirm
          </button>
          <button class="btn btn-link btn-dark" @click="reset()">Cancel</button>
        </div>
      </div>
    </div>
    <MessageBox :msg="toastMessage" :type="toastType" v-if="isToast" />
    <div class="card-footer"><PoweredBy /></div>
  </div>
</template>

<script type="text/javascript">
import { QrcodeStream } from "vue-qrcode-reader";
import { mapActions, mapMutations, mapState } from "vuex";
// import { generateImageFromJ2k } from "../j2k";
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
      isQRVerfied: false,
    };
  },
  components: {
    QrcodeStream,
  },
  computed: {
    ...mapState(["aadharData"]),
    isAadhaarQRVerifiedAndDataExtracted() {
      return (
        this.isQRVerfied &&
        this.aadharData &&
        Object.keys(this.aadharData).length > 0
      );
    },

    subheading() {
      if (!this.isAadhaarQRVerifiedAndDataExtracted) {
        return "Scan QR code on your Aadhaar Card";
      } else {
        return "Confirm Your Details";
      }
    },
  },
  methods: {
    ...mapMutations(["nextStep", "setQrString", "setAadhaarData"]),
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
            this.isQRVerfied = true;
            if (result.aadharData) {
              console.log("Setting aadhaar data in localstorage...");
              this.setAadhaarData(result.aadharData);
              // generateImageFromJ2k(result.j2kImage); // TODO: need to figure out how to show image
            }
            // Moving to next step...
            // this.nextStep();
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

    proceedNext() {
      this.nextStep();
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
    reset() {
      this.isScan = false;
      this.isToast = false;
      this.toastMessage = "";
      this.isQRVerfied = false;
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
