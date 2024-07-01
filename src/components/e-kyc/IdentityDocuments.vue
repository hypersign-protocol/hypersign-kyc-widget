<script type="text/javascript">
import { FPhi } from "@facephi/selphid-widget-web";
import { mapActions, mapMutations, mapGetters, mapState } from "vuex";
import PreviewData from '../commons/Preview.vue'
import { STEP_NAMES } from '@/config'
import MESSAGE from '../utils/lang/en'
export default {
    name: STEP_NAMES.IdDocs,
    components: {
        PreviewData
    },
    computed: {
        ifExtractedData() {
            return Object.keys(this.$store.state.kycExtractedData).length > 0 ? true : false;
        },
        ...mapGetters(['getIdDocumentLicenseKey']),
        ...mapState(["steps"]),
        checkIfOncainIdIsEnabled() {
            return this.steps.find(x => x.stepName === STEP_NAMES.OnChainId).isEnabled
        },
    },
    data: function () {
        return {
            // Demo configuration
            isWidgetStarted: false,
            FPhiCameraResolutions: {
                res600p: { title: '800x600', width: 800, height: 600 },
                res768p: { title: '1024x768', width: 1024, height: 768 },
                res720p: { title: '1280x720 (720p)', width: 1280, height: 720 },
                res1080p: { title: '1920x1080 (1080p)', width: 1920, height: 1080 },
            },
            cameraResolution: "res720p",
            // Widget configuration
            licenseKey: "3D430010231C062B0411476A4A2707434F4734070A330C060B243C103604415F72240025040D16352D0730040F0A200D4B6A430F0C330D073504415F2B4A0A290C0E003E1C1A645B412B114A4564050211352D072243594762585B724C52577D5B58644D4100281C1B27250211314A536452275163582F76225056602C5971525655645A5E76205056612C597253505516595E7256552464295807505754665A5B7455525463595B75535757665D287627535C632E5877535A55635D597423555561295D70532257155B5A76535023645F5803565650645A5977545224605C5A0351275664595972205324645B590052545768595E7555525C62295A0556515565585C7423525462595807502654645D2876585056602E5A77535656635C2A7657555C625D597552525667595D7650535D625B5904565257695A5E73555557612A5D7450525666585C7354522062515970525555155D5E7424515C61295B70525457655A2C74505427612B5C7F532750655D5F75525152622C5A0752565468585D77275553602B5B725252506559597658525665585C7F575A50695B50765153576258587E505257125A2A7752502763505A7F51215660592874565356622D5A75532155665A2D7423515063505A7656505412582F74235021605B5D7051545767585F7525525360515B72505657695A2F7651515160515C05565350605D5C73525257605E580453565711585F7551505D62595A7F565450635A507751555165515A0551515061585F7423535061515B07522650645A5E7422505160515B74515255605D5B7425532465595C03565650685A587322555163515903505150655A5076255352622E597056565464585077555457645C5D0453225568585976515020612A590550515515585176515020622B597053565464582C76515020612B5D0456205163595175585457602A580552565465582A7659505061295A73575750125B2F7256522062515A73575751145B2F72565051605F590752505513585F76235151632B5876525555645B2F72565524635C5D0451225568585976515020612A590551505516595C76515026605F587F535056145C58725853266429597353255562585F76235156602C5A7357575012595175585457602A597053215513585F76235151612A5A73575750125B2F7256522062515A73575751145B2F725650516051580253505764582D7650532664295C75502251635D5873545557652B5D72565450635C2C73575554635C5D04572256145C587658505C602A5905535B5462585F74505023602A580553215564582D7750532664295C755022516359597556515262515B7E515456685A50765652526559597550255666592B76205057652A5B71565554635C2A7658522363505903535A5115595D73575550622A587F512055145B5D74245350612A5D7050205111585C7755525C612B5A7E512557635B5F73505051602D5B715154576859597525515065595973535655665B2B76575357645F590756255713585077535353612E59025026571158587353525D622B5C7E565754625C5175535352602D5C7F515B5760582A77545023652B5B74522554635A2A77555251625D5B02572754655D5A76245551652C5A00525257645B597757515C602E5875565355655A2C77535551612A5973515650695D5A7220555D635A590550575769595B75535224625F5800532756615B5A7459535461595B04505657675B5076595052625E5B71525056615B2873515124605C5B71532155115C2A74555253602C5A77515355605A2C7557525D625C5905525155605D5F73525554652D5C0051575516595876575227602C5A05532657685B5A73555557625A5805565150605B5F74505555602C5B71505054605A5977255550622B5B76535155605A517453505465515B77502050685D5D7357555C62295C7656515660585D75505551625A597750525766582A73575150605A587E502251635C2F755854576150597E53565511585B76535050625E597E532155645B2F72565524635C5D045322551558597655502660585970525654655B2F72565426635C5D0453505516585D76225020602C5A0252255461585F75585457655A5A7357575713582876575157605F590453225568582D7624532664295D7350225163595A77565023602B5805535654655B2F72565524635C5D0450565564582F7754505D62595B02502251635C2F75585457612D590552575462582876205020635C5D04562056145C587355542065505A73575754135C2F7558545761505804535A546758287650505061295A73575750125B2F725652536051590753505661582B7622532664295872575751145C5876585023602E590353255516585D72565524602D597E53225462585F72585457602C597153525568582D765153516159587F535051635D5072565221605959075257551558587658505C605E5974575754134A45640D0A0635061A23250C0625050C2815415F241A1C234D4109390B0C28120623310B00270D415F36090535044F473C010A230F1000040702230F270A331D04230F17476A1C1B33044F473C070E21080D0272520F270D10007C4A0635435947110610644D4115310B022706062B31050C645B41093F0B082A090C16244A4564040D0239060C1218130072524B0B0800173F0A052F0F08477C4A19340E0710331C4B7C4330003C18010F254149721E0C34120A0A3E4A5364504D557215456411110A26010D2313415F722E082504330D394A14",
            bundlePath: window.location.origin + "/assets/selphid",
            language: "en",
            initialTip: false,
            askSimpleMode: false,
            cameraWidth: 1280,
            cameraHeight: 720,
            specificdata: ["PSP"], // PSP -  for passport
            cameraSelection: true,
            previewCapture: false,
            forceLandscape: false,
            captureTimeout: 10,
            captureRetries: 3,
            imageFormat: "image/jpeg",
            imageQuality: 0.95,
            debugMode: false,
            showLog: false,
            documentMode: FPhi.SelphID.DocumentMode.SingleSide,
            documentType: FPhi.SelphID.DocumentType.Passport,
            scanMode: FPhi.SelphID.ScanMode.Specific,
            blurredThreshold: 0.1,
            widgetVersion: FPhi.SelphID.Version,
            FPhiSelphIDConstants: FPhi.SelphID,
            widgetResult: "",

            isLoading: false,
            fullPage: true,
            toastMessage: "",
            toastType: "success",
            isToast: false,
        };
    },

    created() {
        this.licenseKey = this.getIdDocumentLicenseKey
        // if (!this.licenseKey) {
        //   let license = window.prompt("Please, enter the license key before start the operations: ") || "";
        //   this.licenseKey = license;
        //   this.generateBrowserCache(license);
        // }
    },

    methods: {
        ...mapMutations(["nextStep"]),
        ...mapActions(["verifyOcrIDDoc"]),
        // Demo methods
        enableWidget: async function () {
            // console.warn("[Demo] Start Capture");
            document.getElementById("widgetEventResult").innerText = '';
            const capabilities = await this.checkCapabilities();
            if (capabilities.camera && capabilities.wasm && capabilities.browser) {
                this.isWidgetStarted = true;
            } else {
                // ...
            }
        },

        toast(msg, type = "success") {
            this.isToast = true;
            this.toastMessage = msg;
            this.toastType = type;

            setTimeout(() => {
                this.isToast = false;
                this.toastMessage = "";
            }, 5000);
        },

        disableWidget: function () {
            // console.warn("[Demo] Stop Capture");
            document.getElementById("widgetEventResult").innerText = '';
            this.isWidgetStarted = false;
        },

        onCameraResolutionChange: function (event) {
            this.cameraWidth = this.FPhiCameraResolutions[event.target.value].width;
            this.cameraHeight = this.FPhiCameraResolutions[event.target.value].height;
        },

        // Widget event handlers
        onModuleLoaded: function () {
            // console.warn("[SelphID] onModuleLoaded");
        },

        onExtractionFinished: async function (extractionResult) {
            if (extractionResult.detail.images.frontDocument && extractionResult.detail.images.faceImage) {
                const data = extractionResult.detail
                await this.$store.commit('setKycExtractedData', { data, status: true })
                await this.$store.commit('setKycCapturedData', {
                    tokenFrontDocumentImage: extractionResult.detail.images.frontDocument,
                    tokenFaceImage: extractionResult.detail.images.faceImage,
                    countryCode: extractionResult.detail.extractionData.documentCountryIssuer
                })

                this.isWidgetStarted = false



            } else {
                // ...
            }

            this.isWidgetStarted = false;
            // this.widgetResult = 'Success! Extraction complete';
        },

        onExceptionCaptured: function (exceptionResult) {
            // console.warn("[SelphID] onExceptionCaptured");

            switch (exceptionResult.detail.exceptionType) {
                case (FPhi.SelphID.ExceptionType.CameraError):
                    console.error("Camera Error");
                    // ...
                    break;
                case (FPhi.SelphID.ExceptionType.UnexpectedCaptureError):
                    console.error("Unexpected Error");
                    // ...
                    break;
                case (FPhi.SelphID.ExceptionType.InitializingEngineError):
                    console.error("Engine Error");
                    // ...
                    break;
                case (FPhi.SelphID.ExceptionType.LicenseError):
                    console.error("License Error");
                    // ...
                    break;
                default:
                    console.error(exceptionResult.detail.message);
            }

            this.isWidgetStarted = false;
            this.widgetResult = 'Error! Something went wrong';
        },

        onUserCancelled: function () {
            this.isWidgetStarted = false;
            this.widgetResult = 'Error! The extraction has been cancelled';
        },

        onExtractionTimeout: function () {
            console.warn("[SelphID] onExtractionTimeout");

            this.isWidgetStarted = false;
            // this.widgetResult = 'Error! Time limit exceeded';
        },

        onTrackStatus: function (eventData) {
            let trackStatusCode = Object.entries(FPhi.SelphID.TrackStatus).find((e) => e[1] === eventData.detail.code);
            console.warn(`[SelphID] onTrackStatus (Code: ${trackStatusCode[1]} - ${trackStatusCode[0]}, Timestamp: ${eventData.detail.timeStamp}`);
        },

        // Widget methods
        checkCapabilities: async function () {
            // Check device capabilities (browser, memory, webassembly...) with checkCapabilities method
            const capabilities = await FPhi.SelphID.CheckCapabilities();
            return capabilities;
        },

        generateBrowserCache: function (license) {
            // Pre-load recources in cache (requires headers configuration)
            FPhi.SelphID.generateBrowserCache(this.bundlndlePath, license);
        },

        async verifyIdDocEventHandler(data) {
            try {
                if (!data) {
                    throw new Error('Invalid event data')
                }
                this.isLoading = true;
                this.toast(MESSAGE.IDDOCUMENT.VERIFYING_ID, "warning");
                await this.verifyOcrIDDoc()

                setTimeout(() => {
                    if (this.checkIfOncainIdIsEnabled) {
                        this.nextStep(5);
                    } else {
                        this.nextStep(6);
                    }
                    this.isLoading = false;
                }, 3000)

            } catch (e) {
                if (e.message) {
                    if (e.message.includes('Session with given ID')) {
                        this.isLoading = false;
                        return this.nextStep(8)
                    }
                }
                this.toast(e.message, "error");
                this.isLoading = false;
            }
        },
    },

}

