<template>
  <div>
    <div class="container widget-card">
      <div class="row">
        Enter 5 digits PIN:
        <PIN @pinTakenEvent="getPin" inputType="password" />
      </div>
      <div class="row">
        <InfoMessage
          message="This PIN is to secure your data vault. This ensures that you do not trust any one with your data, not even us. The PIN is used to access your encrypted data vault. Make sure you do not loose it."
        />
      </div>
    </div>
    <div class="container">
      <div class="row center mt-3">
        <button
          class="btn btn-outline-dark"
          @click="submit()"
          style="width: 50%"
        >
          <i class="bi bi-unlock"></i> Unlock Vault
        </button>
      </div>
      <div class="row center mt-3">
        <ForgotPIN @proceedWithAccountDeletion="proceedWithAccountDeletion()" />
      </div>
    </div>
  </div>
</template>

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
        console.error('Please enter your PIN')
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
