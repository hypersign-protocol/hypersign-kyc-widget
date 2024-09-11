<style type="text/css" scoped>
.toast1 {
  bottom: 16px;
  width: 100%;
  height: 100%;
  border-radius: 2px;
  z-index: 99999;
  text-align: left;
  padding-left: 5px;
  padding-right: 5px;
  font-size: small;
  color: black;
  word-wrap: break-word;
}
</style>

<template>
  <div class="toast1" :style="{ 'background-color': toastColor }">
    {{ shortenMesssage }}
  </div>
</template>

<script>
export default {
  props: {
    msg: String,
    type: {
      String,
      default: "success",
    },
  },
  computed: {
    shortenMesssage() {
      return this.msg; //this.msg.length > 40 ? this.msg.substr(0, 40) + '...' : this.msg;
    },
    toastColor() {
      if (this.type == 'error') {
        return 'rgba(253, 170, 170, 0.972)'
      } if (this.type == 'warning') {
        return '#ffcc00'
      } else {
        return 'rgb(184, 230, 184)'
      }
    }
  },
  data() {
    return {};
  },
};
</script>
