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
        <label class="switch">
          <input type="checkbox" id="torch" ref="torch" />
          <span class="slider round"></span>
        </label>

        <div class="scanQR">
          <!-- <qrcode-stream
            @detect="onDetect"
            @init="onInit"
            @camera-on="onReady"
            @error="onError"
            v-if="isScan"
          >
          </qrcode-stream> -->

          <div id="qr-camera">
            <video
              id="camera-preview"
              refs="scanner"
              autoplay
              playsinline
              v-if="isScan"
            >
              <span v-if="loading"> waiting for camera</span>
            </video>
            <i
              v-else
              class="bi bi-qr-code-scan"
              style="font-size: 200px; color: rgb(59, 58, 58)"
            ></i>

            <div id="qr-overlay" v-if="isScan">
              <div id="qr-scan-box"></div>

              <div id="qr-scan-line"></div>
            </div>
          </div>
        </div>
        <div style="padding: 10px">
          <select id="cameraOptions" @change="selectionChange">
            <option value="null" selected>Select Camera</option>
          </select>
          <br />

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
      <div v-else class="table-responsive-sm" id="aadharDataDisplay">
        <aadhaar-consent></aadhaar-consent>
        <div style="padding: 20px">
          <button class="btn btn-outline-dark" @click="proceedNext()">
            Confirm
          </button>
          <button class="btn btn-link btn-dark" @click="reset()">Cancel</button>
        </div>
      </div>
    </div>
    <MessageBox :msg="toastMessage" :type="toastType" v-if="isToast" />
    <div class="card-footer">
      <PoweredBy />
    </div>
  </div>
</template>

