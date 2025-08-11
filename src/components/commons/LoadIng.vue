<template>
  <div v-if="localActive" class="loading-overlay" :class="{ 'full-screen': isFullPage }" @click="handleCancel">
    <div class="loading-container">
      <div class="loading-spinner"></div>
      <div class="loading-text">Please wait...</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadIng',
  props: {
    active: {
      type: Boolean,
      required: true,
    },
    canCancel: {
      type: Boolean,
      default: false,
    },
    isFullPage: {
      type: Boolean,
      default: true,
    },
    zIndex: {
      type: Number,
      default: 9999,
    },
  },
  computed: {
    localActive: {
      get() {
        return this.active
      },
      set(val) {
        this.$emit('update:active', val)
      },
    },
  },
  methods: {
    handleCancel() {
      if (this.canCancel) {
        this.localActive = false
      }
    },
  },
}
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-container {
  background: #ffffff;
  border-radius: 8px;
  padding: 8px 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  max-width: 140px;
  width: auto;
  text-align: center;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #000000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  color: #333333;
  font-size: 14px;
  font-weight: 500;
  margin: 0;
  line-height: 1.4;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Mobile-first responsive design */
@media (max-width: 450px) {
  .loading-container {
    padding: 6px 10px;
    max-width: 120px;
    gap: 5px;
  }

  .loading-spinner {
    width: 20px;
    height: 20px;
    border-width: 2px;
  }

  .loading-text {
    font-size: 13px;
  }
}

@media (min-width: 451px) {
  .loading-container {
    padding: 10px 16px;
    max-width: 160px;
    gap: 8px;
  }

  .loading-spinner {
    width: 36px;
    height: 36px;
    border-width: 3px;
  }

  .loading-text {
    font-size: 15px;
  }
}
</style>
