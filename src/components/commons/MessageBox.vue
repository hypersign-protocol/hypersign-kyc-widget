<template>
  <div v-if="show" class="custom-notification" :class="notificationType">
    <div class="notification-content">
      <v-icon :color="iconColor" class="mr-2" size="18">
        {{ iconName }}
      </v-icon>
      <span class="notification-text">{{ msg }}</span>
      <v-btn :color="iconColor" text @click="closeSnackbar" class="ml-2 close-btn">
        <v-icon size="14">mdi-close</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    msg: String,
    action: {
      String,
      default: 'hide',
    },
    type: {
      String,
      default: 'success',
    },
  },
  computed: {
    show() {
      return this.action === 'show'
    },
    notificationType() {
      return `notification-${this.type}`
    },
    iconName() {
      if (this.type === 'error') {
        return 'mdi-alert-circle'
      }
      if (this.type === 'warning') {
        return 'mdi-alert'
      } else {
        return 'mdi-check-circle'
      }
    },
    iconColor() {
      if (this.type === 'error') {
        return '#dc2626'
      }
      if (this.type === 'warning') {
        return '#d97706'
      } else {
        return '#16a34a'
      }
    },
  },
  methods: {
    closeSnackbar() {
      this.$emit('close')
    },
  },
  mounted() {
    if (this.show) {
      setTimeout(() => {
        this.$emit('close')
      }, 5000)
    }
  },
  watch: {
    show(newVal) {
      if (newVal) {
        setTimeout(() => {
          this.$emit('close')
        }, 5000)
      }
    },
  },
}
</script>

<style scoped>
.custom-notification {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  min-width: 300px;
  max-width: 400px;
  padding: 8px 12px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  z-index: 9999;
  animation: slideIn 0.3s ease-out;
}

.notification-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.notification-text {
  flex: 1;
  color: #666666;
  font-size: 13px;
  font-weight: 500;
  margin: 0 8px;
  line-height: 1.4;
}

.close-btn {
  min-width: 24px !important;
  height: 24px !important;
  padding: 0 !important;
}

/* Type-specific styles */
.notification-success {
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
}

.notification-warning {
  background-color: #fffbeb;
  border: 1px solid #fed7aa;
}

.notification-error {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
}

/* Animation */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* Mobile responsiveness */
@media (max-width: 480px) {
  .custom-notification {
    bottom: 16px;
    left: 16px;
    right: 16px;
    transform: none;
    min-width: auto;
    max-width: none;
    padding: 6px 10px;
  }

  .notification-content {
    padding: 0 2px;
  }

  .notification-text {
    font-size: 12px;
    margin: 0 6px;
  }
}
</style>
