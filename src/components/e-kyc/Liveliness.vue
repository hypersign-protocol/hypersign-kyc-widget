<style scoped>
.hypersign-box {
  border-radius: 8px !important;
  -webkit-box-shadow: 0 0 2rem 0 rgba(136, 152, 170, 0.15) !important;
  box-shadow: 0 0 2rem 0 rgba(136, 152, 170, 0.15) !important;
}
</style>

<script type="text/javascript">
import { FPhi } from '@facephi/selphi-widget-web'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import { STEP_NAMES } from '@/config'
import MESSAGE from '../utils/lang/en'
import { EVENT, EVENTS } from '../utils/eventBus'

export default {
  name: STEP_NAMES.LiveLiness,
  components: {},
  computed: {
    ...mapState(['steps', 'hasLivelinessDone']),
    ...mapGetters(['checkIfUserConsentIsEnabled', 'checkIfOncainIdIsEnabled', 'checkIfIdDocumentIsEnabled', 'checkIfLivelinessIsEnabled', 'checkIfzkProofIsEnabled', 'enabledSteps', 'getWidgetConfigFromDb', 'getIfzkProofStep', 'getIfIdDocumentStep', 'getIfUserConsentStep', 'getIfLivelinessStep']),
  },
  data: function () {
    return {
      isLoading: false,
      fullPage: true,
      // Demo configuration
      isWidgetStarted: false,
      FPhiCameraResolutions: {
        res480p: { title: '640x480', width: 640, height: 480 },
        res600p: { title: '800x600', width: 800, height: 600 },
        res768p: { title: '1024x768', width: 1024, height: 768 },
        res720p: { title: '1280x720 (720p)', width: 1280, height: 720 },
        res1080p: { title: '1920x1080 (1080p)', width: 1920, height: 1080 },
      },
      cameraResolution: 'res720p',
      // Widget configuration
      bundlePath: window.location.origin + '/assets/selphi',
      language: 'en',
      cameraWidth: 1280,
      cameraHeight: 1500,
      cameraType: FPhi.Selphi.CameraType.Front,
      interactible: true,
      stabilizationStage: true,
      cameraSwitchButton: false,
      faceTracking: false,
      timeout: 30000,
      imageFormat: 'image/jpeg',
      imageQuality: 0.95,
      showLog: false,
      cropFactor: 1.5,
      widgetVersion: FPhi.Selphi.Version,
      FPhiSelphiConstants: FPhi.Selphi,
      widgetResult: '',
      toastMessage: '',
      toastType: 'success',
      isToast: false,
      failScreen: {
        isFail: false,
        message: '',
        buttonText: '',
        onAction: null,
      },
    }
  },
  created() {
    console.log('Liveliness component created, hasLivelinessDone:', this.hasLivelinessDone)

    if (this.hasLivelinessDone) {
      console.log('Liveliness already done, moving to next step')
      const nextStepNumber = this.getNextStepIndex()
      this.nextStep(nextStepNumber)
      return
    }

    console.log('Setting up liveliness component...')
    // Ensure widget starts in initial state
    this.isWidgetStarted = false
    this.isLoading = false

    EVENT.subscribeEvent(EVENTS.LIVELINESS, this.onVerifyLivelinessStatusEventRecieved)
  },
  mounted() {
    console.log('Liveliness component mounted')
    // Ensure widget is in initial state when mounted
    this.resetWidget()
  },
  beforeDestroy() {
    EVENT.unSubscribeEvent(EVENTS.LIVELINESS, this.onVerifyLivelinessStatusEventRecieved)
  },
  methods: {
    ...mapMutations(['previousStep', 'setLivelinessCapturedData', 'setLivelinessDone']),
    ...mapActions(['verifyLiveliness', 'verifyLivelinessStatus', 'nextStep']),
    getStepIndex(step) {
      return this.enabledSteps.indexOf(step)
    },
    getNextStepIndex() {
      let nextStepNumberIndex = null
      if (this.checkIfIdDocumentIsEnabled) {
        nextStepNumberIndex = this.getStepIndex(this.getIfIdDocumentStep) // 4
      } else if (this.checkIfOncainIdIsEnabled || this.checkIfzkProofIsEnabled) {
        nextStepNumberIndex = this.getStepIndex(this.getIfzkProofStep) // 5
      } else if (this.checkIfUserConsentIsEnabled) {
        nextStepNumberIndex = this.getStepIndex(this.getIfUserConsentStep) // 6
      }
      return nextStepNumberIndex
    },
    // Demo methods
    enableWidget: async function () {
      this.widgetResult = ''
      const capabilities = await this.checkCapabilities()
      if (capabilities.camera && capabilities.wasm && capabilities.browser) {
        this.isWidgetStarted = true
      } else {
        this.toast('Device not supported', 'error')
      }
    },

    resetWidget: function () {
      this.isWidgetStarted = false
      this.isLoading = false
      this.widgetResult = ''
    },

    disableWidget: function () {
      this.isWidgetStarted = false
    },

    onCameraResolutionChange: function (event) {
      this.cameraWidth = this.FPhiCameraResolutions[event.target.value].width
      this.cameraHeight = this.FPhiCameraResolutions[event.target.value].height
    },

    // Widget event handlers
    onModuleLoaded: function () {
      // console.warn("[Selphi] onModuleLoaded");
    },

    onExtractionFinish: async function (extractionResult) {
      if (extractionResult.detail.bestImageCropped && extractionResult.detail.bestImageTokenized && extractionResult.detail.templateRaw) {
        await this.$store.commit('setLivelinessCapturedData', {
          tokenSelfiImage: extractionResult.detail.bestImageCropped.currentSrc,
          biometricTemplateRaw: extractionResult.detail.templateRaw,
          bestImageTokenized: extractionResult.detail.bestImageTokenized,
        })

        this.isWidgetStarted = false
        this.isLoading = true
        this.toast(MESSAGE.LIVELINESS.VERIFYING_SELFI, 'warning')
        this.verifyLiveliness()
          .then(async () => {
            await this.$store.commit('setLivelinessDone', true)
            const nextStepNumber = this.getNextStepIndex()
            this.nextStep(nextStepNumber)
            this.isLoading = false
          })
          .catch(async (e) => {
            await this.$store.commit('setLivelinessCapturedData', {})
            this.isLoading = false
            if (e.message) {
              this.failScreen = {
                isFail: true,
                message: e.message,
                buttonText: 'Back To Verifier App',
                onAction: () => {
                  if (window.opener) {
                    const data = JSON.stringify({
                      status: 'error',
                      message: e.message,
                    })
                    window.opener.postMessage(data, '*') // TODO: replace '*' with the actual origin of the opener
                    self.close()
                  } else {
                    window.close()
                  }
                },
              }
            }
            // this.toast(e.message, 'error')
            this.isLoading = false
            EVENT.unSubscribeEvent(EVENTS.LIVELINESS, this.onVerifyLivelinessStatusEventRecieved)
          })
        setTimeout(this.verifyLivelinessStatus, 500)
      } else {
        // ...
      }
    },

    onUserCancel: function () {
      // console.warn("[Selphi] onUserCancel");
      this.widgetResult = 'User cancelled the operation'
      this.isWidgetStarted = false
    },

    onExceptionCaptured: function (exceptionResult) {
      // console.warn("[Selphi] onExceptionCaptured");

      switch (exceptionResult.detail.exceptionType) {
        case FPhi.Selphi.ExceptionType.CameraError:
          this.toast('Camera Error', 'error')
          // ...
          break
        case FPhi.Selphi.ExceptionType.UnexpectedCaptureError:
          this.toast('Unexpected Error', 'error')
          // ...
          break
        case FPhi.Selphi.ExceptionType.InitializingEngineError:
          this.toast('Engine Error', 'error')
          // ...
          break
        default:
          this.toast(exceptionResult.detail.message, 'error')
      }

      this.isWidgetStarted = false
      this.toast('Error: Something went wrong', 'error')
    },

    onExtractionTimeout: function () {
      // console.warn("[Selphi] onExtractionTimeout");
      // this.widgetResult = 'Error! Time limit exceeded';
    },

    onTimeoutErrorButtonClick: function () {
      // console.warn("[Selphi] onTimeoutErrorButtonClick");
      this.isWidgetStarted = false
    },

    onStabilizing: function () {
      // console.warn("[Selphi] onStabilizing");
    },

    onTrackStatus: function (eventData) {
      const trackStatusCode = Object.entries(FPhi.Selphi.TrackStatus).find((e) => e[1] === eventData.detail.code)
      console.warn(trackStatusCode)
    },

    // Widget methods
    checkCapabilities: async function () {
      // Check device capabilities (browser, memory, webassembly...) with checkCapabilities method
      const capabilities = await FPhi.Selphi.CheckCapabilities()
      return capabilities
    },

    toast(msg, type = 'success') {
      EVENT.emitEvent(
        EVENTS.NOTIFY,
        JSON.stringify({
          toastMessage: msg,
          toastType: type,
        })
      )
    },

    onVerifyLivelinessStatusEventRecieved(event) {
      const { success, message } = event
      if (success) {
        this.toast(message)
      } else {
        this.toast(message, 'error')
      }
    },
  },
}
</script>

