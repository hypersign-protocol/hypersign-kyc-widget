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
  padding: 20px
}

.checkbox-item input {
  margin-right: 5px;
}
</style>

<template>
  <div>
    <div class="card-body min-h-36">
      <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></load-ing>
      <PageHeading :header="'Hypersign KYC'"
        :subHeader="'Follow these simple instructions to complete your KYC request'" />

      <div class="card widget-card" style="width: 70%; margin:auto;">

        <div class="row mb-4" v-if="checkIfLivelinessIsEnabled.isEnabled == true">
          <div class="col">
            <AppInstructionStep stepNumber="1" :stepTitle="checkIfLivelinessIsEnabled.stepTitle"
              :isDone="hasLivelinessDone" :logo="checkIfLivelinessIsEnabled.logo" />
          </div>
        </div>

        <div class="row mb-4" v-if="checkIfIdDocumentIsEnabled.isEnabled == true">
          <div class="col">

            <AppInstructionStep stepNumber="2" :logo="checkIfIdDocumentIsEnabled.logo"
              :stepTitle="checkIfIdDocumentIsEnabled.stepTitle" :isDone="hasKycDone" />
          </div>
        </div>

        <!--
        <div class="row mb-4" v-if="checkIfOncainIdIsEnabled.isEnabled == true">
          <div class="col">
            <AppInstructionStep :stepNumber="3" :logo="checkIfOncainIdIsEnabled.logo"
              :stepTitle="checkIfOncainIdIsEnabled.stepTitle" :isDone="hasSbtMintDone" />
          </div>
        </div>
        -->

        <div class="row mb-4" v-if="checkIfzkProofIsEnabled.isEnabled == true">
          <div class="col">
            <AppInstructionStep stepNumber="3" :stepTitle="checkIfzkProofIsEnabled.stepTitle"
              :logo="checkIfzkProofIsEnabled.logo" :isDone="false" />
          </div>
        </div>


        <div class="row mb-4" v-if="checkIfUserConsentIsEnabled.isEnabled == true">
          <div class="col">
            <AppInstructionStep :stepNumber="checkIfzkProofIsEnabled.isEnabled ? 4 : 3"
              :stepTitle="checkIfUserConsentIsEnabled.stepTitle" :logo="checkIfUserConsentIsEnabled.logo"
              :isDone="false" />
          </div>
        </div>


        <!-- <div class="d-flex" style="">
          <div class="vr" style="height: 300px;"></div>
        </div> -->

      </div>


      <div class="mt-3">
        <!-- <img class="opacity-80" src="../assets/page0.png" style="padding: 20px; height:500px; width: 70%"
          width="100%" /> -->
        <div class="d-grid gap-1 " style="width: 50%;margin: auto;">
          <button class="btn btn-outline-dark btn-lg" @click="nextStep(nextStepNumeber)">
            Let's go!
          </button>
        </div>
      </div>
    </div>
    <div class="footer">
      <MessageBox :msg="toastMessage" :type="toastType" :action="isToast ? 'show' : 'hide'" />
    </div>
  </div>
</template>

<script type="text/javascript">
import { mapMutations, mapActions, mapGetters, mapState } from "vuex";
import AppInstructionStep from "./commons/AppInstructionStep.vue";
import { STEP_NAMES } from "@/config";
export default {
  name: "AppInstructions",
  components: {
    AppInstructionStep
  },
  computed: {
    ...mapGetters(["getCavachAccessToken", "getRedirectUrl"]),
    ...mapState(['hasLivelinessDone', 'hasKycDone', 'hasSbtMintDone', "steps"]),
    checkIfOncainIdIsEnabled() {
      return this.steps.find(x => x.stepName === STEP_NAMES.ZkProofs)
    },
    checkIfzkProofIsEnabled() {
      return this.steps.find(x => x.stepName === STEP_NAMES.ZkProofs)
    },
    checkIfIdDocumentIsEnabled() {
      return this.steps.find(x => x.stepName === STEP_NAMES.IdDocs)
    },
    checkIfUserConsentIsEnabled() {
      return this.steps.find(x => x.stepName === STEP_NAMES.UserConsent)
    },
    checkIfLivelinessIsEnabled() {
      return this.steps.find(x => x.stepName === STEP_NAMES.LiveLiness)
    }
  },
  async created() {
    await this.checkIfCredentialAlreadyExistsInVault()


    // TODO: this entire code block is not optimized, we MUST optimize it later.
    if (this.hasLivelinessDone) {
      // next step: id verfcaiton
      if (this.hasKycDone) {
        // next step: check if on chain id is configured or not
        const isOnChainIdConfigured = this.steps.find(step => (step.stepName == STEP_NAMES.ZkProofs && step.isEnabled == true))

        if (isOnChainIdConfigured) {
          // if yes, then go to onchainId page
          if (!this.hasSbtMintDone) {
            // if minting already done..
            this.nextStepNumeber = isOnChainIdConfigured.id
          } else {
            // go to user consent page
            const userConsentStep = this.steps.find(step => (step.stepName == STEP_NAMES.UserConsent && step.isEnabled == true))
            this.nextStepNumeber = userConsentStep.id
          }
        } else {
          // go to user consent page
          const userConsentStep = this.steps.find(step => (step.stepName == STEP_NAMES.UserConsent && step.isEnabled == true))
          this.nextStepNumeber = userConsentStep.id
        }
      } else {

        const isKYCConfigured = this.steps.find(step => (step.stepName == STEP_NAMES.IdDocs && step.isEnabled == true))
        if (isKYCConfigured) {
          // next step: go to Id verifcaiton
          const isVerificationStep = this.steps.find(step => (step.stepName == STEP_NAMES.IdDocs && step.isEnabled == true))
          this.nextStepNumeber = isVerificationStep?.id
        } else {
          // next step: check if on chain id is configured or not
          const isOnChainIdConfigured = this.steps.find(step => (step.stepName == STEP_NAMES.ZkProofs && step.isEnabled == true))
          if (isOnChainIdConfigured) {

            if (!this.hasSbtMintDone) {
              // if yes, then go to onchainId page
              this.nextStepNumeber = isOnChainIdConfigured.id
            } else {
              // if yes, then go to onchainId page
              const userConsentStep = this.steps.find(step => (step.stepName == STEP_NAMES.UserConsent && step.isEnabled == true))
              this.nextStepNumeber = userConsentStep.id
            }

          } else {
            // go to user consent page
            const userConsentStep = this.steps.find(step => (step.stepName == STEP_NAMES.UserConsent && step.isEnabled == true))
            this.nextStepNumeber = userConsentStep.id
          }
        }

      }
    } else {
      // next step: go to liveliness
      const livelinessVerifcationStep = this.steps.find(step => (step.stepName == STEP_NAMES.LiveLiness && step.isEnabled == true))
      this.nextStepNumeber = livelinessVerifcationStep?.id
    }

  },
  data() {
    return {
      stepNumber: 0,
      isLoading: false,
      fullPage: true,
      toastMessage: "",
      toastType: "success",
      isToast: false,
      nextStepNumeber: 3,
    };
  },
  methods: {
    ...mapMutations(["setCavachAccessToken", "setRedirectUrl", "nextStep"]),
    ...mapActions(["getNewSession", "checkIfCredentialAlreadyExistsInVault"]),
    incrementStep() {
      this.stepNumber = this.stepNumber + 1;
      return this.stepNumber
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
  },
};
</script>
