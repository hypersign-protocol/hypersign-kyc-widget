<template>
  <div>
    <v-card class="widget-card">
      <div class="" style="text-align: left">
        <span>Enter 5 digits PIN:</span>
        <PIN @pinTakenEvent="getPin" inputType="password" />
      </div>

      <div class="" style="text-align: left">
        <span>Confirm PIN:</span>
        <PIN @pinTakenEvent="getRenterPin" inputType="password" />
      </div>

      <div class="mb-1">
        <InfoMessage :message="warningMessage" />
      </div>
    </v-card>
    <div class="container">
      <div class="row center mt-3">
        <v-btn class="btn btn-outline-dark width" @click="submit()"><i class="bi bi-safe"></i> Unlock Vault</v-btn>
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
import { mapMutations } from 'vuex'

export default {
  name: 'VaultPin',
  components: {
    PIN,
  },
  data() {
    return {
      pin: '',
      reEnterPin: '',
      warningMessage: "The PIN secures your data vault, ensuring that no one else, including us, can access your data. You own your data! The PIN is needed to access your encrypted data vault, so don't lose it.",
    }
  },
  methods: {
    ...mapMutations(['nextStep', 'setVaultPin']),
    async submit() {
      if (this.pin === this.reEnterPin) {
        if (confirm(this.warningMessage)) {
          this.setVaultPin(this.reEnterPin)
          this.$emit('proceedWithUnlockVaultAndSyncDataEvent', true)
        }
      } else {
        alert('Pins did not match')
      }
    },

    getPin(data) {
      this.pin = data
    },
    getRenterPin(data) {
      this.reEnterPin = data
    },
  },
}
</script>

<style scoped></style>
