<style scoped>
.checkbox-container {
  display: flex;
  flex-direction: column;
}

.checkbox-item {
  margin-top: 30px;
  margin-bottom: 35px;
  display: flex;
  align-items: center;
}

.checkbox-item-input {
  width: 2.5em;
  height: 2.5em;
}

.container {
  display: flex;
}

.box {
  /* width: 200px;
  height: 100px; */
  margin: 10px;
  /* background-color: lightblue;
  border: 1px solid #ccc; */
  box-sizing: border-box;
  padding: 20px;
}

.checkbox-item input {
  margin-right: 5px;
}

.widget-card-width {
  width: 70%;
  margin: auto;
}

@media (max-width: 768px) {
  .widget-card-width {
    margin: auto;
    width: 100%;
  }
}
</style>

<template>
  <div class="kyc-container">
    <div class="card-body min-h-36">
      <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></load-ing>
      <PageHeading :header="'Hypersign KYC'" :subHeader="'Follow these simple instructions to complete your KYC request'" />

      <v-card class="widget-card widget-card-width">
        <div class="row mb-4" v-if="getIfLivelinessStep.isEnabled == true">
          <div class="col">
            <AppInstructionStep stepNumber="1" :stepTitle="getIfLivelinessStep.stepTitle" :isDone="hasLivelinessDone" :logo="getIfLivelinessStep.logo" />
          </div>
        </div>
        <div class="row mb-4" v-if="getIfIdDocumentStep.isEnabled == true">
          <div class="col">
            <AppInstructionStep stepNumber="2" :logo="getIfIdDocumentStep.logo" :stepTitle="getIfIdDocumentStep.stepTitle" :isDone="hasKycDone" />
          </div>
        </div>

        <div class="row mb-4" v-if="getIfzkProofStep.isEnabled == true && getIfOncainIdStep.isEnabled !== true">
          <div class="col">
            <AppInstructionStep stepNumber="3" :stepTitle="getIfzkProofStep.stepTitle" :logo="getIfzkProofStep.logo" :isDone="false" />
          </div>
        </div>

        <div class="row mb-4" v-if="getIfOncainIdStep.isEnabled == true">
          <div class="col">
            <AppInstructionStep :stepNumber="4" :logo="getIfOncainIdStep.logo" :stepTitle="getIfOncainIdStep.stepTitle" :isDone="hasSbtMintDone" />
          </div>
        </div>

        <div class="row mb-4" v-if="getIfUserConsentStep.isEnabled == true">
          <div class="col">
            <AppInstructionStep :stepNumber="getIfzkProofStep.isEnabled ? '5' : '4'" :stepTitle="getIfUserConsentStep.stepTitle" :logo="getIfUserConsentStep.logo" :isDone="false" />
          </div>
        </div>
      </v-card>

      <div class="mt-3">
        <div class="d-grid gap-1" style="margin: auto">
          <v-btn class="btn btn-outline-dark btn-lg btn-width" @click="nextStep(nextStepNumeber)">Let's go!</v-btn>
        </div>
      </div>
    </div>
    <div class="footer">
      <MessageBox :msg="toastMessage" :type="toastType" :action="isToast ? 'show' : 'hide'" />
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
    ...mapGetters(['getCavachAccessToken', 'getRedirectUrl', 'getIfOncainIdStep', 'getIfzkProofStep', 'getIfIdDocumentStep', 'getIfUserConsentStep', 'getIfLivelinessStep']),
    ...mapState(['hasLivelinessDone', 'hasKycDone', 'hasSbtMintDone', 'steps']),
  },
  async created() {
    await this.checkIfCredentialAlreadyExistsInVault()
    // TODO: this entire code block is not optimized, we MUST optimize it later.
    if (this.hasLivelinessDone) {
      // next step: id verfcaiton
      if (this.hasKycDone) {
        // next step: check if on chain id is configured or not
        const isOnChainIdConfigured = this.steps.find((step) => step.stepName === STEP_NAMES.ZkProofs && step.isEnabled === true)

        if (isOnChainIdConfigured) {
          // if yes, then go to onchainId page
          if (!this.hasSbtMintDone) {
            // if minting already done..
            this.nextStepNumeber = isOnChainIdConfigured.id
          } else {
            // go to user consent page
            const userConsentStep = this.steps.find((step) => step.stepName === STEP_NAMES.ZkProofs && step.isEnabled === true) // TODO remove
            // const userConsentStep = this.steps.find(step => (step.stepName == STEP_NAMES.UserConsent && step.isEnabled == true))
            this.nextStepNumeber = userConsentStep.id
          }
        } else {
          // go to user consent page
          const userConsentStep = this.steps.find((step) => step.stepName === STEP_NAMES.UserConsent && step.isEnabled === true)
          this.nextStepNumeber = userConsentStep.id
        }
      } else {
        const isKYCConfigured = this.steps.find((step) => step.stepName === STEP_NAMES.IdDocs && step.isEnabled === true)
        if (isKYCConfigured) {
          // next step: go to Id verifcaiton
          const isVerificationStep = this.steps.find((step) => step.stepName === STEP_NAMES.IdDocs && step.isEnabled === true)
          this.nextStepNumeber = isVerificationStep?.id
        } else {
          // next step: check if on chain id is configured or not
          const isOnChainIdConfigured = this.steps.find((step) => step.stepName === STEP_NAMES.ZkProofs && step.isEnabled === true)
          if (isOnChainIdConfigured) {
            if (!this.hasSbtMintDone) {
              // if yes, then go to onchainId page
              this.nextStepNumeber = isOnChainIdConfigured.id
            } else {
              // if yes, then go to onchainId page
              const userConsentStep = this.steps.find((step) => step.stepName === STEP_NAMES.UserConsent && step.isEnabled === true)
              this.nextStepNumeber = userConsentStep.id
            }
          } else {
            // go to user consent page
            const userConsentStep = this.steps.find((step) => step.stepName === STEP_NAMES.UserConsent && step.isEnabled === true)
            this.nextStepNumeber = userConsentStep.id
          }
        }
      }
    } else {
      // next step: go to liveliness
      const livelinessVerifcationStep = this.steps.find((step) => step.stepName === STEP_NAMES.LiveLiness && step.isEnabled === true)
      this.nextStepNumeber = livelinessVerifcationStep?.id
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
    ...mapMutations(['setCavachAccessToken', 'setRedirectUrl', 'nextStep']),
    ...mapActions(['getNewSession', 'checkIfCredentialAlreadyExistsInVault']),
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
<style lang="css">
.btn-width {
  width: 50%;
}
@media (max-width: 768px) {
  .btn-width {
    width: 100%;
  }
}
</style>
