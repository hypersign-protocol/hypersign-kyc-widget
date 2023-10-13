<!-- verify day pass component -->

<template>
  <div class="card maincontainer" style="text-align: left">
    <div style="text-align: center">
      <h3>Verify Day Pass</h3>
      <hr style="margin: 0" />
    </div>
    <div
      id="dailyPassGetter"
      style="text-align: center"
      v-if="getDailyPassFromUser"
    >
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
        <!-- <select id="cameraOptions"  @change="selectionChange"> -->
        <select id="cameraOptions"  >

          <option value="null" selected>Select Camera</option>
        </select>
        <br />

        <!-- <button
          class="btn btn-outline-dark"
          @click="openScanner"
          v-if="!isScan"
        > -->
        <button
          class="btn btn-outline-dark"
          v-if="!isScan"
        >
          <i class="bi bi-camera"></i> Scan
        </button>
        <!-- <button class="btn btn-link btn-dark" @click="cancelScanner" v-else> -->

        <button class="btn btn-link btn-dark" v-else>
          Cancel
        </button>
      </div>
      <hr />
      <div style="display: inline-flex; justify-content: center">
        <div class="upload-btn-wrapper">
          <button class="btn" ref="uploadBtn" @click="triggerFileInput">
            Upload a PDF
          </button>
          <input
            type="file"
            ref="fileInput"
            @change="handleFileUpload"
            accept=".pdf"
            style="display: none"
          />
        </div>
      </div>
    </div>

    <div id="dailyPassVerification" style="overflow-y: scroll" v-else>
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
                <img :src="images.greentick" height="21" width="21" />
              </span>
            </div>
          </div>

          <div class="row">
            <div class="col-md-12" style="font-size: 11px; color: #808080b3">
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
          <ul class="list-group" style="max-height: 250px; overflow: scroll">
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
                Object.keys(eachcredential.credentialSubject)[eachSubjectField]
              "
            >
              <span style="font-weight: bold">{{ eachSubjectField }} :</span>
              <span v-if="eachSubjectField === 'id'">
                {{
                  shorten(eachcredential.credentialSubject[eachSubjectField])
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
</template>

<script>
import util from "../utils/utils-mixin";

export default {
  name: "verify-day-pass",
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
        greentick: require("../assets/green-tick.png"),
      },
      dummyData: {
        "@context": [
          "https://www.w3.org/2018/credentials/v1",
          "https://w3id.org/security/suites/ed25519-2020/v1",
        ],
        type: ["VerifiablePresentation"],
        verifiableCredential: [
          {
            "@context": [
              "https://www.w3.org/2018/credentials/v1",
              {
                hs: "https://api.jagrat.hypersign.id/hypersign-protocol/hidnode/ssi/schema/sch:hid:testnet:zVDWj2bfmqGWTqRhZZvacvXxtYhsGLopDMd4zr6D6PNq:1.0:",
              },
              {
                name: "hs:name",
              },
              {
                dob: "hs:dob",
              },
              {
                phoneNumber: "hs:phoneNumber",
              },
              {
                email: "hs:email",
              },
              "https://w3id.org/security/suites/ed25519-2020/v1",
            ],
            id: "vc:hid:testnet:zHtT39tW5zMJ2fK4FpZoJUp7fabijCrQfs9ghUnDjHMp1",
            type: ["VerifiableCredential", "Person"],
            expirationDate: "2023-10-26T18:33:00Z",
            issuanceDate: "2023-10-13T06:32:24Z",
            issuer:
              "did:hid:testnet:zDoQZwzkctBQvYEEL8Xz7fx5tpyeYcQ38hSRJXpSVDyhb",
            credentialSubject: {
              name: "Pratap",
              dob: "17/11/1997",
              phoneNumber: "7003844972",
              email: "pratapmridha@gmail.com",
              id: "did:hid:testnet:z2FBEMuH3QkegJ6ffhFcaJG4hWSw71U2tk4kfgQ9ShdYh",
            },
            credentialSchema: {
              id: "sch:hid:testnet:zVDWj2bfmqGWTqRhZZvacvXxtYhsGLopDMd4zr6D6PNq:1.0",
              type: "JsonSchemaValidator2018",
            },
            credentialStatus: {
              id: "https://api.jagrat.hypersign.id/hypersign-protocol/hidnode/ssi/credential/vc:hid:testnet:zHtT39tW5zMJ2fK4FpZoJUp7fabijCrQfs9ghUnDjHMp1",
              type: "CredentialStatusList2017",
            },
            proof: {
              type: "Ed25519Signature2020",
              created: "2023-10-13T06:34:04Z",
              verificationMethod:
                "did:hid:testnet:z2FBEMuH3QkegJ6ffhFcaJG4hWSw71U2tk4kfgQ9ShdYh#key-1",
              proofPurpose: "assertionMethod",
              proofValue:
                "z43QywET6jir6zdmP79UmVQgQUhwZfyP8Uq28cUH2YzvUMfzHrwqGGszWWq2MH51JPhpoXx4EVx9AS7gfdjszVDp9",
            },
          },
          {
            "@context": [
              "https://www.w3.org/2018/credentials/v1",
              {
                hs: "https://api.jagrat.hypersign.id/hypersign-protocol/hidnode/ssi/schema/sch:hid:testnet:zVDWj2bfmqGWTqRhZZvacvXxtYhsGLopDMd4zr6D6PNq:1.0:",
              },
              {
                name: "hs:name",
              },
              {
                dob: "hs:dob",
              },
              {
                phoneNumber: "hs:phoneNumber",
              },
              {
                email: "hs:email",
              },
              "https://w3id.org/security/suites/ed25519-2020/v1",
            ],
            id: "vc:hid:testnet:zHtT39tW5zMJ2fK4FpZoJUp7fabijCrQfs9ghUnDjHMp1",
            type: ["VerifiableCredential", "Person"],
            expirationDate: "2023-10-26T18:33:00Z",
            issuanceDate: "2023-10-13T06:32:24Z",
            issuer:
              "did:hid:testnet:zDoQZwzkctBQvYEEL8Xz7fx5tpyeYcQ38hSRJXpSVDyhb",
            credentialSubject: {
              name: "Pratap",
              dob: "17/11/1997",
              phoneNumber: "7003844972",
              email: "pratapmridha@gmail.com",
              id: "did:hid:testnet:z2FBEMuH3QkegJ6ffhFcaJG4hWSw71U2tk4kfgQ9ShdYh",
            },
            credentialSchema: {
              id: "sch:hid:testnet:zVDWj2bfmqGWTqRhZZvacvXxtYhsGLopDMd4zr6D6PNq:1.0",
              type: "JsonSchemaValidator2018",
            },
            credentialStatus: {
              id: "https://api.jagrat.hypersign.id/hypersign-protocol/hidnode/ssi/credential/vc:hid:testnet:zHtT39tW5zMJ2fK4FpZoJUp7fabijCrQfs9ghUnDjHMp1",
              type: "CredentialStatusList2017",
            },
            proof: {
              type: "Ed25519Signature2020",
              created: "2023-10-13T06:34:04Z",
              verificationMethod:
                "did:hid:testnet:z2FBEMuH3QkegJ6ffhFcaJG4hWSw71U2tk4kfgQ9ShdYh#key-1",
              proofPurpose: "assertionMethod",
              proofValue:
                "z43QywET6jir6zdmP79UmVQgQUhwZfyP8Uq28cUH2YzvUMfzHrwqGGszWWq2MH51JPhpoXx4EVx9AS7gfdjszVDp9",
            },
          },
          {
            "@context": [
              "https://www.w3.org/2018/credentials/v1",
              {
                hs: "https://api.jagrat.hypersign.id/hypersign-protocol/hidnode/ssi/schema/sch:hid:testnet:zVDWj2bfmqGWTqRhZZvacvXxtYhsGLopDMd4zr6D6PNq:1.0:",
              },
              {
                name: "hs:name",
              },
              {
                dob: "hs:dob",
              },
              {
                phoneNumber: "hs:phoneNumber",
              },
              {
                email: "hs:email",
              },
              "https://w3id.org/security/suites/ed25519-2020/v1",
            ],
            id: "vc:hid:testnet:zHtT39tW5zMJ2fK4FpZoJUp7fabijCrQfs9ghUnDjHMp1",
            type: ["VerifiableCredential", "Person"],
            expirationDate: "2023-10-26T18:33:00Z",
            issuanceDate: "2023-10-13T06:32:24Z",
            issuer:
              "did:hid:testnet:zDoQZwzkctBQvYEEL8Xz7fx5tpyeYcQ38hSRJXpSVDyhb",
            credentialSubject: {
              name: "Pratap",
              dob: "17/11/1997",
              phoneNumber: "7003844972",
              email: "pratapmridha@gmail.com",
              id: "did:hid:testnet:z2FBEMuH3QkegJ6ffhFcaJG4hWSw71U2tk4kfgQ9ShdYh",
            },
            credentialSchema: {
              id: "sch:hid:testnet:zVDWj2bfmqGWTqRhZZvacvXxtYhsGLopDMd4zr6D6PNq:1.0",
              type: "JsonSchemaValidator2018",
            },
            credentialStatus: {
              id: "https://api.jagrat.hypersign.id/hypersign-protocol/hidnode/ssi/credential/vc:hid:testnet:zHtT39tW5zMJ2fK4FpZoJUp7fabijCrQfs9ghUnDjHMp1",
              type: "CredentialStatusList2017",
            },
            proof: {
              type: "Ed25519Signature2020",
              created: "2023-10-13T06:34:04Z",
              verificationMethod:
                "did:hid:testnet:z2FBEMuH3QkegJ6ffhFcaJG4hWSw71U2tk4kfgQ9ShdYh#key-1",
              proofPurpose: "assertionMethod",
              proofValue:
                "z43QywET6jir6zdmP79UmVQgQUhwZfyP8Uq28cUH2YzvUMfzHrwqGGszWWq2MH51JPhpoXx4EVx9AS7gfdjszVDp9",
            },
          },
          {
            "@context": [
              "https://www.w3.org/2018/credentials/v1",
              {
                hs: "https://api.jagrat.hypersign.id/hypersign-protocol/hidnode/ssi/schema/sch:hid:testnet:zVDWj2bfmqGWTqRhZZvacvXxtYhsGLopDMd4zr6D6PNq:1.0:",
              },
              {
                name: "hs:name",
              },
              {
                dob: "hs:dob",
              },
              {
                phoneNumber: "hs:phoneNumber",
              },
              {
                email: "hs:email",
              },
              "https://w3id.org/security/suites/ed25519-2020/v1",
            ],
            id: "vc:hid:testnet:zHtT39tW5zMJ2fK4FpZoJUp7fabijCrQfs9ghUnDjHMp1",
            type: ["VerifiableCredential", "Person"],
            expirationDate: "2023-10-26T18:33:00Z",
            issuanceDate: "2023-10-13T06:32:24Z",
            issuer:
              "did:hid:testnet:zDoQZwzkctBQvYEEL8Xz7fx5tpyeYcQ38hSRJXpSVDyhb",
            credentialSubject: {
              name: "Pratap",
              dob: "17/11/1997",
              phoneNumber: "7003844972",
              email: "pratapmridha@gmail.com",
              id: "did:hid:testnet:z2FBEMuH3QkegJ6ffhFcaJG4hWSw71U2tk4kfgQ9ShdYh",
            },
            credentialSchema: {
              id: "sch:hid:testnet:zVDWj2bfmqGWTqRhZZvacvXxtYhsGLopDMd4zr6D6PNq:1.0",
              type: "JsonSchemaValidator2018",
            },
            credentialStatus: {
              id: "https://api.jagrat.hypersign.id/hypersign-protocol/hidnode/ssi/credential/vc:hid:testnet:zHtT39tW5zMJ2fK4FpZoJUp7fabijCrQfs9ghUnDjHMp1",
              type: "CredentialStatusList2017",
            },
            proof: {
              type: "Ed25519Signature2020",
              created: "2023-10-13T06:34:04Z",
              verificationMethod:
                "did:hid:testnet:z2FBEMuH3QkegJ6ffhFcaJG4hWSw71U2tk4kfgQ9ShdYh#key-1",
              proofPurpose: "assertionMethod",
              proofValue:
                "z43QywET6jir6zdmP79UmVQgQUhwZfyP8Uq28cUH2YzvUMfzHrwqGGszWWq2MH51JPhpoXx4EVx9AS7gfdjszVDp9",
            },
          },
          {
            "@context": [
              "https://www.w3.org/2018/credentials/v1",
              {
                hs: "https://api.jagrat.hypersign.id/hypersign-protocol/hidnode/ssi/schema/sch:hid:testnet:zVDWj2bfmqGWTqRhZZvacvXxtYhsGLopDMd4zr6D6PNq:1.0:",
              },
              {
                name: "hs:name",
              },
              {
                dob: "hs:dob",
              },
              {
                phoneNumber: "hs:phoneNumber",
              },
              {
                email: "hs:email",
              },
              "https://w3id.org/security/suites/ed25519-2020/v1",
            ],
            id: "vc:hid:testnet:zHtT39tW5zMJ2fK4FpZoJUp7fabijCrQfs9ghUnDjHMp1",
            type: ["VerifiableCredential", "Person"],
            expirationDate: "2023-10-26T18:33:00Z",
            issuanceDate: "2023-10-13T06:32:24Z",
            issuer:
              "did:hid:testnet:zDoQZwzkctBQvYEEL8Xz7fx5tpyeYcQ38hSRJXpSVDyhb",
            credentialSubject: {
              name: "Pratap",
              dob: "17/11/1997",
              phoneNumber: "7003844972",
              email: "pratapmridha@gmail.com",
              id: "did:hid:testnet:z2FBEMuH3QkegJ6ffhFcaJG4hWSw71U2tk4kfgQ9ShdYh",
            },
            credentialSchema: {
              id: "sch:hid:testnet:zVDWj2bfmqGWTqRhZZvacvXxtYhsGLopDMd4zr6D6PNq:1.0",
              type: "JsonSchemaValidator2018",
            },
            credentialStatus: {
              id: "https://api.jagrat.hypersign.id/hypersign-protocol/hidnode/ssi/credential/vc:hid:testnet:zHtT39tW5zMJ2fK4FpZoJUp7fabijCrQfs9ghUnDjHMp1",
              type: "CredentialStatusList2017",
            },
            proof: {
              type: "Ed25519Signature2020",
              created: "2023-10-13T06:34:04Z",
              verificationMethod:
                "did:hid:testnet:z2FBEMuH3QkegJ6ffhFcaJG4hWSw71U2tk4kfgQ9ShdYh#key-1",
              proofPurpose: "assertionMethod",
              proofValue:
                "z43QywET6jir6zdmP79UmVQgQUhwZfyP8Uq28cUH2YzvUMfzHrwqGGszWWq2MH51JPhpoXx4EVx9AS7gfdjszVDp9",
            },
          },
        ],
        id: "vp:hid:testnet:zDSqkoboWhRUaCn7AQZSDk45Nk1ciCxzPtJAhYL2QqLPo",
        holder: "did:hid:testnet:z2FBEMuH3QkegJ6ffhFcaJG4hWSw71U2tk4kfgQ9ShdYh",
        proof: {
          type: "Ed25519Signature2020",
          created: "2023-10-13T06:40:45Z",
          verificationMethod:
            "did:hid:testnet:z2FBEMuH3QkegJ6ffhFcaJG4hWSw71U2tk4kfgQ9ShdYh#key-1",
          proofPurpose: "authentication",
          challenge: "3aaa1ff5-bd84-4f45-8f60-24f8a6b8835e",
          proofValue:
            "z39bXxX8hgbNZ4f6auEs683Q8CDMEtHVmaX6xSE7FpNfbihUDaCUBykPRb9NCcaCep2W7EJV5T6S3g4ieKgSPtRJP",
        },
      },
      getDailyPassFromUser: true,
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
    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    handleFileUpload(event) {
      const selectedFile = event.target.files[0];
      if (selectedFile) {
        // You can handle the file here, e.g., upload it or display its details
        console.log("Selected file:", selectedFile.name);
        this.$refs.uploadBtn.innerText = selectedFile.name;
        this.$refs.uploadBtn.style.color = "green";
        this.$refs.uploadBtn.style.borderColor = "green";
        this.getDailyPassFromUser = false;
        this.$refs.uploadBtn.style.display = "none";
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
</style>
