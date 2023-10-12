<style type="text/css" scoped>
/* .error {
  background-color: rgba(255, 0, 0, 0.275);
  color: white;
}

.success {
  background-color: green;
  color: white;
} */

.toast {
  background-color: green;
  bottom: 0;
  width: 100%;
  height: 30px;
  border-radius: 2px;
  z-index: 99999;
  text-align: left;
  padding-left: 5px;
  padding-right: 5px;
  font-size: small;
}
</style>

<template>
  <!-- <div
    class="toast"
    :class="{
      error: type === 'error',
      success: type === 'success',
    }"
    v-show="isShow"
  >
    Mesage: {{ msg }}
  </div> -->

  <!-- doing in a bad way for the time being -->
  <div
    style="
      background-color: rgba(253, 170, 170, 0.972);
      bottom: 0;
      width: 100%;
      height: 20px;
      border-radius: 2px;
      z-index: 99999;
      text-align: left;
      padding-left: 5px;
      padding-right: 5px;
      font-size: small;
      color: darkslategrey;
    "
    v-if="type === 'error'"
  >
    {{ shortenMesssage }}
  </div>

  <div
    style="
      background-color: rgb(184, 230, 184);
      bottom: 0;
      width: 100%;
      height: 20px;
      border-radius: 2px;
      z-index: 99999;
      text-align: left;
      padding-left: 5px;
      padding-right: 5px;
      font-size: small;
      color: darkslategrey;
    "
    v-else
  >
    {{ msg }}
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
      console.log(this.msg);
      return this.msg.length > 40 ? this.msg.substr(0, 40) : this.msg;
    },
  },
  created() {
    console.log("Toast created");
  },
  mounted() {
    console.log(this.type);
  },
  data() {
    return {};
  },
};
</script>
