<script type="text/javascript">
import { FPhi } from '@facephi/selphid-widget-web'
import { mapActions, mapGetters, mapState } from 'vuex'
import PreviewData from '../commons/Preview.vue'
import ChooseDocumentType from '../commons/ChooseDocumentType.vue'
import { STEP_NAMES, FaicalAuthenticationError } from '@/config'
import MESSAGE from '../utils/lang/en'
import { EVENT, EVENTS } from '../utils/eventBus'
export default {
  name: STEP_NAMES.IdDocs,
  components: {
    PreviewData,
    ChooseDocumentType,
  },
  computed: {
    ifExtractedData() {
      return Object.keys(this.$store.state.kycExtractedData).length > 0
    },
    ...mapGetters(['checkIfUserConsentIsEnabled', 'checkIfOncainIdIsEnabled', 'checkIfIdDocumentIsEnabled', 'checkIfLivelinessIsEnabled', 'checkIfzkProofIsEnabled', 'enabledSteps', 'getWidgetConfigFromDb', 'getIdDocumentLicenseKey', 'getIfzkProofStep', 'getIfUserConsentStep']),
    ...mapState(['steps', 'hasKycDone']),
  },
  data: function () {
    return {
      chooseDocumentType: false,
      selectedDocumentType: '',
      manualMode: false,
      // Demo configuration
      isWidgetStarted: false,
      FPhiCameraResolutions: {
        res600p: { title: '800x600', width: 800, height: 600 },
        res768p: { title: '1024x768', width: 1024, height: 768 },
        res720p: { title: '1280x720 (720p)', width: 1280, height: 720 },
        res1080p: { title: '1920x1080 (1080p)', width: 1920, height: 1080 },
      },
      cameraResolution: 'res720p',
      // Widget configuration
      licenseKey:
        '3D430010231C062B0411476A4A2707434F4734070A330C060B243C103604415F72240025040D16352D0730040F0A200D4B6A430F0C330D073504415F2B4A0A290C0E003E1C1A645B412B114A4564050211352D072243594762585B724C52577D5B58644D4100281C1B27250211314A536452275163582F76225056602C5971525655645A5E76205056612C597253505516595E7256552464295807505754665A5B7455525463595B75535757665D287627535C632E5877535A55635D597423555561295D70532257155B5A76535023645F5803565650645A5977545224605C5A0351275664595972205324645B590052545768595E7555525C62295A0556515565585C7423525462595807502654645D2876585056602E5A77535656635C2A7657555C625D597552525667595D7650535D625B5904565257695A5E73555557612A5D7450525666585C7354522062515970525555155D5E7424515C61295B70525457655A2C74505427612B5C7F532750655D5F75525152622C5A0752565468585D77275553602B5B725252506559597658525665585C7F575A50695B50765153576258587E505257125A2A7752502763505A7F51215660592874565356622D5A75532155665A2D7423515063505A7656505412582F74235021605B5D7051545767585F7525525360515B72505657695A2F7651515160515C05565350605D5C73525257605E580453565711585F7551505D62595A7F565450635A507751555165515A0551515061585F7423535061515B07522650645A5E7422505160515B74515255605D5B7425532465595C03565650685A587322555163515903505150655A5076255352622E597056565464585077555457645C5D0453225568585976515020612A590550515515585176515020622B597053565464582C76515020612B5D0456205163595175585457602A580552565465582A7659505061295A73575750125B2F7256522062515A73575751145B2F72565051605F590752505513585F76235151632B5876525555645B2F72565524635C5D0451225568585976515020612A590551505516595C76515026605F587F535056145C58725853266429597353255562585F76235156602C5A7357575012595175585457602A597053215513585F76235151612A5A73575750125B2F7256522062515A73575751145B2F725650516051580253505764582D7650532664295C75502251635D5873545557652B5D72565450635C2C73575554635C5D04572256145C587658505C602A5905535B5462585F74505023602A580553215564582D7750532664295C755022516359597556515262515B7E515456685A50765652526559597550255666592B76205057652A5B71565554635C2A7658522363505903535A5115595D73575550622A587F512055145B5D74245350612A5D7050205111585C7755525C612B5A7E512557635B5F73505051602D5B715154576859597525515065595973535655665B2B76575357645F590756255713585077535353612E59025026571158587353525D622B5C7E565754625C5175535352602D5C7F515B5760582A77545023652B5B74522554635A2A77555251625D5B02572754655D5A76245551652C5A00525257645B597757515C602E5875565355655A2C77535551612A5973515650695D5A7220555D635A590550575769595B75535224625F5800532756615B5A7459535461595B04505657675B5076595052625E5B71525056615B2873515124605C5B71532155115C2A74555253602C5A77515355605A2C7557525D625C5905525155605D5F73525554652D5C0051575516595876575227602C5A05532657685B5A73555557625A5805565150605B5F74505555602C5B71505054605A5977255550622B5B76535155605A517453505465515B77502050685D5D7357555C62295C7656515660585D75505551625A597750525766582A73575150605A587E502251635C2F755854576150597E53565511585B76535050625E597E532155645B2F72565524635C5D045322551558597655502660585970525654655B2F72565426635C5D0453505516585D76225020602C5A0252255461585F75585457655A5A7357575713582876575157605F590453225568582D7624532664295D7350225163595A77565023602B5805535654655B2F72565524635C5D0450565564582F7754505D62595B02502251635C2F75585457612D590552575462582876205020635C5D04562056145C587355542065505A73575754135C2F7558545761505804535A546758287650505061295A73575750125B2F725652536051590753505661582B7622532664295872575751145C5876585023602E590353255516585D72565524602D597E53225462585F72585457602C597153525568582D765153516159587F535051635D5072565221605959075257551558587658505C605E5974575754134A45640D0A0635061A23250C0625050C2815415F241A1C234D4109390B0C28120623310B00270D415F36090535044F473C010A230F1000040702230F270A331D04230F17476A1C1B33044F473C070E21080D0272520F270D10007C4A0635435947110610644D4115310B022706062B31050C645B41093F0B082A090C16244A4564040D0239060C1218130072524B0B0800173F0A052F0F08477C4A19340E0710331C4B7C4330003C18010F254149721E0C34120A0A3E4A5364504D557215456411110A26010D2313415F722E082504330D394A14',
      bundlePath: window.location.origin + '/assets/selphid',
      language: 'en',
      initialTip: false,
      askSimpleMode: false,
      cameraWidth: 1280,
      cameraHeight: 720,
      cameraSelection: true,
      previewCapture: false,
      forceLandscape: false,
      captureTimeout: 10,
      captureRetries: 3,
      imageFormat: 'image/jpeg',
      imageQuality: 1,
      debugMode: false,
      showLog: false,
      documentMode: FPhi.SelphID.Mode.Full,
      documentType: FPhi.SelphID.DocumentType.Passport,
      scanMode: FPhi.SelphID.ScanMode.Specific,
      blurredThreshold: 0.1,
      widgetVersion: FPhi.SelphID.Version,
      FPhiSelphIDConstants: FPhi.SelphID,
      widgetResult: '',

      isLoading: false,
      fullPage: true,
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
    this.prepare()
  },

  beforeDestroy() {
    EVENT.unSubscribeEvent(EVENTS.IDDOCOCR, this.onVerifyIdOcrStatusEventRecieved)
  },

  methods: {
    ...mapActions(['nextStep', 'verifyOcrIDDoc', 'verifyOCRDocStatus', 'extractOcrIdDoc', 'clearVaultAllData']),
    getStepIndex(step) {
      return this.enabledSteps.indexOf(step)
    },
    getNextStepIndex() {
      let nextStepNumberIndex = null
      if (this.checkIfOncainIdIsEnabled || this.checkIfzkProofIsEnabled) {
        nextStepNumberIndex = this.getStepIndex(this.getIfzkProofStep) // 5
      } else if (this.checkIfUserConsentIsEnabled) {
        nextStepNumberIndex = this.getStepIndex(this.getIfUserConsentStep) // 6
      }
      return nextStepNumberIndex
    },
    prepare() {
      if (this.hasKycDone) {
        // Inside prepare this.hasKycDone = true
        // then move to onchainIdStep step
        const nextStepIndex = this.getNextStepIndex()
        this.nextStep(nextStepIndex)
        return
      }
      this.licenseKey = this.getIdDocumentLicenseKey
      EVENT.subscribeEvent(EVENTS.IDDOCOCR, this.onVerifyIdOcrStatusEventRecieved)
    },
    // Demo methods
    enableWidget: async function () {
      // console.warn("[Demo] Start Capture");
      // document.getElementById("widgetEventResult").innerText = "";
      const capabilities = await this.checkCapabilities()
      if (capabilities.camera && capabilities.wasm && capabilities.browser) {
        this.isWidgetStarted = true
      } else {
        // ...
      }
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
    disableWidget: function () {
      this.isWidgetStarted = false
      this.selectedDocumentType = ''
    },

    onCameraResolutionChange: function (event) {
      this.cameraWidth = this.FPhiCameraResolutions[event.target.value].width
      this.cameraHeight = this.FPhiCameraResolutions[event.target.value].height
    },

    // Widget event handlers
    onModuleLoaded: function () {
      // console.warn("[SelphID] onModuleLoaded");
    },

    onExtractionFinished: async function (extractionResult) {
      this.isLoading = true
      await this.$store.commit('setKycCapturedData', {
        tokenFrontDocumentImage: extractionResult.detail.images.frontDocument,
        tokenBackDocumentImage: extractionResult.detail.images.backDocument,
      })
      this.toast(MESSAGE.IDDOCUMENT.VERIFYING_ID, 'warning')
      this.extractOcrIdDoc({ documentType: this.selectedDocumentType })
        .then(async (res) => {
          // Inside. this.extractOcrIdDoc ...
          if (res?.serviceDocument) {
            // Inside. res?.serviceDocument ...
            let kycExtracted = {}

            kycExtracted = {
              ...JSON.parse(res.serviceDocument),
            }
            kycExtracted = {
              ...kycExtracted,
            }

            // Before committing setKycExtractedData..
            await this.$store.commit('setKycExtractedData', {
              data: {
                extractionRaw: { ocr: kycExtracted },
              },
              status: true,
            })
          } else {
            // Inside else committing setKycExtractedData..
            await this.$store.commit('setKycExtractedData', {
              data: {},
              status: false,
            })
          }

          this.isWidgetStarted = false
          this.isLoading = false
          this.toast(MESSAGE.IDDOCUMENT.DOC_EXTRACTION_FINISED, 'success')
        })
        .catch(async (e) => {
          // Error occurred during extraction
          this.isLoading = false
          this.isWidgetStarted = false
          await this.$store.commit('setKycExtractedData', {
            data: {},
            status: false,
          })
          this.toast(e.message, 'error')
          EVENT.unSubscribeEvent(EVENTS.IDDOCOCR, this.onVerifyIdOcrStatusEventRecieved)
          this.back()

          // TODO: Not working - Not moving to step 8
          if (e.message.includes('Session with given ID')) {
            // Inside if of catch
            this.isLoading = false
            this.nextStep(8)
          } else {
            // Inside else of catch
          }
        })
      setTimeout(this.verifyOCRDocStatus, 4000)
    },

    onExceptionCaptured: function (exceptionResult) {
      // console.warn("[SelphID] onExceptionCaptured");

      switch (exceptionResult.detail.exceptionType) {
        case FPhi.SelphID.ExceptionType.CameraError:
          // Camera Error
          // ...
          break
        case FPhi.SelphID.ExceptionType.UnexpectedCaptureError:
          // Unexpected Error
          // ...
          break
        case FPhi.SelphID.ExceptionType.InitializingEngineError:
          // Engine Error
          // ...
          break
        case FPhi.SelphID.ExceptionType.LicenseError:
          // License Error
          // ...
          break
        default:
        // Error: exceptionResult.detail.message
      }

      this.isWidgetStarted = false
      this.widgetResult = 'Error! Something went wrong'
      this.back()
    },

    onUserCancelled: function () {
      this.isWidgetStarted = false
      this.widgetResult = 'Error! The extraction has been cancelled'
      this.back()
    },

    onExtractionTimeout: function () {
      this.isWidgetStarted = false
      // this.widgetResult = 'Error! Time limit exceeded';
      this.back()
    },

    switchModes() {
      // console.log(this.manualMode)
      const docType = this.selectedDocumentType
      this.disableWidget()
      this.selectedDocumentType = docType
      this.enableWidget()
    },

    onTrackStatus: function (eventData) {
      // const trackStatusCode = Object.entries(FPhi.SelphID.TrackStatus).find((e) => e[1] === eventData.detail.code)
      // Track status: eventData.detail.code
    },

    // Widget methods
    checkCapabilities: async function () {
      // Check device capabilities (browser, memory, webassembly...) with checkCapabilities method
      const capabilities = await FPhi.SelphID.CheckCapabilities()
      return capabilities
    },

    generateBrowserCache: function (license) {
      // Pre-load recources in cache (requires headers configuration)
      FPhi.SelphID.generateBrowserCache(this.bundlndlePath, license)
    },

    async verifyIdDocEventHandler(data) {
      if (!data) {
        throw new Error('Invalid event data')
      }
      this.isLoading = true
      this.toast(MESSAGE.IDDOCUMENT.VERIFYING_ID, 'warning')
      this.verifyOcrIDDoc()
        .then(() => {
          setTimeout(() => {
            const nextStepIndex = this.getNextStepIndex()
            this.nextStep(nextStepIndex)
            this.isLoading = false
          }, 3000)
        })
        .catch(async (e) => {
          await this.$store.commit('setKycExtractedData', {
            data: {},
            status: false,
          })
          // if (e.message) {
          //   if (e.message.includes('Session with given ID')) {
          //     this.isLoading = false
          //     this.toast(e.message, 'error')
          //     return this.nextStep(8)
          //   } else {
          //     this.toast(e.message, 'error')
          //   }
          // }
          if (e.message) {
            /// /
            // We can do specific error handling here
            //
            if (e.message.includes(FaicalAuthenticationError.FACE_DOESNOT_MATACH) || e.message.includes(FaicalAuthenticationError.CHECK_COULD_NOT_PERFORMED) || e.message.includes(FaicalAuthenticationError.FAILED_POSE_OF_FACE) || e.message.includes(FaicalAuthenticationError.FAILED_FACIAL_PATTERN)) {
              // Error to clear data vault
              this.clearVaultAllData()
            }

            /// /
            this.failScreen = {
              isFail: true,
              message: e.message,
              buttonText: 'Back To Verifier App',
              onAction: () => {
                const data = JSON.stringify({
                  status: 'error',
                  message: e.message,
                })
                if (window.opener) {
                  // TODO: WARNING this should not be *, rather it should be right URL
                  window.opener.postMessage(data, '*')
                  self.close()
                } else {
                  window.close()
                }
              },
            }
          }
          // this.toast(e.message, 'error')
          this.isLoading = false
          EVENT.unSubscribeEvent(EVENTS.IDDOCOCR, this.onVerifyIdOcrStatusEventRecieved)
          this.back()
        })
    },

    onVerifyIdOcrStatusEventRecieved(event) {
      const { success, message } = event
      if (success) {
        this.toast(message)
      } else {
        this.toast(message, 'error')
      }
    },

    selectDocumentType() {
      this.chooseDocumentType = true
    },

    EventChoosenDocumentTypeHandler(data) {
      // Inside EventChoosenDocumentTypeHandler data
      if (!data || !data.docType) {
        return
      }
      this.selectedDocumentType = data.docType
      this.enableWidget()
      this.manualMode = false
      this.selectDocumentType()
    },

    back() {
      // Inside back..
      this.disableWidget()
      this.selectedDocumentType = ''
      this.chooseDocumentType = false
    },

    rescanHandler(result) {
      // Inside rescan handler...
      this.prepare()
      this.back()
    },
  },
}
</script>

<template>
  <div class="card-body min-h-36 kyc-container">
    <!-- <PageHeading :header="'ID Verification'" :subHeader="`Please Upload Your ${selectedDocumentType == '' ? 'ID Document' : selectedDocumentType.replace('_', ' ')}`" style="text-align: center" /> -->
    <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></load-ing>
    <failure-screen :message="failScreen.message" :button-text="failScreen.buttonText" :on-action="failScreen.onAction" v-if="failScreen.isFail" />

    <div class="row" v-if="!chooseDocumentType && !failScreen.isFail">
      <div class="col-12 mb-0 pb-0">
        <img src="../../assets/ocr-instruction.gif" class="d-block mx-auto" style="max-width: 100%" v-if="!isLoading && !hasKycDone" />
      </div>
      <div class="col-12 mb-0 pb-0">
        <v-card class="pa-4 verifier-card hypersign-box" elevation="2">
          <v-card-title class="text-h6 font-weight-bold pa-0 mb-2"><i class="bi bi-lightbulb"></i> Tips</v-card-title>
          <v-card-text class="pa-0 text-left">
            <ul class="ma-0 pa-0" style="list-style: none">
              <li class="d-flex align-center mb-0">
                <span>Choose document type, make sure that all the information on the photo is visible and easy to read</span>
              </li>
            </ul>
          </v-card-text>
        </v-card>
      </div>
      <div class="col-12 mb-0 pb-0">
        <ChooseDocumentType @EventChoosenDocumentType="EventChoosenDocumentTypeHandler" class="verifier-card hypersign-box mt-0" />
      </div>
    </div>
    <div v-else-if="!failScreen.isFail">
      <div class="row" style="text-align: left; min-height: 550px" v-if="!hasKycDone && selectedDocumentType != ''">
        <div class="col-md-8 mx-auto" style="position: relative; min-height: 400px; max-height: 80%">
          <facephi-selphid
            v-if="isWidgetStarted && selectedDocumentType != ''"
            :licenseKey="licenseKey"
            :bundlePath="bundlePath"
            :language="language"
            :initialTip="initialTip"
            :askSimpleMode="askSimpleMode"
            :cameraWidth="cameraWidth"
            :cameraHeight="cameraHeight"
            :cameraSelection="cameraSelection"
            :previewCapture="previewCapture"
            :forceLandscape="forceLandscape"
            :captureTimeout="captureTimeout"
            :captureRetries="captureRetries"
            :imageFormat="imageFormat"
            :imageQuality="imageQuality"
            :documentType="documentType"
            :scanMode="scanMode"
            :blurredThreshold="blurredThreshold"
            :showLog="showLog"
            :debugMode="debugMode"
            :documentMode="documentMode"
            @onmoduleloaded="onModuleLoaded"
            @onextractionfinished="onExtractionFinished"
            @onusercancelled="onUserCancelled"
            @onexceptioncaptured="onExceptionCaptured"
            @onextractiontimeout="onExtractionTimeout"
            @ontrackstatus="onTrackStatus"
            :startSimpleMode="manualMode"
          ></facephi-selphid>
        </div>
      </div>
      <div class="row" v-else>
        <div class="col-md-12">
          <PreviewData @verifyIdDocEvent="verifyIdDocEventHandler" @EventrescanIDDoc="rescanHandler" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hypersign-box {
  border-radius: 8px !important;
  -webkit-box-shadow: 0 0 2rem 0 rgba(136, 152, 170, 0.15) !important;
  box-shadow: 0 0 2rem 0 rgba(136, 152, 170, 0.15) !important;
}

.verifier-card {
  border-radius: 10px;
  max-width: 80%;
  margin: 0 auto 20px;
  background-color: #fff;
}

@media (max-width: 480px) {
  .verifier-card {
    /* transform: scale(1.1); */
    font-size: 14px;
    max-width: 100%;
  }
}
</style>