</script>


<template>
    <div>
        <div class="card-body min-h-36">
            <PageHeading :header="'ID Verification'" :subHeader="'Upload front side of your passport'"
                style="text-align: center;" />
            <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></load-ing>
            <div class="row" style="text-align: left;" v-if="!ifExtractedData">
                <!-- SelphID Web Widget Container: Properties and events setup -->
                <div class="col-12 col-md-9" style="position: relative; min-height: 550px;  max-height: 90%;">
                    <facephi-selphid v-if="isWidgetStarted" :licenseKey="licenseKey" :bundlePath="bundlePath"
                        :language="language" :initialTip="initialTip" :askSimpleMode="askSimpleMode"
                        :cameraWidth="cameraWidth" :cameraHeight="cameraHeight" :cameraSelection="cameraSelection"
                        :previewCapture="previewCapture" :forceLandscape="forceLandscape"
                        :captureTimeout="captureTimeout" :captureRetries="captureRetries" :imageFormat="imageFormat"
                        :imageQuality="imageQuality" :documentType="documentType" :scanMode="scanMode"
                        :blurredThreshold="blurredThreshold" :showLog="showLog" :debugMode="debugMode"
                        :documentMode="documentMode" @onmoduleloaded="onModuleLoaded"
                        @onextractionfinished="onExtractionFinished" @onusercancelled="onUserCancelled"
                        @onexceptioncaptured="onExceptionCaptured" @onextractiontimeout="onExtractionTimeout"
                        @ontrackstatus="onTrackStatus"></facephi-selphid>
                    <div class="center" v-else>
                        <img src="../../assets/ocr-instruction.gif" v-if="!isLoading && !ifExtractedData" />
                    </div>
                    <div id="widgetEventResult" style="position: absolute; top: 0;">{{ widgetResult }}</div>
                </div>
                <!-- Widget demo configuration elements -->
                <div class="col-12 col-md-3 mt-3 mt-md-0">
                    <!-- <div>SelphID Web Widget Demo</div> -->

                    <div class="d-flex flex-column my-3">
                        <button type="button" id="btnStartCapture" class="btn btn-primary btn-block"
                            :disabled="isWidgetStarted" v-on:click.self="enableWidget">
                            Start capture
                        </button>
                        <button type="button" id="btnStopCapture" class="btn btn-danger btn-block mt-3"
                            :disabled="!isWidgetStarted" v-on:click.self="disableWidget">
                            Stop capture
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
                    <!-- 
      <div class="form-group form-check m-0">
        <input type="checkbox" id="previewCapture" class="form-check-input" v-model="previewCapture"
          :disabled="isWidgetStarted" />
        <label for="previewCapture" class="form-check-label">Preview capture</label>
      </div>
      <div class="form-group form-check m-0">
        <input type="checkbox" id="forceLandscape" class="form-check-input" v-model="forceLandscape"
          :disabled="isWidgetStarted" />
        <label for="forceLandscape" class="form-check-label">Force landscape</label>
      </div>
      <div class="form-group form-check m-0">
        <input type="checkbox" id="initialTip" class="form-check-input" v-model="initialTip"
          :disabled="isWidgetStarted" />
        <label for="initialTip" class="form-check-label">Initial tip</label>
      </div>
      <div class="form-group form-check m-0">
        <input type="checkbox" id="showLog" class="form-check-input" v-model="showLog" :disabled="isWidgetStarted" />
        <label for="showLog" class="form-check-label">Show extended log</label>
      </div>

      <div class="form-group mt-2">
        <div>Widget Version: <span id="widgetVersion">{{ widgetVersion }}</span></div>
      </div> -->
                </div>
            </div>
            <div class="row" v-else>
                <PreviewData @verifyIdDocEvent="verifyIdDocEventHandler" />
            </div>
        </div>
        <MessageBox :msg="toastMessage" :type="toastType" v-if="isToast" />

    </div>
</template>
