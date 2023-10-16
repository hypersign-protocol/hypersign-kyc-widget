<template>
  <div>
    <a href="https://hypersign.id" target="_blank"
      >{{ this.footerLabel }}
      <img
        src="../../assets/hypersign_black_transparent_rect.png"
        width="70px"
        height="20px"
    /></a>
  </div>
</template>
<style scoped>
div {
  color: black;
  font-size: small;
}

a {
  text-decoration: none;
  color: black;
}
</style>
<script>
export default {
  props: {
    footerLabel: {
      type: String,
      default: "Powered By",
    },
  },
};
</script>