<template>
  <div class="liveliness-container">
    <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></load-ing>

    <!-- Failure Screen -->
    <failure-screen :message="failScreen.message" :button-text="failScreen.buttonText" :on-action="failScreen.onAction" v-if="failScreen.isFail" />

    <!-- Main Content -->
    <div v-if="!failScreen.isFail">
      <!-- Header Section -->
      <div class="header-section">
        <!-- <h1 class="main-title">Face Verification</h1> -->
        <p class="subtitle">Prove you are a real human being</p>
      </div>

      <!-- Widget Container -->
      <div class="widget-section" v-if="isWidgetStarted">
        <div class="col-md-12" style="position: relative; min-height: 450px; max-height: 100%">
          <facephi-selphi
            :bundlePath="bundlePath"
            :language="language"
            :cameraWidth="cameraWidth"
            :cameraHeight="cameraHeight"
            :cameraType="cameraType"
            :interactible="interactible"
            :stabilizationStage="stabilizationStage"
            :cameraSwitchButton="cameraSwitchButton"
            :faceTracking="faceTracking"
            :timeout="timeout"
            :imageFormat="imageFormat"
            :imageQuality="imageQuality"
            :cropFactor="cropFactor"
            :showLog="showLog"
            @onmoduleloaded="onModuleLoaded"
            @onstabilizing="onStabilizing"
            @onextractionfinish="onExtractionFinish"
            @onusercancel="onUserCancel"
            @onexceptioncaptured="onExceptionCaptured"
            @onextractiontimeout="onExtractionTimeout"
            @ontimeouterrorbuttonclick="onTimeoutErrorButtonClick"
            @ontrackstatus="onTrackStatus"
          ></facephi-selphi>
        </div>
      </div>

      <!-- Instructions Section -->
      <div class="instructions-section" v-else>
        <div class="col-md-12">
          <img src="../../assets/fr-instruction.gif" v-if="!isLoading" height="250px" />
        </div>
      </div>

      <!-- Tips Section -->
      <div class="tips-section" v-if="!isWidgetStarted && !isLoading">
        <div class="tips-box">
          <div class="tips-header">
            <i class="bi bi-lightbulb"></i>
            <span class="tips-title">Tips</span>
          </div>
          <div class="tips-content">
            <div class="tip-item">
              <i class="bi bi-check-circle tip-icon-success"></i>
              <span class="tip-text">Find a well lit place</span>
            </div>
            <div class="tip-item">
              <i class="bi bi-check-circle tip-icon-success"></i>
              <span class="tip-text">Ensure your face is within the frame</span>
            </div>
            <div class="tip-item">
              <i class="bi bi-x-circle tip-icon-error"></i>
              <span class="tip-text">Do not wear hats, glasses and masks</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Section -->
      <div class="action-section" v-if="!isWidgetStarted && !isLoading">
        <button class="btn-primary" :disabled="isWidgetStarted" @click="enableWidget()">
          <i class="bi bi-play-circle"></i>
          Start Capture
        </button>

        <!-- Debug Info -->
        <div style="margin-top: 5px; font-size: 10px; color: #666; text-align: center">Debug: isWidgetStarted={{ isWidgetStarted }}, isLoading={{ isLoading }}, componentName={{ $options.name }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-content {
  padding-top: none;
}
.liveliness-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 10px;
  background-color: #ffffff;
  padding-bottom: 0px; /* Reduced from 80px to 0px */
}

