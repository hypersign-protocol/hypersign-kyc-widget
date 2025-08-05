<template>
  <div class="register-pin-container">
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

    <!-- Confirm PIN Section -->
    <div class="pin-section">
      <label class="pin-label">Confirm PIN:</label>
      <div class="pin-input-wrapper">
        <PIN @pinTakenEvent="getRenterPin" inputType="number" />
      </div>
    </div>

    <!-- Information Box -->
    <div class="info-box">
      <div class="info-content">
        <p class="info-text">This PIN is to secure your data vault. This ensures that you do not trust any one with your data, not even us. The PIN is used to access your encrypted data vault.</p>
        <a href="#" @click.prevent="showSlider = true" class="learn-more-link">Learn more about data vault</a>
      </div>
    </div>

    <!-- Action Button -->
    <div class="action-section">
      <button class="btn btn-primary" @click="submit()">
        <i class="bi bi-shield-lock-fill"></i>
        Setup Vault
      </button>
    </div>

    <!-- Information Popup -->
    <BottomupSliderPopup :modelValue="showSlider" :introSlides="introSlides" @update:modelValue="closeSliderPopup" />

    <!-- Confirmation Dialog -->
    <div v-if="confirmationDialog" class="dialog-overlay">
      <div class="dialog">
        <h3 class="dialog-title">Setup Vault Confirmation!</h3>
        <p class="dialog-text">{{ warningMessage }}</p>
        <div class="dialog-actions">
          <button class="btn btn-secondary" @click="confirmationDialog = false">Cancel</button>
          <button class="btn btn-primary" @click="proceedWithSettingVault()">OK</button>
        </div>
      </div>
    </div>

    <!-- Error Dialog -->
    <div v-if="errorDialog" class="dialog-overlay">
      <div class="dialog">
        <h3 class="dialog-title">Error!</h3>
        <p class="dialog-text">{{ errorMessage }}</p>
        <div class="dialog-actions">
          <button class="btn btn-primary" @click="errorDialog = false">OK</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import PIN from '../commons/PIN.vue'
import { mapMutations } from 'vuex'
import { UserInstructions } from '../../config'
import BottomupSliderPopup from './BottomupSliderPopup.vue'

export default {
  name: 'VaultPin',
  components: {
    PIN,
    BottomupSliderPopup,
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

<style scoped>
.register-pin-container {
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

/* Action Button */
.action-section {
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

/* Dialog Styles */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 24px;
  max-width: 320px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.dialog-title {
  font-size: 18px;
  font-weight: 600;
  color: #000000;
  margin: 0 0 16px 0;
}

.dialog-text {
  font-size: 14px;
  line-height: 1.5;
  color: #333333;
  margin: 0 0 24px 0;
}

.dialog-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.dialog-actions .btn {
  width: auto;
  padding: 12px 20px;
  font-size: 14px;
}

/* Mobile Responsive */
@media (max-width: 375px) {
  .register-pin-container {
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

  .dialog {
    padding: 20px;
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
    padding: 0 12px;
  }
}

@media (min-width: 376px) {
  .register-pin-container {
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
}
</style>
