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

        <div class="row mb-4" v-if="checkIfLivelinessIsEnabled == true">
          <div class="col">
            <AppInstructionStep stepNumber="1" stepTitle="Conduct liveliness check to prove you are a human"
              :isDone="hasLivelinessDone" />
          </div>
        </div>

        <div class="row mb-4" v-if="checkIfIdDocumentIsEnabled == true">
          <div class="col">
            <AppInstructionStep stepNumber="2" stepTitle="Submit your ID document to recieve your KYC credentials"
              :isDone="hasKycDone" />
          </div>
        </div>

        <div class="row mb-4" v-if="checkIfOncainIdIsEnabled == true">
          <div class="col">
            <AppInstructionStep stepNumber="3" stepTitle="Mint your on-chain Identity in your favorite blockchain"
              :isDone="hasSbtMintDone" />
          </div>
        </div>

        <div class="row mb-4" v-if="checkIfUserConsentIsEnabled == true">
          <div class="col">
            <AppInstructionStep :stepNumber="checkIfOncainIdIsEnabled ? '4' : '3'"
              stepTitle="Generate proofs and provide consent of your data to be shared with the verifier app"
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
    <MessageBox :msg="toastMessage" :type="toastType" v-if="isToast" />
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
      return this.steps.find(x => x.stepName === STEP_NAMES.OnChainId).isEnabled
    },
    checkIfIdDocumentIsEnabled() {
      return this.steps.find(x => x.stepName === STEP_NAMES.IdDocs).isEnabled
    },
    checkIfUserConsentIsEnabled() {
      return this.steps.find(x => x.stepName === STEP_NAMES.UserConsent).isEnabled
    },
    checkIfLivelinessIsEnabled() {
      return this.steps.find(x => x.stepName === STEP_NAMES.LiveLiness).isEnabled
    }
  },
  async created() {
    await this.checkIfCredentialAlreadyExistsInVault()

    if (this.hasLivelinessDone) {
      // next step: id verfcaiton
      if (this.hasKycDone) {
        // next step: check if on chain id is configured or not
        const isOnChainIdConfigured = this.steps.find(step => (step.stepName == STEP_NAMES.OnChainId && step.isEnabled == true))
        console.log({ isOnChainIdConfigured })
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
          const isOnChainIdConfigured = this.steps.find(step => (step.stepName == STEP_NAMES.OnChainId && step.isEnabled == true))
          if (isOnChainIdConfigured) {
            // if yes, then go to onchainId page
            this.nextStepNumeber = isOnChainIdConfigured.id
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
    ...mapActions(["getNewSession", "registerUser", "checkIfCredentialAlreadyExistsInVault"]),
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
      }, 2000);
    },
  },
};
</script>
