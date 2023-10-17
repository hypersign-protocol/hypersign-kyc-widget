<!-- verify day pass component -->

<template>
  <div class="card maincontainerForm" style="text-align: left">
    <div class="card-header" style="text-align: center">
      <h4>Day Pass Verification</h4>
    </div>
    <load-ing
      :active.sync="isLoadingPage"
      :can-cancel="true"
      :is-full-page="true"
    ></load-ing>

    <div class="card-body">
      <div
        id="dailyPassGetter"
        style="text-align: center"
        class="row"
        v-if="getDailyPassFromUser"
      >
        <div class="col-md-12">
          <div class="row">
            <div class="col-md-6">
              <div class="scanQR">
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
                <select id="cameraOptions">
                  <option value="null" selected>Select Camera</option>
                </select>
                <br />
                <button class="btn btn-outline-dark" v-if="!isScan">
                  <i class="bi bi-camera"></i> Scan
                </button>
                <button class="btn btn-link btn-dark" v-else>Cancel</button>
              </div>
            </div>
            <div class="col-md-6">
              <div style="display: inline-flex; justify-content: center">
                <div class="upload-btn-wrapper">
                  <div class="card-file">
                    <h3>Upload Files</h3>
                    <div class="drop_box">
                      <header>
                        <h4>Drag and Drop Day Pass here</h4>
                      </header>
                      <p>Files Supported: PDF</p>
                      <input
                        type="file"
                        ref="fileInput"
                        @change="handleFileUpload"
                        accept=".pdf"
                        hidden
                        id="fileID"
                        style="display: none"
                      />
                      <button
                        class="btn"
                        ref="uploadBtn"
                        @click="triggerFileInput"
                      >
                        Upload A Day Pass
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        id="dailyPassVerification"
        class="row"
        style="overflow-y: scroll"
        v-else
      >
        <div class="col-md-12">
          <div style="max-height: 600px; overflow-y: scroll"></div>
          <div
            class="card"
            v-for="eachcredential in dummyData.verifiableCredential"
            style="margin-bottom: 3%"
            v-bind:key="dummyData.verifiableCredential.indexOf(eachcredential)"
          >
            <div class="card-header">
              <div class="row">
                <div class="col-md-12">
                  <span
                    ><i class="fa-solid fa-id-card"></i>
                    {{ eachcredential.type[1] }}</span
                  >
                  <span class="card-title" style="float: right !important">
                    <!-- <img :src="images.greentick" height="21" width="21" /> -->
                    <i
                      class="bi bi-check-circle-fill"
                      style="color: green; font-size: medium"
                      v-if="
                        result?.credentialResults?.find(
                          (x) => x.credentialId === eachcredential.id
                        )?.verified
                      "
                    ></i>

                    <i
                      class="bi bi-x-circle-fill"
                      style="color: red; font-size: medium"
                      v-else
                    ></i>
                  </span>
                </div>
              </div>

              <div class="row">
                <div
                  class="col-md-12"
                  style="font-size: 11px; color: #808080b3"
                >
                  {{ eachcredential.id }}
                  <i
                    class="far fa-copy ml-1"
                    style="cursor: pointer"
                    title="Click to copy credential id"
                    @click="copyToClip(eachcredential.id, 'Credential Id')"
                  ></i>
                </div>
              </div>
            </div>
            <div class="card-body">
              <ul
                class="list-group"
                style="max-height: 250px; overflow: scroll"
              >
                <li class="list-group-item">
                  <span style="font-weight: bold">Issuer : </span>
                  {{ shorten(eachcredential.issuer) }}
                  <i
                    class="far fa-copy ml-1"
                    style="cursor: pointer"
                    title="Click to copy issuer DID"
                    @click="copyToClip(eachcredential.issuer, 'Issuer DID')"
                  ></i>
                </li>
                <li
                  class="list-group-item"
                  v-for="eachSubjectField in Object.keys(
                    eachcredential.credentialSubject
                  )"
                  v-bind:key="
                    Object.keys(eachcredential.credentialSubject)[
                      eachSubjectField
                    ]
                  "
                >
                  <span style="font-weight: bold"
                    >{{ eachSubjectField }} :</span
                  >
                  <span v-if="eachSubjectField === 'id'">
                    {{
                      shorten(
                        eachcredential.credentialSubject[eachSubjectField]
                      )
                    }}
                    <i
                      class="far fa-copy ml-1"
                      style="cursor: pointer"
                      title="Click to copy subject DID"
                      @click="copyToClip(eachcredential.issuer, 'Subject DID')"
                    ></i>
                  </span>
                  <span v-else>
                    {{ eachcredential.credentialSubject[eachSubjectField] }}
                  </span>
                </li>
              </ul>
            </div>
            <!-- <div class="card-footer"></div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import util from "../../utils/utils-mixin";
