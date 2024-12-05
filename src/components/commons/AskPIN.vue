<template>
  <div>
    <v-card class="widget-card">
      <div class="" style="text-align: left">
        <div>Enter 5 digits PIN:</div>
        <PIN @pinTakenEvent="getPin" inputType="password" />
      </div>
      <div class="" style="text-align: left">
        <InfoMessage message="This PIN is to secure your data vault. This ensures that you do not trust any one with your data, not even us. The PIN is used to access your encrypted data vault. Make sure you do not loose it." />
      </div>
    </v-card>
    <div class="container">
      <div class="row center mt-3">
        <v-btn class="btn btn-outline-dark width" @click="submit()"><i class="bi bi-unlock"></i> Unlock Vault</v-btn>
      </div>
      <div class="row center mt-3">
        <ForgotPIN @proceedWithAccountDeletion="proceedWithAccountDeletion()" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.width {
  width: 70%;
}

@media (max-width: 768px) {
  .width {
    width: 100%;
  }
}
</style>

<script type="text/javascript">
import PIN from '../commons/PIN.vue'
import ForgotPIN from './ForgotPIN.vue'
import { mapMutations } from 'vuex'

export default {
  name: 'VaultPin',
  components: {
    PIN,
    ForgotPIN,
  },
  data() {
    return {
      pin: '',
      reEnterPin: '',
    }
  },
  methods: {
    ...mapMutations(['nextStep', 'setVaultPin']),
    async submit() {
      if (!this.pin) {
        return
      }
      this.setVaultPin(this.pin)
      this.$emit('proceedWithUnlockVaultAndSyncDataEvent', true)
    },
    proceedWithAccountDeletion() {
      localStorage.setItem('forgotPassword', true)
      this.$emit('proceedWithAccountDeletionFinal', true)
    },
    getPin(data) {
      this.pin = data
      this.setVaultPin(this.pin)
    },
  },
}
</script>

<style scoped></style>
