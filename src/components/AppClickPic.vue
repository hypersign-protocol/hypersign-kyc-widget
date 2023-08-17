<template>
  <div class="card maincontainer">
    <load-ing
      :active.sync="isLoadingPage"
      :can-cancel="true"
      :is-full-page="fullPage"
    ></load-ing>
    <div class="card-body">
      <h4>Video KYC</h4>

      <div class="scanQR web-camera-container">
        <img
          src="../assets/selfi.png"
          width="200"
          height="200"
          v-if="!isCameraOpen"
        />
        <div v-show="isCameraOpen && isLoading" class="camera-loading">
          Waiting for camera...
        </div>

        <div
          v-if="isCameraOpen"
          v-show="!isLoading"
          class="camera-box"
          :class="{ flash: isShotPhoto }"
        >
          <div class="camera-shutter" :class="{ flash: isShotPhoto }"></div>

          <video
            v-show="!isPhotoTaken"
            ref="camera"
            :width="250"
            :height="250"
            autoplay
          ></video>

          <canvas
            v-show="isPhotoTaken"
            id="photoTaken"
            ref="canvas"
            :width="250"
            :height="250"
          ></canvas>
        </div>
      </div>
      <span class="">Click Your Picture</span>
      <div>
        <div class="" v-if="isCameraOpen && !isLoading">
          <button
            type="button"
            class="btn btn-dark"
            @click="takePhoto"
            style="border-radius: 50%"
          >
            <i class="bi bi-camera" style="color: white; font-size: 26px"></i>
          </button>
        </div>

        <div style="padding: 10px">
          <button
            class="btn btn-outline-primary"
            v-if="isPhotoTaken && isCameraOpen"
            @click="submit()"
          >
            Submit
          </button>
        </div>
        <div>
          <button
            type="button"
            class="btn"
            :class="{
              'btn-outline-primary': !isCameraOpen,
              'btn-link': isCameraOpen,
            }"
            @click="toggleCamera"
          >
            <span v-if="!isCameraOpen"
              ><i class="bi bi-camera"></i> Open Camera</span
            >
            <span v-else>Cancel</span>
          </button>
        </div>
      </div>

      <NextPage />
    </div>
    <div class="card-footer"><PoweredBy /></div>
  </div>
</template>

<script type="text/javascript">
import PoweredBy from "./commons/PoweredBy.vue";
import NextPage from "./commons/NextPage.vue";
import { mapActions, mapMutations } from "vuex";

export default {
  name: "AppClickPic",
  components: {
    PoweredBy,
    NextPage,
  },
  data() {
    return {
      isCameraOpen: false,
      isPhotoTaken: false,
      isShotPhoto: false,
      isLoading: false,
      link: "#",
      fullPage: true,
      isLoadingPage: false,
    };
  },
  methods: {
    ...mapActions(["addharQRVerify", "verifyPhoneNumber"]),
    ...mapMutations(["nextStep"]),
    toggleCamera() {
      if (this.isCameraOpen) {
        this.isCameraOpen = false;
        this.isPhotoTaken = false;
        this.isShotPhoto = false;
        this.stopCameraStream();
      } else {
        this.isCameraOpen = true;
        this.createCameraElement();
      }
    },

    createCameraElement() {
      this.isLoading = true;

      const constraints = (window.constraints = {
        audio: false,
        video: true,
      });

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          this.isLoading = false;
          this.$refs.camera.srcObject = stream;
        })
        .catch((error) => {
          console.error(error);
          this.isLoading = false;
          alert("May the browser didn't support or there is some errors.");
        });
    },

    stopCameraStream() {
      let tracks = this.$refs.camera.srcObject.getTracks();

      tracks.forEach((track) => {
        track.stop();
      });
    },

    takePhoto() {
      if (!this.isPhotoTaken) {
        this.isShotPhoto = true;

        const FLASH_TIMEOUT = 50;

        setTimeout(() => {
          this.isShotPhoto = false;
        }, FLASH_TIMEOUT);
      }

      this.isPhotoTaken = !this.isPhotoTaken;

      const context = this.$refs.canvas.getContext("2d");
      context.drawImage(this.$refs.camera, 10, 10, 230, 230);
    },

    downloadImage() {
      const download = document.getElementById("downloadPhoto");
      const canvas = document
        .getElementById("photoTaken")
        .toDataURL("image/jpeg")
        .replace("image/jpeg", "image/octet-stream");
      download.setAttribute("href", canvas);
    },
    wait() {
      return new Promise((resolve) => {
        return setTimeout(() => {
          resolve();
        }, 3000);
      });
    },
    async submit() {
      try {
        this.isLoadingPage = true;

        await this.wait();

        const result = await this.addharQRVerify();
        if (result) {
          this.stopCameraStream();
          if (result.verified === true) {
            this.nextStep();
          } else {
            throw new Error(
              "Enter a valid phone number linked with your Addhaar"
            );
            // this.nextStep(5);
          }
        }
      } catch (e) {
        console.error(e);
        this.stopCameraStream();
        // this.nextStep(5);
        console.log("Enter a valid phone number linked with your Addhaar");
      }
    },
  },
};
</script>
<style type="text/css" scoped>
.maincontainer {
  width: 350px;
  height: 600px;
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

.web-camera-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 250px;
  height: 250px;

  .camera-button {
    /* margin-bottom: 2rem; */
  }

  .camera-box {
    .camera-shutter {
      opacity: 0;
      width: 200px;
      height: 200px;
      background-color: #fff;
      position: absolute;

      &.flash {
        opacity: 1;
      }
    }
  }

  .camera-shoot {
    margin: 1rem 0;

    button {
      height: 60px;
      width: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 100%;

      img {
        height: 35px;
        object-fit: cover;
      }
    }
  }

  .camera-loading {
    overflow: hidden;
    height: 100%;
    position: absolute;
    width: 100%;
    min-height: 150px;
    margin: 3rem 0 0 -1.2rem;

    ul {
      height: 100%;
      position: absolute;
      width: 100%;
      z-index: 999999;
      margin: 0;
    }
  }

  @keyframes preload {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }
}
</style>
