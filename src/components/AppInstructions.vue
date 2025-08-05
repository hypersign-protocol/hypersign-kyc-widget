<template>
  <div class="instructions-container">
    <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></load-ing>

    <!-- Header Section -->
    <div class="header-section">
      <h1 class="main-title">Let's get you verified</h1>
      <p class="subtitle">Follow the simple steps below</p>
    </div>

    <!-- Steps Section -->
    <div class="steps-section">
      <div class="step-item" v-if="getIfLivelinessStep.isEnabled == true">
        <AppInstructionStep stepNumber="1" :stepTitle="getIfLivelinessStep.stepTitle" :isDone="hasLivelinessDone" :logo="getIfLivelinessStep.logo" />
      </div>

      <div class="step-item" v-if="getIfIdDocumentStep.isEnabled == true">
        <AppInstructionStep stepNumber="2" :logo="getIfIdDocumentStep.logo" :stepTitle="getIfIdDocumentStep.stepTitle" :isDone="hasKycDone" />
      </div>

      <div class="step-item" v-if="getIfzkProofStep.isEnabled == true">
        <AppInstructionStep stepNumber="3" :stepTitle="getIfzkProofStep.stepTitle" :logo="getIfzkProofStep.logo" :isDone="false" />
      </div>

      <div class="step-item" v-if="getIfUserConsentStep.isEnabled == true">
        <AppInstructionStep :stepNumber="getIfzkProofStep.isEnabled ? '5' : '4'" :stepTitle="getIfUserConsentStep.stepTitle" :logo="getIfUserConsentStep.logo" :isDone="false" />
      </div>
    </div>

    <!-- Action Section -->
    <div class="action-section">
      <button class="btn-primary" @click="nextStep(nextStepNumeber)">Let's go!</button>
    </div>
  </div>
</template>

<script type="text/javascript">
import { mapMutations, mapActions, mapGetters, mapState } from 'vuex'
import AppInstructionStep from './commons/AppInstructionStep.vue'
import { STEP_NAMES } from '@/config'
import { EVENT, EVENTS } from './utils/eventBus'

export default {
  name: 'AppInstructions',
  components: {
    AppInstructionStep,
  },
  computed: {
    ...mapGetters(['enabledSteps', 'getCavachAccessToken', 'getRedirectUrl', 'getIfzkProofStep', 'getIfIdDocumentStep', 'getIfUserConsentStep', 'getIfLivelinessStep']),
    ...mapState(['hasLivelinessDone', 'hasKycDone', 'hasSbtMintDone', 'steps']),
  },
  async created() {
    await this.checkIfCredentialAlreadyExistsInVault()

    if (this.hasLivelinessDone) {
      if (this.hasKycDone) {
        const isOnChainIdConfigured = this.enabledSteps.find((step) => step.stepName === STEP_NAMES.ZkProofs)

        if (isOnChainIdConfigured) {
          if (!this.hasSbtMintDone) {
            this.nextStepNumeber = this.enabledSteps.indexOf(isOnChainIdConfigured)
          } else {
            const userConsentStep = this.enabledSteps.find((step) => step.stepName === STEP_NAMES.ZkProofs)
            this.nextStepNumeber = this.enabledSteps.indexOf(userConsentStep)
          }
        } else {
          const userConsentStep = this.enabledSteps.find((step) => step.stepName === STEP_NAMES.UserConsent)
          this.nextStepNumeber = this.enabledSteps.indexOf(userConsentStep)
        }
      } else {
        const isKYCConfigured = this.enabledSteps.find((step) => step.stepName === STEP_NAMES.IdDocs)
        if (isKYCConfigured) {
          this.nextStepNumeber = this.enabledSteps.indexOf(isKYCConfigured)
        } else {
          const iszkProofConfigured = this.enabledSteps.find((step) => step.stepName === STEP_NAMES.ZkProofs)
          if (iszkProofConfigured) {
            if (!this.hasSbtMintDone) {
              this.nextStepNumeber = this.enabledSteps.indexOf(iszkProofConfigured)
            } else {
              const userConsentStep = this.enabledSteps.find((step) => step.stepName === STEP_NAMES.UserConsent)
              this.nextStepNumeber = this.enabledSteps.indexOf(userConsentStep)
            }
          } else {
            const userConsentStep = this.enabledSteps.find((step) => step.stepName === STEP_NAMES.UserConsent)
            this.nextStepNumeber = this.enabledSteps.indexOf(userConsentStep)
          }
        }
      }
    } else {
      const livelinessVerifcationStep = this.enabledSteps.find((step) => step.stepName === STEP_NAMES.LiveLiness)
      this.nextStepNumeber = this.enabledSteps.indexOf(livelinessVerifcationStep)
    }
  },
  data() {
    return {
      stepNumber: 0,
      isLoading: false,
      fullPage: true,
      toastMessage: '',
      toastType: 'success',
      isToast: false,
      nextStepNumeber: 3,
    }
  },
  methods: {
    ...mapMutations(['setCavachAccessToken', 'setRedirectUrl']),
    ...mapActions(['getNewSession', 'checkIfCredentialAlreadyExistsInVault', 'nextStep']),
    incrementStep() {
      this.stepNumber = this.stepNumber + 1
      return this.stepNumber
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
  },
}
</script>

<style scoped>
.instructions-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
  background-color: #ffffff;
}

/* Header Section */
.header-section {
  text-align: center;
  margin-bottom: 24px;
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

/* Steps Section */
.steps-section {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  margin-bottom: 24px;
}

.step-item {
  margin-bottom: 12px;
}

/* Action Section */
.action-section {
  margin-top: auto;
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
  height: 40px;
}

.btn-primary:hover {
  background-color: #333333;
}

.btn-primary:active {
  transform: translateY(1px);
}

/* Mobile Responsive */
@media (max-width: 450px) {
  .instructions-container {
    padding: 16px;
  }

  .main-title {
    font-size: 16px;
  }

  .subtitle {
    font-size: 13px;
  }

  .btn-primary {
    padding: 8px 14px;
    font-size: 13px;
    height: 36px;
  }
}
</style>
