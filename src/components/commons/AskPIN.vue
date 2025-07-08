<template>
  <div>
    <v-card class="widget-card hypersign-box">
      <!-- <BottomupSlider :mainTitle="'Understand Your Vault'" :slides="introSlides" /> -->
      <div class="" style="text-align: left">
        <div>Enter 5 digits PIN:</div>
        <PIN @pinTakenEvent="getPin" inputType="password" />
      </div>
    </v-card>
    <div class="text-left mt-2">
      <!-- <p>This PIN is to secure your data valut, <a href="#" @click.prevent="showSlider = true">Read More</a></p> -->
      <a href="#" @click.prevent="showSlider = true" style="text-decoration: none"><InfoMessage message="This PIN is to secure your data vault. This ensures that you do not trust any one with your data, not even us. The PIN is used to access your encrypted data vault. Click me to know more about data vault." /></a>
      <v-dialog v-model="showSlider" max-width="600">
        <v-card>
          <BottomupSlider :mainTitle="'Understand Your Vault'" :slides="introSlides" />
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="showSlider = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
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
import BottomupSlider from './BottomupSlider.vue'
import ForgotPIN from './ForgotPIN.vue'
import { mapMutations } from 'vuex'

export default {
  name: 'VaultPin',
  components: {
    PIN,
    ForgotPIN,
    BottomupSlider,
  },
  data() {
    return {
      pin: '',
      reEnterPin: '',
      showSlider: false,
      introSlides: [
        {
          title: 'What is a Data Vault?',
          description: 'Your data vault is an encrypted storage that only you can access. It keeps your sensitive identity information safe and under your control.',
          icon: 'bi bi-shield-lock-fill',
        },
        {
          title: 'Why You Need a PIN',
          description: 'Your PIN is the only key to unlock your data vault. We don’t know or store it. Without your PIN, access to your vault is lost permanently.',
          icon: 'bi bi-key-fill',
        },
        {
          title: 'You Own Your Data',
          description: 'This system is non-custodial. We don’t store or manage your data. Only you can choose to share it, verify it, or delete it.',
          icon: 'bi bi-person-lock',
        },
        {
          title: 'Reusable Identity',
          description: 'Credentials issued to you are securely stored in your vault. Next time, you can reuse them without going through the full verification again—saving time and effort.',
          icon: 'bi bi-arrow-repeat',
        },
      ],
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