import { mapActions } from "vuex";
export default {
  name: "verify-day-pass",
  computed: {},
  components: {},
  data() {
    return {
      // QR

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
      //
      // file: null,
      images: {
        greentick: require("../../assets/green-tick.png"),
      },

      dummyData: {},
      result: {},
      getDailyPassFromUser: true,
      isLoadingPage: false,
    };
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
  methods: {
    ...mapActions(["verifyPresentation"]),
    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    async handleFileUpload(event) {
      try {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
          // You can handle the file here, e.g., upload it or display its details
          console.log("Selected file:", selectedFile.name);
          this.$refs.uploadBtn.innerText = selectedFile.name;
          this.$refs.uploadBtn.style.color = "green";
          this.$refs.uploadBtn.style.borderColor = "green";

          //
          this.isLoadingPage = true;
          const presentationStr = localStorage.getItem("presentation");
          if (presentationStr) {
            const presentation = JSON.parse(presentationStr);
            this.result = await this.verifyPresentation({ presentation });
            this.dummyData = {};
            this.dummyData = { ...presentation };
          } else {
            console.log("No presentaiton found in storage");
          }

          this.isLoadingPage = false;
          this.getDailyPassFromUser = false;
          this.$refs.uploadBtn.style.display = "none";
        } else {
          console.log("No file selected");
        }
      } catch (error) {
        console.error(error);
        this.isLoading = false;
      } finally {
        this.isLoading = false;
      }
    },
  },
  mixins: [util],
};
</script>

<style>
/* Upload input should match the them */
/* Style for the container of the button and file input */
.upload-btn-wrapper {
  position: relative;
  overflow: hidden;
  display: inline-block;
}

/* Style for the button */
.btn {
  border: 2px solid gray !important;
  color: gray !important;
  background-color: white !important;
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
}

/* Style for the file input */
.upload-btn-wrapper input[type="file"] {
  font-size: 100px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
}

/* Hover state for the button */
.upload-btn-wrapper:hover .btn {
  border-color: #333;
  color: #333;
  cursor: pointer;
}

/* Style for the button icon (optional) */
.upload-icon::before {
  content: "\f0c2"; /* Unicode for the file-upload icon (FontAwesome) */
  font-family: "Font Awesome 5 Free";
  margin-right: 10px;
}

/* --------------------------- */
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

.card-file {
  border-radius: 10px;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.3);
  width: 300px;
  height: 300px;
  background-color: #ffffff;
  padding: 10px 30px 40px;
}

.card-file h3 {
  font-size: 22px;
  font-weight: 600;
}

.drop_box {
  margin: 10px 0;
  padding: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border: 3px dotted #a3a3a3;
  border-radius: 5px;
}

.drop_box h4 {
  font-size: 16px;
  font-weight: 400;
  color: #2e2e2e;
}

.drop_box p {
  margin-top: 10px;
  margin-bottom: 20px;
  font-size: 12px;
  color: #a3a3a3;
}

.btn {
  text-decoration: none;
  background-color: #005af0;
  color: #ffffff;
  padding: 10px 20px;
  border: none;
  outline: none;
  transition: 0.3s;
}

.btn:hover {
  text-decoration: none;
  background-color: #ffffff;
  color: #005af0;
  padding: 10px 20px;
  border: none;
  outline: 1px solid #010101;
}
.form input {
  margin: 10px 0;
  width: 100%;
  background-color: #e2e2e2;
  border: none;
  outline: none;
  padding: 12px 20px;
  border-radius: 4px;
}
</style>
