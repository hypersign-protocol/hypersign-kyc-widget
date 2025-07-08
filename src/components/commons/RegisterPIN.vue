<template>
  <div>
    <v-card class="widget-card hypersign-box">
      <div class="" style="text-align: left">
        <span>Enter 5 digits PIN:</span>
        <PIN @pinTakenEvent="getPin" inputType="password" />
      </div>

      <div class="" style="text-align: left">
        <span>Confirm PIN:</span>
        <PIN @pinTakenEvent="getRenterPin" inputType="number" />
      </div>

      <div class="mb-1">
        <InfoMessage :message="warningMessage" />
      </div>
    </v-card>
    <div class="container">
      <div class="row center mt-3">
        <v-btn block color="secondary" @click="submit()"><i class="bi bi-safe mx-1"></i> Setup Vault</v-btn>
      </div>
    </div>
    <v-row justify="center">
      <v-dialog v-model="confirmationDialog" max-width="300">
        <v-card>
          <v-card-title class="text-h6"> Setup Vault Confirmation! </v-card-title>
          <v-card-text>{{ warningMessage }}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="confirmationDialog = false">Cancel</v-btn>
            <v-btn color="green darken-1" text @click="proceedWithSettingVault()">OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row justify="center">
      <v-dialog v-model="errorDialog" max-width="300">
        <v-card>
          <v-card-title class="text-h6"> Error! </v-card-title>
          <v-card-text>{{ errorMessage }}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <!-- <v-btn color="red darken-1" text @click="errorDialog = false">Disagree</v-btn> -->
            <v-btn color="green darken-1" text @click="errorDialog = false">OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<style scoped>
.width {
  width: 70%;
}

@media (max-width: 450px) {
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
      confirmationDialog: false,
      errorDialog: false,
      pin: '',
      reEnterPin: '',
      warningMessage: `The PIN secures your data vault, ensuring that no one else, including us, can access your data. You own your data! 
      The PIN will be needed to access your encrypted data vault, so kindly keep it safe.`,
      errorMessage: '',
    }
  },
  methods: {
    ...mapMutations(['nextStep', 'setVaultPin']),
    async submit() {
      if (this.pin === this.reEnterPin) {
        this.confirmationDialog = true
      } else {
        this.errorDialog = true
        this.errorMessage = 'PINs did not match, please re-enter your PINs'
      }
    },
    async proceedWithSettingVault() {
      this.setVaultPin(this.reEnterPin)
      this.$emit('proceedWithUnlockVaultAndSyncDataEvent', true)
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
