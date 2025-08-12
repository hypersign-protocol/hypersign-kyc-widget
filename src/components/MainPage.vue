<template>
  <div>
    <template>
      <v-card class="maincontainer d-flex flex-column main-page-container">
        <NavBar v-if="currentStep?.name && currentStep?.isEnabled" />
        <div class="flex-grow-1 main-content">
          <component :is="currentStepComponent" />
        </div>

        <MessageBox :msg="toastMessage" :type="toastType" :action="isToast ? 'show' : 'hide'" @close="closeToast" />

        <div class="footer_main_page">
          <PoweredBy />
        </div>
      </v-card>
    </template>
  </div>
</template>

<style scoped>
.main-page-container {
  background-color: #ffffff;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.main-content {
  padding: 20px 0;
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.main-container-height {
  height: 100vh;
  max-height: 100vh;
  background-color: #ffffff;
}

@media (max-width: 450px) {
  .main-container-height {
    height: 100vh;
    background-color: #ffffff;
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
import PoweredBy from './commons/PoweredBy.vue'

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
    PoweredBy,
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
    closeToast() {
      this.isToast = false
      this.toastMessage = ''
    },
  },
}
</script>
