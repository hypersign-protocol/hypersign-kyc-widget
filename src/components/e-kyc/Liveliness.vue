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
      cameraHeight: 720,
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
    if (this.hasLivelinessDone) {
      const nextStepNumber = this.getNextStepIndex()
      this.nextStep(nextStepNumber)
      return
    }

    EVENT.subscribeEvent(EVENTS.LIVELINESS, this.onVerifyLivelinessStatusEventRecieved)
  },
  beforeDestroy() {
    EVENT.unSubscribeEvent(EVENTS.LIVELINESS, this.onVerifyLivelinessStatusEventRecieved)
  },
  methods: {
    ...mapMutations(['previousStep']),
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
        // ...
      }
    },

    disableWidget: function () {
      this.widgetResult = ''
      this.isWidgetStarted = false
    },

    onCameraResolutionChange: function (event) {
      this.cameraWidth = this.FPhiCameraResolutions[event.target.value].width
      this.cameraHeight = this.FPhiCameraResolutions[event.target.value].height
    },

    // Widget event handlers
    onModuleLoaded: function () {},

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

    onUserCancel: function () {
      // console.warn("[Selphi] onUserCancel");

      this.isWidgetStarted = false
      this.toast('Error: The extraction has been cancelled', 'error')
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
      // Track status: eventData.detail.code
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
  <div class="card-body kyc-container">
    <!-- <PageHeading :header="'Face Verification'" :subHeader="'Prove you a real human being'" /> -->
    <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></load-ing>
    <failure-screen :message="failScreen.message" :button-text="failScreen.buttonText" :on-action="failScreen.onAction" v-if="failScreen.isFail" />
    <div class="row h-100" v-if="!failScreen.isFail">
      <div class="col-md-12" v-if="isWidgetStarted" style="position: relative; min-height: 450px; max-height: 90%">
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
      <div class="col-md-12" v-else>
        <img src="../../assets/fr-instruction.gif" v-if="!isLoading" />
      </div>
    </div>
    <div class="row" v-if="!isWidgetStarted && !isLoading && !failScreen.isFail">
      <div class="col-12">
        <v-card class="pa-4 verifier-card hypersign-box" elevation="2">
          <v-card-title class="text-h6 font-weight-bold pa-0 mb-2"><i class="bi bi-lightbulb"></i> Tips</v-card-title>
          <v-card-text class="pa-0">
            <ul class="ma-0 pa-0" style="list-style: none">
              <li class="d-flex align-center mb-2">
                <i class="bi bi-check-circle text-success mr-2"></i>
                <span>Find a well lit place</span>
              </li>
              <li class="d-flex align-center mb-2">
                <i class="bi bi-check-circle text-success mr-2"></i>
                <span>Ensure your face is within the frame</span>
              </li>
              <li class="d-flex align-center">
                <i class="bi bi-x-circle text-error mr-2"></i>
                <span>Do not wear hats, glasses and masks</span>
              </li>
            </ul>
          </v-card-text>
        </v-card>
      </div>
    </div>

    <div class="row" v-if="!isWidgetStarted && !isLoading && !failScreen.isFail">
      <div class="col-12 center">
        <div class="col-md-4 d-flex flex-column widget-card-width">
          <v-btn type="v-btn" id="btnStartCapture" block color="secondary" :disabled="isWidgetStarted" title="Start Capture" @click="enableWidget()"><i class="bi bi-play-circle mx-1"></i> Start Capture</v-btn>
          <!-- <button type="button" id="btnStopCapture" class="btn btn-link" :disabled="!isWidgetStarted" @click="disableWidget()" title="Stop Capture"><i class="bi bi-stop-circle"></i> Stop Capture</button> -->
        </div>
      </div>
    </div>
  </div>
</template>
