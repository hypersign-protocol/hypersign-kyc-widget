<template>
  <div class="consent-message">
    <span>
      {{ message }}
    </span>
  </div>
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
  padding: 5px;
  font-size: x-small;
}
</style>
