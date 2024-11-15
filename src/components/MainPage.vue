<template>
  <div class="mt-2">
    <template>
      <!-- eslint-disable -->
      <div class="container maincontainer parent" style="text-align: center; min-height: 83vh; max-height: 90vh">
        <NavBar />
        <component :is="getActiveStep.stepName"> </component>
      </div>
    </template>
  </div>
</template>

<script>
import AppInstructions from './AppInstructions.vue'
import LiveLiness3 from './e-kyc/Liveliness.vue'
import IdDocs4 from './e-kyc/IdentityDocuments.vue'
import FinalResult from './e-kyc/Result.vue'
import SignIn from './e-kyc/SignIn.vue'
import VaultPIN from './e-kyc/VaultPIN.vue'
import UserConsent from './e-kyc/UserConsent.vue'
import OnChainId4 from './e-kyc/OnChainId.vue'
import ZkProofs from './e-kyc/ZKProofs.vue'
import SessionExpired from './SessionExpired.vue'

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
    OnChainId4,
    SessionExpired,
  },
  computed: {
    ...mapGetters(['getActiveStep']),
  },
}
</script>
