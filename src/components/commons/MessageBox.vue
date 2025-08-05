<style scoped>
.toast1 {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  min-width: 280px;
  max-width: 320px;
  padding: 16px 20px;
  border-radius: 12px;
  font-size: 14px;
  color: #333333;
  word-wrap: break-word;
  text-align: center;
  z-index: 9999;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  opacity: 0;
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
  pointer-events: none;
  border: 1px solid #e0e0e0;
  font-weight: 500;
}

/* Mobile-first responsive design */
@media (max-width: 375px) {
  .toast1 {
    min-width: 260px;
    max-width: 300px;
    bottom: 16px;
    padding: 14px 18px;
    font-size: 13px;
  }
}

@media (min-width: 376px) {
  .toast1 {
    min-width: 300px;
    max-width: 360px;
    bottom: 24px;
    padding: 18px 22px;
    font-size: 15px;
  }
}

/* Visible state */
.toast1.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* Hidden state */
.toast1.hide {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}
</style>
<template>
  <div :class="toastAction" :style="{ 'background-color': toastColor }">
    {{ shortenMesssage }}
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
    shortenMesssage() {
      return this.msg // this.msg.length > 40 ? this.msg.substr(0, 40) + '...' : this.msg;
    },
    toastAction() {
      if (this.action === 'show') {
        return 'toast1 show'
      }
      if (this.action === 'hide') {
        return 'toast1 hide'
      } else {
        return 'toast1 hide'
      }
    },
    toastColor() {
      if (this.type === 'error') {
        return '#ffebee'
      }
      if (this.type === 'warning') {
        return '#fff3e0'
      } else {
        return '#e8f5e8'
      }
    },
  },
  data() {
    return {}
  },
}
</script>
