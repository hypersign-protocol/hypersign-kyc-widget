<template>
  <div class="forgot-pin-container">
    <button class="forgot-link" @click="deleteAccountConfirmation()">Forgot PIN?</button>

    <!-- Confirmation Dialog -->
    <div v-if="confirmationDialog" class="dialog-overlay">
      <div class="dialog">
        <h3 class="dialog-title">Account Reset Required!</h3>
        <p class="dialog-text">{{ lostPinMessage }}</p>
        <div class="dialog-actions">
          <button class="btn btn-secondary" @click="confirmationDialog = false">Disagree</button>
          <button class="btn btn-primary" @click="proceedWithResetting()">AGREE</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ForgotPin',
  data() {
    return {
      confirmationDialog: false,
      lostPinMessage: `It looks like you forgot your PIN. Since this is a non-custodial data vault, we can not recover your account or data for security reasons. The only option is to reset your account, which means we will delete all your old encrypted data and require you to re-verify your identity. Are you sure you want to proceed with the account reset?`,
    }
  },
  methods: {
    async deleteAccountConfirmation() {
      this.confirmationDialog = true
    },
    proceedWithResetting() {
      this.$emit('proceedWithAccountDeletion', true)
    },
  },
}
</script>

<style scoped>
.forgot-pin-container {
  text-align: center;
}

.forgot-link {
  background: none;
  border: none;
  color: #333333;
  text-decoration: underline;
  font-size: 14px;
  cursor: pointer;
  padding: 8px;
  transition: color 0.2s ease;
}

.forgot-link:hover {
  color: #000000;
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

.btn {
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
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

/* Mobile Responsive */
@media (max-width: 375px) {
  .dialog {
    padding: 20px;
  }

  .forgot-link {
    font-size: 13px;
  }
}
</style>
