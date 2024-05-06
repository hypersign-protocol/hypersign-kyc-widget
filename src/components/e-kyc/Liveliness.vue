<style></style>


<script type="text/javascript">
import { FPhi } from "@facephi/selphi-widget-web";
import { mapActions, mapMutations, } from "vuex";
import { STEP_NAMES } from "@/config";
export default {
    name: STEP_NAMES.LiveLiness,
    components: {
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
            cameraResolution: "res720p",

            // Widget configuration
            bundlePath: window.location.origin + "/assets/selphi",
            language: "en",
            cameraWidth: 1280,
            cameraHeight: 720,
            cameraType: FPhi.Selphi.CameraType.Front,
            interactible: true,
            stabilizationStage: true,
            cameraSwitchButton: false,
            faceTracking: false,
            timeout: 30000,
            imageFormat: "image/jpeg",
            imageQuality: 0.95,
            showLog: false,
            cropFactor: 1.5,
            widgetVersion: FPhi.Selphi.Version,
            FPhiSelphiConstants: FPhi.Selphi,
            widgetResult: "",

            toastMessage: "",
            toastType: "success",
            isToast: false,
        }
    },
    methods: {
        ...mapMutations(["nextStep", "previousStep"]),
        ...mapActions(["verifyLiveliness"]),
        // Demo methods
        enableWidget: async function () {
            console.warn("[Demo] Start Capture");
            this.widgetResult = '';
            const capabilities = await this.checkCapabilities();
            if (capabilities.camera && capabilities.wasm && capabilities.browser) {
                this.isWidgetStarted = true;
            } else {
                // ...
            }
        },

        disableWidget: function () {
            console.warn("[Demo] Stop Capture");
            this.widgetResult = '';
            this.isWidgetStarted = false;
        },

        onCameraResolutionChange: function (event) {
            console.log(event);
            this.cameraWidth = this.FPhiCameraResolutions[event.target.value].width;
            this.cameraHeight = this.FPhiCameraResolutions[event.target.value].height;
        },

        // Widget event handlers        
        onModuleLoaded: function (eventData) {
            console.warn("[Selphi] onModuleLoaded");
            console.log(eventData.detail);
        },

        onExtractionFinish: async function (extractionResult) {

            console.log(extractionResult)

            if (extractionResult.detail.bestImageCropped) {
                // Continue process.

                // store data in store
                console.log('Beofre setting liveliness data to store ')
                await this.$store.commit('setLivelinessDone', true)
                await this.$store.commit('setLivelinessCapturedData', {
                    tokenSelfiImage: extractionResult.detail.bestImageCropped.currentSrc
                })

                this.isWidgetStarted = false;


                try {
                    this.isLoading = true;
                    this.toast('Verifying your selfie... nextStep 4', "warning");
                    await this.verifyLiveliness()
                    await this.$store.commit('nextStep')
                    this.isLoading = false;
                } catch (e) {
                    this.toast(e.message, "error");
                    this.isLoading = false;
                }

            } else {
                // ...
            }


        },

        onExceptionCaptured: function (exceptionResult) {
            console.warn("[Selphi] onExceptionCaptured");
            console.log(exceptionResult.detail);

            switch (exceptionResult.detail.exceptionType) {
                case (FPhi.Selphi.ExceptionType.CameraError):
                    console.error("Camera Error");
                    // ...
                    break;
                case (FPhi.Selphi.ExceptionType.UnexpectedCaptureError):
                    console.error("Unexpected Error");
                    // ...
                    break;
                case (FPhi.Selphi.ExceptionType.InitializingEngineError):
                    console.error("Engine Error");
                    // ...
                    break;
                default:
                    console.error(exceptionResult.detail.message);
            }

            this.isWidgetStarted = false;
            this.widgetResult = 'Error! Something went wrong';
        },

        onUserCancel: function () {
            console.warn("[Selphi] onUserCancel");

            this.isWidgetStarted = false;
            this.widgetResult = 'Error! The extraction has been cancelled';
        },

        onExtractionTimeout: function (extractionTimeoutResult) {
            console.warn("[Selphi] onExtractionTimeout");
            console.log(extractionTimeoutResult.detail);

            this.widgetResult = 'Error! Time limit exceeded';
        },

        onTimeoutErrorButtonClick: function () {
            console.warn("[Selphi] onTimeoutErrorButtonClick");

            this.isWidgetStarted = false;
        },

        onStabilizing: function (stabilizingResult) {
            console.warn("[Selphi] onStabilizing");
            console.log(stabilizingResult.detail);
        },

        onTrackStatus: function (eventData) {
            let trackStatusCode = Object.entries(FPhi.Selphi.TrackStatus).find(e => e[1] === eventData.detail.code);
            console.warn(`[Selphi] onTrackStatus (Code: ${trackStatusCode[1]} - ${trackStatusCode[0]}, Timestamp: ${eventData.detail.timeStamp}`);
            console.log(eventData.detail);
        },

        // Widget methods
        checkCapabilities: async function () {
            // Check device capabilities (browser, memory, webassembly...) with checkCapabilities method
            const capabilities = await FPhi.Selphi.CheckCapabilities();
            console.log("Selphi: Widget Check Capabilities Check:\n", capabilities);
            return capabilities;
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
    }
}

