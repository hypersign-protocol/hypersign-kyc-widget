<template>
  <div class="ask-pin-container">
    <!-- Header Section -->
    <div class="header-section">
      <div class="back-button">
        <i class="bi bi-arrow-left"></i>
      </div>
      <h1 class="main-title">Vault Setup</h1>
      <p class="subtitle">Setup a PIN to secure your vault</p>
    </div>

    <!-- PIN Input Section -->
    <div class="pin-section">
      <label class="pin-label">Enter 5 digits PIN:</label>
      <div class="pin-input-wrapper">
        <PIN @pinTakenEvent="getPin" inputType="password" />
      </div>
    </div>

    <!-- Information Box -->
    <div class="info-box">
      <div class="info-content">
        <p class="info-text">The PIN secures your data vault, ensuring that no one else, including us, can access your data. You own your data! The PIN will be needed to access your encrypted data vault, so kindly keep it safe.</p>
        <a href="#" @click.prevent="showSlider = true" class="learn-more-link">Learn more about data vault</a>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="action-section">
      <button class="btn btn-primary" @click="submit()">
        <i class="bi bi-unlock-fill"></i>
        Unlock Vault
      </button>
      <!-- <button class="btn btn-secondary" @click="submit()">
        <i class="bi bi-shield-lock-fill"></i>
        Setup Vault
      </button> -->
    </div>

    <!-- Forgot Password Link -->
    <div class="forgot-section">
      <ForgotPIN @proceedWithAccountDeletion="proceedWithAccountDeletion()" />
    </div>

    <!-- Information Popup -->
    <BottomupSliderPopup :modelValue="showSlider" :introSlides="introSlides" @update:modelValue="closeSliderPopup" />
  </div>
</template>

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

<style scoped>
.ask-pin-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #ffffff;
  padding-bottom: 40px;
}

/* Header Section */
.header-section {
  text-align: center;
  margin-bottom: 24px;
  position: relative;
  padding: 0 16px;
}

.back-button {
  position: absolute;
  left: 16px;
  top: 0;
  font-size: 18px;
  color: #666666;
  cursor: pointer;
  padding: 8px;
}

.main-title {
  font-size: 20px;
  font-weight: 600;
  color: #000000;
  margin: 0 0 8px 0;
}

.subtitle {
  font-size: 14px;
  color: #666666;
  margin: 0;
}

/* PIN Input Section */
.pin-section {
  margin-bottom: 20px;
  padding: 0 16px;
}

.pin-label {
  display: block;
  font-size: 14px;
  font-weight: 400;
  color: #666666;
  margin-bottom: 12px;
  text-align: left;
}

.pin-input-wrapper {
  width: 100%;
}

/* Information Box */
.info-box {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  margin-left: 16px;
  margin-right: 16px;
  box-sizing: border-box;
  max-width: calc(100% - 32px);
  overflow: hidden;
}

.info-content {
  text-align: left;
  width: 100%;
  overflow-wrap: break-word;
  word-wrap: break-word;
}

.info-text {
  font-size: 13px;
  line-height: 1.5;
  color: #666666;
  margin: 0 0 10px 0;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
}

.learn-more-link {
  color: #333333;
  text-decoration: underline;
  font-size: 13px;
  font-weight: 400;
}

.learn-more-link:hover {
  color: #000000;
}

/* Action Buttons */
.action-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
  margin-top: auto;
  padding: 0 16px;
}

.btn {
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  width: 100%;
  height: 40px;
}

.btn-primary {
  background-color: #000000;
  color: #ffffff;
}

.btn-primary:hover {
  background-color: #333333;
}

.btn-secondary {
  background-color: #ffffff;
  color: #000000;
  border: 1px solid #000000;
}

.btn-secondary:hover {
  background-color: #f5f5f5;
}

/* Forgot Password Section */
.forgot-section {
  text-align: center;
  margin-top: 8px;
  padding: 0 16px;
}

/* Mobile Responsive */
@media (max-width: 375px) {
  .ask-pin-container {
    padding-bottom: 40px;
  }

  .header-section {
    padding: 0 12px;
  }

  .back-button {
    left: 12px;
  }

  .main-title {
    font-size: 18px;
  }

  .subtitle {
    font-size: 13px;
  }

  .btn {
    padding: 8px 14px;
    font-size: 13px;
    height: 36px;
  }

  .pin-section {
    margin-bottom: 16px;
    padding: 0 12px;
  }

  .info-box {
    margin-bottom: 16px;
    padding: 14px;
    margin-left: 12px;
    margin-right: 12px;
  }

  .action-section {
    margin-bottom: 12px;
    gap: 8px;
    padding: 0 12px;
  }

  .forgot-section {
    margin-top: 6px;
    padding: 0 12px;
  }
}

@media (min-width: 376px) {
  .ask-pin-container {
    padding-bottom: 40px;
  }

  .header-section {
    padding: 0 20px;
  }

  .back-button {
    left: 20px;
  }

  .main-title {
    font-size: 22px;
  }

  .pin-section {
    padding: 0 20px;
  }

  .info-box {
    margin-left: 20px;
    margin-right: 20px;
  }

  .action-section {
    padding: 0 20px;
  }

  .forgot-section {
    padding: 0 20px;
  }
}
</style>
