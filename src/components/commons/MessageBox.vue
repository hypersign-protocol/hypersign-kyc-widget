<style scoped>
.toast1 {
  position: fixed;
  bottom: 5%;
  left: 50%;
  transform: translateX(-50%);
  min-width: 70%;
  max-width: 90%;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  color: #000;
  word-wrap: break-word;
  text-align: center;
  z-index: 9999;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  opacity: 0;
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
  pointer-events: none;
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
        return 'rgba(253, 170, 170, 0.972)'
      }
      if (this.type === 'warning') {
        return '#ffcc00'
      } else {
        return 'rgb(184, 230, 184)'
      }
    },
  },
  data() {
    return {}
  },
}
</script>
