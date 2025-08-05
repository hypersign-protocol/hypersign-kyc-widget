<template>
  <div class="failure-container">
    <!-- Error Icon -->
    <div class="error-icon">
      <i class="bi bi-x-circle"></i>
    </div>

    <!-- Error Message -->
    <div class="error-message">
      {{ message }}
    </div>

    <!-- Instructions -->
    <div class="instructions">Please click the button below to retry from the verifier app.</div>

    <!-- Action Button -->
    <div class="action-section">
      <button class="btn-primary" @click="onAction">
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FailureScreen',
  props: {
    message: {
      type: String,
      default: 'An error occurred',
    },
    buttonText: {
      type: String,
      default: 'Try Again',
    },
    onAction: {
      type: Function,
      required: true,
    },
  },
}
</script>

<style scoped>
.failure-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 40px 20px;
  text-align: center;
}

.error-icon {
  margin-bottom: 24px;
}

.error-icon i {
  font-size: 64px;
  color: #dc3545;
}

.error-message {
  font-size: 16px;
  font-weight: 500;
  color: #dc3545;
  margin-bottom: 16px;
  line-height: 1.4;
}

.instructions {
  font-size: 14px;
  color: #666666;
  margin-bottom: 32px;
  line-height: 1.4;
}

.action-section {
  width: 100%;
  max-width: 300px;
}

.btn-primary {
  width: 100%;
  padding: 10px 16px;
  background-color: #000000;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
}

.btn-primary:hover {
  background-color: #333333;
}

.btn-primary:active {
  transform: translateY(1px);
}

/* Mobile Responsive */
@media (max-width: 450px) {
  .failure-container {
    padding: 32px 16px;
  }

  .error-icon i {
    font-size: 56px;
  }

  .error-message {
    font-size: 15px;
  }

  .instructions {
    font-size: 13px;
  }

  .btn-primary {
    padding: 8px 14px;
    font-size: 13px;
    height: 36px;
  }
}
</style>