/* Header Section */
.header-section {
  text-align: center;
  margin-bottom: 0px; /* Reduced from 24px to 0px */
}

.main-title {
  font-size: 18px;
  font-weight: 600;
  color: #000000;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.subtitle {
  font-size: 14px;
  color: #666666;
  margin: 0;
  line-height: 1.4;
}

/* Widget Section */
.widget-section {
  flex: 1;
  min-height: 0;
  margin-bottom: 24px;
}

/* Instructions Section */
.instructions-section {
  flex: 1;
  min-height: 0;
  margin-bottom: 0px; /* Reduced from 24px to 0px */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Tips Section */
.tips-section {
  margin-bottom: 10px; /* Reduced from 24px to 10px */
}

.tips-box {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
}

.tips-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.tips-header i {
  font-size: 16px;
  color: #6c757d;
  margin-right: 8px;
}

.tips-title {
  font-size: 14px;
  font-weight: 600;
  color: #333333;
}

.tips-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tip-item {
  display: flex;
  align-items: center;
}

.tip-icon-success {
  font-size: 14px;
  color: #28a745;
  margin-right: 8px;
  flex-shrink: 0;
}

.tip-icon-error {
  font-size: 14px;
  color: #dc3545;
  margin-right: 8px;
  flex-shrink: 0;
}

.tip-text {
  font-size: 13px;
  color: #666666;
  line-height: 1.4;
}

/* Action Section */
.action-section {
  margin-top: auto;
  margin-bottom: 10px; /* Reduced from 20px to 10px */
}

.btn-primary {
  width: 100%;
  padding: 10px 16px;
  background-color: #000000;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
}

.btn-primary:hover {
  background-color: #333333;
}

.btn-primary:active {
  transform: translateY(1px);
}

.btn-primary:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

/* Mobile Responsive */
@media (max-width: 450px) {
  .liveliness-container {
    padding: 16px;
    padding-bottom: 80px; /* Maintain space for footer on mobile */
  }

  .main-title {
    font-size: 16px;
  }

  .subtitle {
    font-size: 13px;
  }

  .tips-box {
    padding: 12px;
  }

  .tips-title {
    font-size: 13px;
  }

  .tip-text {
    font-size: 12px;
  }

  .btn-primary {
    padding: 8px 14px;
    font-size: 13px;
    height: 36px;
  }
}
</style>