<script type="text/javascript">
import jsQR from "jsqr";
import AadhaarConsent from "./AadhaarConsent.vue";
// import { QrcodeStream } from "vue-qrcode-reader";
import { mapActions, mapMutations, mapState } from "vuex";
// import { generateImageFromJ2k } from "../j2k";
export default {
  name: "AppScanQR",
  data() {
    return {
      video: {
        width: { min: 1280, ideal: 1920, max: 3840 },
        height: { min: 720, ideal: 1080, max: 2160 },
      },
      cameras: [],
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
      interval: null,
      stream: null,
      torch: false,
    };
  },
  components: {
    AadhaarConsent,
  },
  async mounted() {
    try {
      const permission = await navigator.permissions.query({ name: "camera" });
      if (permission.state == "denied") {
        this.toast("Please allow camera permission", "error");
        return;
      }

      navigator.mediaDevices.enumerateDevices().then((devices) => {
        this.cameras = devices.filter((device) => device.kind === "videoinput");

        const cameraSelect = document.getElementById("cameraOptions");

        if (this.cameras.length > 1) {
          this.cameras.forEach((camera) => {
            const option = document.createElement("option");
            option.value = camera.deviceId;
            option.text =
              camera.label === "" ? `Camera ${camera.deviceId}` : camera.label;
            option.selected = camera.deviceId === this.cameras[0].deviceId;
            cameraSelect.appendChild(option);
          });
        }
      });
    } catch (error) {
      this.toast(navigator.userAgent, "success");
    }
  },

  // watch: {
  //   aadharData: function () {
  //     console.log("watching...");
  //     window.localstorage.setItem(
  //       "aadharData",
  //       JSON.stringify(this.aadharData)
  //     );
  //   },
  // },
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
    selectionChange(e) {
      this.cancelScanner();
      const cameraId = e.target.value;

      this.video = {
        width: { min: 1280, ideal: 1920, max: 3840 },
        height: { min: 720, ideal: 1080, max: 2160 },
        deviceId: cameraId ? { exact: cameraId } : undefined,
      };

      this.openScanner();
    },

    processQrMoz(imgData) {
      const code = jsQR(imgData.data, imgData.width, imgData.height, {
        inversionAttempts: "attemptBoth",
      });
      if (code) {
        this.qrData = code.data;
        this.cancelScanner();
        this.onDetect({ content: code.data });
      }
    },
    processQr(imageCapture, xOffset, yOffset, newSize) {
      imageCapture
        .grabFrame()
        .then((imageBitmap) => {
          const canvas = document.createElement("canvas");
          canvas.width = imageBitmap.width;
          canvas.height = imageBitmap.height;
          const ctx = canvas.getContext("2d");
          // ctx.drawImage(imageBitmap, 0, 0, imageBitmap.width, imageBitmap.height);
          // const imageData = ctx.getImageData(0, 0, imageBitmap.width, imageBitmap.height, xOffset, yOffset, newSize, newSize);
          // ctx2.putImageData(imageData, 0, 0);

          ctx.drawImage(
            imageBitmap,
            xOffset,
            yOffset,
            newSize,
            newSize,
            xOffset,
            yOffset,
            newSize,
            newSize
          );
          const imageData = ctx.getImageData(
            0,
            0,
            imageBitmap.width,
            imageBitmap.height
          );
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "attemptBoth",
          });
          if (code) {
            this.qrData = code.data;
            this.cancelScanner();
            this.onDetect({ content: code.data });
          }
        })
        /* eslint-disable-next-line */
        .catch((e) => {
          // console.error(e);
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
    // async onInit(promise) {
    //   console.log("On init");
    //   this.loading = true;
    //   try {
    //     const { capabilities } = await promise;
    //     console.log(capabilities);
    //     this.loading = false;
    //   } catch (e) {
    //     console.error(e);
    //     this.toast(e.message, "error");
    //   }
    // },

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
    async openScanner() {
      this.isScan = true;

      navigator.mediaDevices
        .getUserMedia({
          video: this.video,
        })
        .then((stream) => {
          this.stream = stream;
          const track = this.stream.getVideoTracks()[0];

          if (track.getCapabilities !== undefined) {
            const capabilits = track.getCapabilities();

            // check autofocus
            if (capabilits.focusMode?.includes("continuous")) {
              track
                .applyConstraints({
                  advanced: [
                    {
                      focusMode: "continuous",
                    },
                  ],
                })
                .catch((e) => {
                  console.error(e);
                });
            }
            if (capabilits.exposureMode?.includes("continuous")) {
              track
                .applyConstraints({
                  advanced: [
                    {
                      exposureMode: "continuous",
                    },
                  ],
                })
                .catch((e) => {
                  console.error(e);
                });
            }

            if (capabilits.whiteBalanceMode?.includes("continuous")) {
              track
                .applyConstraints({
                  advanced: [
                    {
                      whiteBalanceMode: "continuous",
                    },
                  ],
                })
                .catch((e) => {
                  console.error(e);
                });
            }

            if (capabilits.torch) {
              document.getElementsByClassName("switch")[0].style.display =
                "inline-block";
              this.$refs.torch.addEventListener("change", (e) => {
                track
                  .applyConstraints({
                    advanced: [
                      {
                        torch: e.target.checked,
                      },
                    ],
                  })
                  .catch((e) => {
                    console.error(e);
                  });
              });
            } else {
              this.toast("Torch is not supported", "error");
              document.getElementsByClassName("switch")[0].style.display =
                "none";
            }
          }
          if ("ImageCapture" in window) {
            console.log("ImageCapture is supported");
            const imageCapture = new ImageCapture(track);

            const width = track.getSettings().width;
            const height = track.getSettings().height;
            const newSize = Math.min(width, height);
            const xOffset = (width - newSize) / 2;
            const yOffset = (height - newSize) / 2;

            this.interval = setInterval(() => {
              this.processQr(imageCapture, xOffset, yOffset, newSize);
            }, 0);
          } else {
            // Mozilla doesn't support ImageCapture but we can use canvas to capture image

            const canvas = document.createElement("canvas");

            const ctx = canvas.getContext("2d");
            const width = track.getSettings().width;
            const height = track.getSettings().height;
            canvas.width = width;
            canvas.height = height;

            const newSize = Math.min(width, height);
            const xOffset = (width - newSize) / 2;
            const yOffset = (height - newSize) / 2;

            this.interval = setInterval(() => {
              ctx.drawImage(video, 0, 0, width, height);

              const imageData = ctx.getImageData(
                xOffset,
                yOffset,
                newSize,
                newSize,
                xOffset,
                yOffset,
                newSize,
                newSize
              );

              this.processQrMoz(imageData);
            }, 0);
          }

          const video = document.getElementById("camera-preview");

          if (video.srcObject !== undefined) {
            video.srcObject = stream;
          } else if (video.mozSrcObject !== undefined) {
            video.mozSrcObject = stream;
          }

          video.play();
        })
        .catch((e) => {
          this.toast(e.name, "error");
          this.cancelScanner();
        });
    },
    cancelScanner() {
      this.isScan = false;
      clearInterval(this.interval);
      if (this.stream) {
        this.stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
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
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
}

#qr-camera {
  position: relative;
  width: 300px;
  height: 300px;
  overflow: hidden;
  border: 2px solid white;
  border-radius: 10px;
}

#camera-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
  /* Maintain aspect ratio and fill the container */
}

#qr-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
}

#qr-scan-box {
  width: 50%;
  height: 50%;
  position: absolute;
  background: rgba(255, 255, 255, 0.2);
}

#qr-scan-line {
  width: 50%;
  height: 1px;
  background-color: white;
  animation: scanAnimation 2s linear infinite;
}

@keyframes scanAnimation {
  0% {
    transform: translateY(-75px);
  }

  50% {
    transform: translateY(75px);
  }

  100% {
    transform: translateY(-75px);
  }
}

#cameraOptions {
  margin-bottom: 5px;
  width: 100%;
  height: 30px;
  border-radius: 5px;
  border: 1px solid #ced4da;
  padding: 5px;
  font-size: 14px;
  color: #495057;
  background-color: white;
  background-image: none;
}

.switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 22px;
  padding: 5px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #2196f3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
