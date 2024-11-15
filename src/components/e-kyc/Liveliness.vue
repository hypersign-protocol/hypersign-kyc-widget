<style></style>

<script type="text/javascript">
import { FPhi } from '@facephi/selphi-widget-web'
import { mapActions, mapMutations, mapState } from 'vuex'
import { STEP_NAMES } from '@/config'
import MESSAGE from '../utils/lang/en'
import { EVENT, EVENTS } from '../utils/eventBus'
export default {
  name: STEP_NAMES.LiveLiness,
  components: {},
  computed: {
    ...mapState(['steps', 'hasLivelinessDone']),
    checkIfOncainIdIsEnabled() {
      return this.steps.find((x) => x.stepName === STEP_NAMES.OnChainId).isEnabled
    },
    checkIfIdDocumentIsEnabled() {
      return this.steps.find((x) => x.stepName === STEP_NAMES.IdDocs).isEnabled
    },
    checkIfUserConsentIsEnabled() {
      return this.steps.find((x) => x.stepName === STEP_NAMES.UserConsent).isEnabled
    },
    checkIfLivelinessIsEnabled() {
      return this.steps.find((x) => x.stepName === STEP_NAMES.LiveLiness).isEnabled
    },
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
    }
  },
  created() {
    if (this.hasLivelinessDone) {
      // then move to idDocStep step
      const idDocStep = this.steps.find((step) => step.stepName === STEP_NAMES.IdDocs)
      this.nextStep(idDocStep)
      return
    }

    EVENT.subscribeEvent(EVENTS.LIVELINESS, this.onVerifyLivelinessStatusEventRecieved)
  },
  beforeDestroy() {
    EVENT.unSubscribeEvent(EVENTS.LIVELINESS, this.onVerifyLivelinessStatusEventRecieved)
  },
  methods: {
    ...mapMutations(['nextStep', 'previousStep']),
    ...mapActions(['verifyLiveliness', 'verifyLivelinessStatus']),
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
        await this.$store.commit('setLivelinessDone', true)
        await this.$store.commit('setLivelinessCapturedData', {
          tokenSelfiImage: extractionResult.detail.bestImageCropped.currentSrc,
          biometricTemplateRaw: extractionResult.detail.templateRaw,
          bestImageTokenized: extractionResult.detail.bestImageTokenized,
        })

        this.isWidgetStarted = false
        this.isLoading = true
        this.toast(MESSAGE.LIVELINESS.VERIFYING_SELFI, 'warning')
        this.verifyLiveliness()
          .then(() => {
            let nextStepNumber = null
            if (this.checkIfIdDocumentIsEnabled) {
              nextStepNumber = 4
            } else if (this.checkIfOncainIdIsEnabled) {
              nextStepNumber = 5
            } else if (this.checkIfUserConsentIsEnabled) {
              nextStepNumber = 7
            }
            this.nextStep(nextStepNumber)
            this.isLoading = false
          })
          .catch((e) => {
            if (e.message) {
              if (e.message.includes('Session with given ID')) {
                this.isLoading = false
                this.nextStep(8)
                return
              }
            }
            this.toast(e.message, 'error')
            this.isLoading = false
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
          console.error('Camera Error')
          // ...
          break
        case FPhi.Selphi.ExceptionType.UnexpectedCaptureError:
          console.error('Unexpected Error')
          // ...
          break
        case FPhi.Selphi.ExceptionType.InitializingEngineError:
          console.error('Engine Error')
          // ...
          break
        default:
          console.error(exceptionResult.detail.message)
      }

      this.isWidgetStarted = false
      this.widgetResult = 'Error! Something went wrong'
    },

    onUserCancel: function () {
      // console.warn("[Selphi] onUserCancel");

      this.isWidgetStarted = false
      this.widgetResult = 'Error! The extraction has been cancelled'
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
      this.isToast = true
      this.toastMessage = msg
      this.toastType = type

      setTimeout(() => {
        this.isToast = false
        this.toastMessage = ''
      }, 6000)
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
  <div>
    <div class="card-body min-h-36">
      <PageHeading :header="'Facial Recognition'" :subHeader="'We need to verify if you are a real human'" />
      <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></load-ing>
      <div class="row h-100">
        <!-- Selphi Web Widget Container: Properties and events setup -->
        <div class="col-12 col-md-9" style="position: relative; min-height: 500px; max-height: 90%">
          <facephi-selphi
            v-if="isWidgetStarted"
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
          <div v-else>
            <img src="../../assets/fr-instruction.gif" v-if="!isLoading" />
          </div>
          <div id="widgetEventResult" style="position: absolute; top: 0">
            {{ widgetResult }}
          </div>
        </div>

        <!-- Widget demo configuration elements -->
        <div class="col-12 col-md-3 mt-3 mt-md-0">
          <!-- <div>Selphi Web Widget Demo</div> -->

          <div class="d-flex flex-column my-3">
            <button type="button" id="btnStartCapture" class="btn btn-primary btn-block" :disabled="isWidgetStarted" title="Start Capture" @click="enableWidget()"><i class="bi bi-play-circle"></i> Start Capture</button>
            <button type="button" id="btnStopCapture" class="btn btn-danger btn-block mt-2" :disabled="!isWidgetStarted" @click="disableWidget()" title="Stop Capture"><i class="bi bi-stop-circle"></i> Stop Capture</button>
          </div>

          <div class="form-group">
            <label for="cameraResolution">Camera Resolution</label>
            <select id="cameraResolution" :disabled="isWidgetStarted" class="form-control mt-2" :value="cameraResolution" @change="onCameraResolutionChange($event)">
              <option v-for="key in Object.keys(FPhiCameraResolutions)" :key="key" :value="key">
                {{ FPhiCameraResolutions[key].title }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="cameraType">Camera type</label>
            <select id="cameraType" class="form-control mt-2" :disabled="isWidgetStarted" v-model="cameraType">
              <option :value="FPhiSelphiConstants.CameraType.Front">Front</option>
              <option :value="FPhiSelphiConstants.CameraType.Back">Back</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <MessageBox :msg="toastMessage" :type="toastType" :action="isToast ? 'show' : 'hide'" />
    </div>
  </div>
</template>
