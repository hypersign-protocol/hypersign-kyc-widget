<template>
  <div
    style="background-color: beige; color: red; text-align: left; padding: 10px"
    v-if="nonChrome"
  >
    WARNING!! Looks like you are using non chromium based browser, please switch
    to Google Chrome or Brave or any other chromium based browser for better
    experience. Some of features might not work in this browser as expected.
  </div>
</template>

<script>
export default {
  data() {
    return {
      nonChrome: false,
    };
  },
  mounted() {
    if (!window.chrome) {
      this.nonChrome = true;
    }
  },
};
</script>
