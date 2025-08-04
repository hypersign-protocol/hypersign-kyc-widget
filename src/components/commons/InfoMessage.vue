<template>
  <div class="consent-message d-flex align-items-start">
    <i class="bi bi-info-circle-fill info-icon"></i>
    <span class="ml-2">
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
  font-size: large;
}

@media (max-width: 450px) {
  .consent-message {
    font-size: small;
  }
}
</style>
