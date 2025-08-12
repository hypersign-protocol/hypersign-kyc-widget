<template>
  <div class="step-container" :class="{ completed: isDone }">
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
  padding: 8px 14px;
  background-color: transparent;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  margin-bottom: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  cursor: pointer;
}

.step-container:hover {
  background-color: #f5f5f5;
  border-color: #d0d0d0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.step-container:last-child {
  margin-bottom: 0;
}

.step-icon {
  width: 24px;
  height: 24px;
  border-radius: 0;
  background-color: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.step-container:hover .step-icon {
  background-color: #f0f0f0;
}

.icon-image {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.step-content {
  flex: 1;
  min-width: 0;
}

.step-title {
  font-size: 13px;
  font-weight: 500;
  color: #424242;
  line-height: 1.3;
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
  color: #4caf50;
}

.status-pending {
  color: #9e9e9e;
}

.step-container.completed {
  background-color: #f8fff8;
  border-color: #c8e6c9;
}

.step-container.completed:hover {
  background-color: #f1f8f1;
  border-color: #a5d6a7;
}

.step-container.completed .step-icon {
  background-color: #e8f5e8;
}

.step-container.completed .step-title {
  color: #2e7d32;
  font-weight: 600;
}

/* Mobile Responsive */
@media (max-width: 450px) {
  .step-container {
    padding: 6px 12px;
    margin-bottom: 4px;
  }

  .step-icon {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }

  .icon-image {
    width: 14px;
    height: 14px;
  }

  .step-title {
    font-size: 12px;
  }

  .status-icon i {
    font-size: 14px;
  }
}
</style>
