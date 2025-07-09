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

      <div class="mb-2 text-left">
        <a href="#" @click.prevent="showSlider = true" style="text-decoration: none"><InfoMessage :message="`${warningMessage} Click me to know more about data vault`" /></a>
        <BottomupSliderPopup :modelValue="showSlider" :introSlides="introSlides" @update:modelValue="closeSliderPopup" />
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
import { UserInstructions } from '../../config'
import BottomupSliderPopup from './BottomupSliderPopup.vue'
// import BottomupSlider from './BottomupSlider.vue'
export default {
  name: 'VaultPin',
  components: {
    PIN,
    BottomupSliderPopup,
    // BottomupSlider,
  },
  data() {
    return {
      confirmationDialog: false,
      errorDialog: false,
      pin: '',
      reEnterPin: '',
      warningMessage: `This PIN is to secure your data vault. This ensures that you do not trust any one with your data, not even us. The PIN is used to access your encrypted data vault.`,
      errorMessage: '',
      showSlider: false,
      introSlides: UserInstructions.DataVault,
    }
  },
  methods: {
    ...mapMutations(['nextStep', 'setVaultPin']),
    closeSliderPopup(value) {
      this.showSlider = value
    },
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
