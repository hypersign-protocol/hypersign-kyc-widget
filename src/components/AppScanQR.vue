<template>
  <div class="card maincontainer">
    <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></load-ing>
    <NavBar />

    <div class="card-body">
      <PageHeading :header="'Aadhaar Verification'" :subHeader="subheading" />
      <div v-if="!isAadhaarQRVerifiedAndDataExtracted">
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


            <video id="camera-preview" refs="scanner" autoplay playsinline style="display: none;" v-if="isScan">


              <span v-if="loading"> waiting for camera</span>

            </video>
            <i v-else class="bi bi-qr-code-scan" style="font-size: 200px; color: rgb(59, 58, 58)"></i>



            <div id="qr-overlay" v-if="isScan">
              <canvas id="cv" autoplay inline ></canvas>

              <div id="qr-scan-box"></div>

              <div id="qr-scan-line"></div>

            </div>

          </div>



        </div>
        <div style="padding: 20px">
          <button class="btn btn-outline-dark" @click="openScanner" v-if="!isScan">
            <i class="bi bi-camera"></i> Scan
          </button>
          <button class="btn btn-link btn-dark" @click="cancelScanner" v-else>
            Cancel
          </button>
        </div>
      </div>
      <div v-else class="table-responsive-sm">
        <table class="table" style="text-align: left; font-size: x-small; padding-top: 10px">
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
    <div class="card-footer">
      <PoweredBy />
    </div>

  </div>
</template>

<script type="text/javascript">
import jsQR from "jsqr";
// import { QrcodeStream } from "vue-qrcode-reader";
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
      interval: null,
      stream: null,
    };
  },
  components: {
    // QrcodeStream,
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
    processQr(imageCapture) {
      imageCapture.grabFrame()
        .then(imageBitmap => {
          const canvas = document.createElement('canvas');
          canvas.width = imageBitmap.width;
          canvas.height = imageBitmap.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(imageBitmap, canvas.width / 2 - 400, canvas.height / 2 - 400, 800, 800, canvas.width / 2 - 400, canvas.height / 2 - 400, 800, 800);
          const imageData = ctx.getImageData(canvas.width / 2 - 400, canvas.height / 2 - 400, 800, 800);
          ctx.putImageData(imageData, 0, 0);
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
        .catch(e => {
          // console.error(e);
        }
        )
    }
    ,
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
    openScanner() {
      this.isScan = true;
      navigator.mediaDevices
        .getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 1280, max: 1920 },
            height: { ideal: 720, max: 1080 }
          }
        })
        .then((stream) => {
          this.stream = stream;
          const track = this.stream.getVideoTracks()[0];
          if (track.getCapabilities !== undefined) {


            const capabilits = track.getCapabilities();
            // check autofocus
            if (capabilits.focusMode?.includes('continuous')) {
              track.applyConstraints({
                advanced: [{
                  focusMode: 'continuous'

                }]
              })
                .catch(e => {
                  console.error(e);
                })
            }
            if (capabilits.exposureMode?.includes('continuous')) {
              track.applyConstraints({
                advanced: [{
                  exposureMode: 'continuous'

                }]
              })
                .catch(e => {
                  console.error(e);
                })
            }

            if (capabilits.whiteBalanceMode?.includes('continuous')) {
              track.applyConstraints({
                advanced: [{
                  whiteBalanceMode: 'continuous'

                }]
              })
                .catch(e => {
                  console.error(e);
                })
            }

            if (capabilits.zoom?.step !== undefined) {
              track.applyConstraints({
                advanced: [{
                  zoom: capabilits.zoom.min

                }]
              })
                .catch(e => {
                  console.error(e);
                })
            }
          }
          if ('ImageCapture' in window) {
            console.log('ImageCapture is supported');
            const imageCapture = new ImageCapture(track);

            this.interval = setInterval(() => {

              this.processQr(imageCapture)


            }, 0)
          } else {
            // Mozilla doesn't support ImageCapture but we can use canvas to capture image

            const video = document.getElementById('cv');
            const ctx = video.getContext('2d');
            this.interval = setInterval(() => {

              const width = track.getSettings().width;
              const height = track.getSettings().height;


              // display video on canvas
              ctx.drawImage(video, 0, 0, width, height);
              
              // get image data from canvas
             



              // this.processQrMoz(imageData)
            }, 1)




          }



          const video = document.getElementById("camera-preview");

          if (video.srcObject !== undefined) {
            video.srcObject = stream
          } else if (video.mozSrcObject !== undefined) {
            video.mozSrcObject = stream
          }

          video.play();

        })
        .catch((e) => {
          console.log(e);
          this.toast(e.message, "error");
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
#cv {
  /* display video fullscreen */
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* Maintain aspect ratio and fill the container */

  /* should be on top of every element */
  z-index: -1;

  /* hide the original video */
  



  
}
.scanQR {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
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
</style>
