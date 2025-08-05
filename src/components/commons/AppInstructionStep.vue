<template>
  <div class="step-container">
    <!-- Step Icon -->
    <div class="step-icon">
      <img :src="logoUrl" alt="Step Icon" class="icon-image" />
    </div>

    <!-- Step Content -->
    <div class="step-content">
      <div class="step-title">{{ stepTitle }}</div>
    </div>

    <!-- Status Icon -->
    <div class="status-icon">
      <i v-if="isDone" class="bi bi-check-circle-fill status-done"></i>
      <i v-else class="bi bi-circle status-pending"></i>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    stepTitle: {
      type: String,
      default: 'Conduct a liveliness check to prove you are a human',
    },
    isDone: {
      type: Boolean,
      default: false,
    },
    logo: {
      type: String,
      default: 'consent.png',
    },
  },
  computed: {
    logoUrl() {
      return require('@/assets/' + this.logo)
    },
  },
}
</script>

<style scoped>
.step-container {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  margin-bottom: 8px;
  box-shadow: none;
}

.step-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
}

.icon-image {
  width: 18px;
  height: 18px;
  object-fit: contain;
}

.step-content {
  flex: 1;
  min-width: 0;
}

.step-title {
  font-size: 13px;
  font-weight: 400;
  color: #666666;
  line-height: 1.4;
  text-align: left;
}

.status-icon {
  margin-left: 12px;
  flex-shrink: 0;
}

.status-icon i {
  font-size: 16px;
}

.status-done {
  color: #28a745;
}

.status-pending {
  color: #dee2e6;
}

/* Mobile Responsive */
@media (max-width: 450px) {
  .step-container {
    padding: 10px 12px;
  }

  .step-icon {
    width: 28px;
    height: 28px;
    margin-right: 10px;
  }

  .icon-image {
    width: 16px;
    height: 16px;
  }

  .step-title {
    font-size: 12px;
  }

  .status-icon i {
    font-size: 14px;
  }
}
</style>
