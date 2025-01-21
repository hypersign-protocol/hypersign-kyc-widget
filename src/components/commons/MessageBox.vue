<style type="text/css" scoped>
.toast1 {
  bottom: 9%;
  width: 100%;
  height: 100%;
  border-radius: 2px 2px 2px 2px;
  z-index: 100;
  text-align: left;
  padding-left: 5px;
  padding-right: 5px;
  font-size: small;
  color: black;
  word-wrap: break-word;
  transition: opacity 0.5s ease-in-out;
  opacity: 0;
  /* position: fixed */
  left: 0;
  right: 0;
  position: absolute;
}

.toast1.show {
  opacity: 1;
}

.toast1.hide {
  opacity: 0;
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
