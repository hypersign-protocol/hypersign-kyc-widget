<template>
  <p class="consent-message">
    <span>
      {{ message }}
    </span>
  </p>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default: '',
    },
  },
}
</script>

<style type="text/css" scoped>
.consent-message {
  color: grey;
  /* padding: 5px; */
  padding-top: 5px;
  font-size: x-small;
}
</style>
