<template>
  <div class="card maincontainer">
    <load-ing
      :active.sync="isLoadingPage"
      :can-cancel="true"
      :is-full-page="fullPage"
    ></load-ing>
    <NavBar />
    <div class="card-body">
      <PageHeading
        :header="'Liveliness Check'"
        :subHeader="'Open camera and click your picture'"
      />
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
            class="btn btn-outline-dark"
            @click="submit()"
            v-if="isPhotoTaken && isCameraOpen"
          >
            Next
          </button>
          <button
            type="button"
            class="btn"
            :class="{
              'btn-outline-dark': !isCameraOpen,
              'btn-link btn-dark': isCameraOpen,
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
    </div>
    <MessageBox :msg="toastMessage" :type="toastType" v-if="isToast" />
    <div class="card-footer">
      <PoweredBy />
    </div>
  </div>
</template>

<script type="text/javascript">
import PoweredBy from "./commons/PoweredBy.vue";
import { mapActions, mapMutations } from "vuex";

export default {
  name: "AppClickPic",
  // props: {
  //   jumpStep: Number | null,
  // },
  components: {
    PoweredBy,
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
      toastMessage: "",
      toastType: "success",
      isToast: false,
      width: 0,
      height: 0,
    };
  },
  methods: {
    ...mapActions(["addharQRVerify", "verifyImage"]),
    ...mapMutations(["nextStep", "setImage"]),
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
        video: {
          facingMode: "user",
          width: {
            min: 640,
            ideal: 1280,
            max: 1920,
          },
          height: {
            min: 480,
            ideal: 720,
            max: 1080,
          },
        },
      });

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          this.isLoading = false;
          this.$refs.camera.srcObject = stream;

          const track = stream.getVideoTracks()[0];
          this.width = track.getSettings().width;
          this.height = track.getSettings().height;
        })
        .catch((error) => {
          console.error(error);
          this.isLoading = false;
          // alert("May the browser didn't support or there is some errors.");
          this.toast(error.message, "error");
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
      const canvas = this.$refs.canvas;
      const context = this.$refs.canvas.getContext("2d");
      const video = this.$refs.camera;

      if (this.isPhotoTaken) {
        const size = Math.min(this.width, this.height);
        const x = (this.width - size) / 2;
        const y = (this.height - size) / 2;
        context.drawImage(
          video,
          x,
          y,
          size,
          size,
          5,
          7,
          canvas.width - 10,
          canvas.height
        );

        const imageData = this.$refs.canvas.toDataURL();
        this.setImage(imageData);
      }
    },

    downloadImage() {
      const link = document.createElement("a");
      link.download = "photo.png";
      link.href = this.$refs.canvas.toDataURL();
      link.click();
    },
    wait() {
      return new Promise((resolve) => {
        return setTimeout(() => {
          resolve();
        }, 3000);
      });
    },
    async submit() {
      const that = this;
      try {
        this.isLoadingPage = true;

        // await this.wait();

        const result = await this.verifyImage();
        if (result) {
          this.stopCameraStream();
          this.isLoadingPage = false;
          if (result.verified) {
            that.toast(
              "Match Found : " +
                result.verified +
                "  " +
                result.userImageScore +
                " %"
            );
            await that.wait();
            this.isLoadingPage = false;

            this.nextStep(4);
          } else {
            that.toast(
              "Match Not Found : " +
                result.verified +
                "  " +
                result.userImageScore +
                " %",
              "error"
            );

            await that.wait();
            this.isLoadingPage = false;
            this.toggleCamera();
          }
        }
      } catch (e) {
        this.isLoadingPage = false;
        this.stopCameraStream();
        this.toast(e, "error");
        this.toggleCamera();
      }
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
