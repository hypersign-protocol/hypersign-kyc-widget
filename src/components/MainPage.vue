<template>
  <div>
    <template>
      <!-- eslint-disable -->
      <v-card class="maincontainer main-container-height">
        <NavBar v-if="currentStep && currentStep.name && currentStep.isEnabled == true" />
        <component :is="currentStepComponent"></component>
        <div class="footer">
          <MessageBox :msg="toastMessage" :type="toastType" :action="isToast ? 'show' : 'hide'" />
        </div>
      </v-card>
    </template>
  </div>
</template>

<style scoped>
.main-container-height {
  min-height: 90dvh;
  max-height: 100dvh;
}

@media (max-width: 450px) {
  .main-container-height {
    height: 100dvh;
  }
}
</style>

<script>
import AppInstructions from './AppInstructions.vue'
import LiveLiness3 from './e-kyc/Liveliness.vue'
import IdDocs4 from './e-kyc/IdentityDocuments.vue'
import FinalResult from './e-kyc/Result.vue'
import SignIn from './e-kyc/SignIn.vue'
import VaultPIN from './e-kyc/VaultPIN.vue'
import UserConsent from './e-kyc/UserConsent.vue'
import ZkProofs from './e-kyc/ZKProofs.vue'
import SessionExpired from './SessionExpired.vue'
import { EVENT, EVENTS } from './utils/eventBus'
import { mapGetters } from 'vuex'
export default {
  name: 'HelloWorld',
  components: {
    AppInstructions,
    LiveLiness3,
    IdDocs4,
    ZkProofs,
    FinalResult,
    SignIn,
    VaultPIN,
    UserConsent,
    SessionExpired,
  },
  computed: {
    ...mapGetters(['currentStep']),
    currentStepComponent() {
      const stepComponents = {
        AppInstructions,
        LiveLiness3,
        IdDocs4,
        ZkProofs,
        FinalResult,
        SignIn,
        VaultPIN,
        UserConsent,
        SessionExpired,
      }
      return stepComponents[this.currentStep?.stepName]
    },
  },
  created() {
    EVENT.subscribeEvent(EVENTS.NOTIFY, this.onNotification)
  },
  data() {
    return {
      toastMessage: '',
      toastType: 'success',
      isToast: false,
    }
  },
  methods: {
    onNotification(event) {
      event = JSON.parse(event)
      this.isToast = true
      this.toastMessage = event.toastMessage
      this.toastType = event.toastType
      setTimeout(() => {
        this.isToast = false
        this.toastMessage = ''
      }, 5000)
    },
  },
}
</script>