</script>


<template>
    <div>
        <div class="card-body min-h-36">
            <PageHeading :header="'Facial Recognition'" :subHeader="'We need to verify if you are a real human'" />
            <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></load-ing>
            <div class="row h-100">
                <!-- Selphi Web Widget Container: Properties and events setup -->
                <div class="col-12 col-md-9" style="position: relative; min-height: 500px; max-height: 90%;">
                    <facephi-selphi v-if="isWidgetStarted" :bundlePath="bundlePath" :language="language"
                        :cameraWidth="cameraWidth" :cameraHeight="cameraHeight" :cameraType="cameraType"
                        :interactible="interactible" :stabilizationStage="stabilizationStage"
                        :cameraSwitchButton="cameraSwitchButton" :faceTracking="faceTracking" :timeout="timeout"
                        :imageFormat="imageFormat" :imageQuality="imageQuality" :cropFactor="cropFactor"
                        :showLog="showLog" @onmoduleloaded="onModuleLoaded" @onstabilizing="onStabilizing"
                        @onextractionfinish="onExtractionFinish" @onusercancel="onUserCancel"
                        @onexceptioncaptured="onExceptionCaptured" @onextractiontimeout="onExtractionTimeout"
                        @ontimeouterrorbuttonclick="onTimeoutErrorButtonClick"
                        @ontrackstatus="onTrackStatus"></facephi-selphi>
                    <div v-else>
                        <img src="../../assets/fr-instruction.gif" v-if="!isLoading" />
                    </div>
                    <div id="widgetEventResult" style="position: absolute; top: 0;">{{ widgetResult }}</div>
                </div>

                <!-- Widget demo configuration elements -->
                <div class="col-12 col-md-3 mt-3 mt-md-0">
                    <!-- <div>Selphi Web Widget Demo</div> -->

                    <div class="d-flex flex-column my-3">
                        <button type="button" id="btnStartCapture" class="btn btn-primary btn-block"
                            :disabled="isWidgetStarted" v-on:click.self="enableWidget">Start capture
                        </button>
                        <button type="button" id="btnStopCapture" class="btn btn-danger btn-block mt-3"
                            :disabled="!isWidgetStarted" v-on:click.self="disableWidget">Stop capture
                        </button>
                    </div>

                    <div class="form-group">
                        <label for="cameraResolution">Camera Resolution</label>
                        <select id="cameraResolution" :disabled="isWidgetStarted" class="form-control mt-2"
                            :value=cameraResolution @change="onCameraResolutionChange($event)">
                            <option v-for="key in Object.keys(FPhiCameraResolutions)" :key="key" :value="key">
                                {{ FPhiCameraResolutions[key].title }}
                            </option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="cameraType">Camera type</label>
                        <select id="cameraType" class="form-control mt-2" :disabled="isWidgetStarted"
                            v-model="cameraType">
                            <option :value="FPhiSelphiConstants.CameraType.Front">Front</option>
                            <option :value="FPhiSelphiConstants.CameraType.Back">Back</option>
                        </select>
                    </div>
                    <!-- 
                <div class="form-group form-check m-0 mt-3">
                    <input id="interactible" type="checkbox" class="form-check-input" :disabled="isWidgetStarted"
                        v-model="interactible" />
                    <label for="interactible" class="form-check-label">Interactible</label>
                </div>
                <div class="form-group form-check m-0">
                    <input id="stabilizationStage" type="checkbox" class="form-check-input" :disabled="isWidgetStarted"
                        v-model="stabilizationStage" />
                    <label for="stabilizationStage" class="form-check-label">Stabilization stage</label>
                </div>
                <div class="form-group form-check m-0">
                    <input id="cameraSwitchButton" type="checkbox" class="form-check-input" :disabled="isWidgetStarted"
                        v-model="cameraSwitchButton" />
                    <label for="cameraSwitchButton" class="form-check-label">Camera Switch Button</label>
                </div>
                <div class="form-group form-check m-0">
                    <input id="faceTracking" type="checkbox" class="form-check-input" :disabled="isWidgetStarted"
                        v-model="faceTracking" />
                    <label for="faceTracking" class="form-check-label">Face Tracking</label>
                </div>
                <div class="form-group form-check m-0">
                    <input id="showLog" type="checkbox" class="form-check-input" :disabled="isWidgetStarted"
                        v-model="showLog" />
                    <label for="showLog" class="form-check-label">Show extended log</label>
                </div>

                <div class="form-group mt-2">
                    <div>Widget Version: <span id="widgetVersion">{{ widgetVersion }}</span></div>
                </div> -->
                </div>
            </div>
        </div>
        <MessageBox :msg="toastMessage" :type="toastType" v-if="isToast" />
    </div>

</template>
