<template>
  <div>
    <v-card class="widget-card hypersign-box">
      <!-- <BottomupSlider :mainTitle="'Understand Your Vault'" :slides="introSlides" /> -->
      <div class="" style="text-align: left">
        <div>Enter 5 digits PIN:</div>
        <PIN @pinTakenEvent="getPin" inputType="password" />
      </div>
      <div class="text-left mt-2">
        <!-- <p>This PIN is to secure your data valut, <a href="#" @click.prevent="showSlider = true">Read More</a></p> -->
        <a href="#" @click.prevent="showSlider = true" style="text-decoration: none"><InfoMessage message="This PIN is to secure your data vault. This ensures that you do not trust any one with your data, not even us. The PIN is used to access your encrypted data vault. Click me to know more about data vault." /></a>
        <BottomupSliderPopup :modelValue="showSlider" :introSlides="introSlides" @update:modelValue="closeSliderPopup" />
      </div>
    </v-card>
    <div class="container">
      <div class="row center mt-3">
        <v-btn block color="secondary" @click="submit()"><i class="bi bi-unlock mx-1"></i> Unlock Vault</v-btn>
      </div>
      <div class="row">
        <ForgotPIN @proceedWithAccountDeletion="proceedWithAccountDeletion()" style="width: 100%" class="mt-1" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.width {
  width: 90%;
}

@media (max-width: 450px) {
  .width {
    width: 100%;
  }
}
</style>

<script type="text/javascript">
import PIN from '../commons/PIN.vue'
import BottomupSliderPopup from './BottomupSliderPopup.vue'
import ForgotPIN from './ForgotPIN.vue'
import { mapMutations } from 'vuex'
import { UserInstructions } from '../../config'
import { EVENT, EVENTS } from '../utils/eventBus'
import MESSAGE from '../utils/lang/en'

export default {
  name: 'VaultPin',
  components: {
    PIN,
    ForgotPIN,
    BottomupSliderPopup,
  },
  data() {
    return {
      pin: '',
      reEnterPin: '',
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
      if (!this.pin) {
        this.toast(MESSAGE.VAULT.NO_PIN_ENTERED, 'warning')
        return
      }
      this.setVaultPin(this.pin)
      this.$emit('proceedWithUnlockVaultAndSyncDataEvent', true)
    },
    toast(msg, type = 'success') {
      EVENT.emitEvent(
        EVENTS.NOTIFY,
        JSON.stringify({
          toastMessage: msg,
          toastType: type,
        })
      )
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
