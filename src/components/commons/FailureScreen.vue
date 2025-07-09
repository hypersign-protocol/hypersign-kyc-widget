<template>
  <v-container fill-height fluid class="widget-card-width d-flex flex-column justify-center align-center pa-6">
    <!-- Red circle with X -->

    <i class="bi bi-x-circle final-msg-icon fail"></i>

    <!-- Dynamic message -->
    <div class="text-center mb-8" style="color: #f44336; font-weight: 500">
      {{ message }}
    </div>

    <!-- Subtext instruction -->
    <div class="text-center mb-8" style="color: #757575; font-size: 14px">Please click the button below to retry from the verifier app.</div>

    <!-- Dynamic action button -->
    <v-btn outlined block color="secondary" @click="onAction" class="px-8 py-4">
      {{ buttonText }}
    </v-btn>
  </v-container>
</template>

<script>
export default {
  name: 'FailureScreen',
  props: {
    message: {
      type: String,
      default: 'An error occurred',
    },
    buttonText: {
      type: String,
      default: 'Try Again',
    },
    onAction: {
      type: Function,
      required: true,
    },
  },
}
</script>

<style scoped>
.final-msg-icon {
  font-size: xxx-large;
}
.v-avatar {
  border-radius: 50% !important;
}
.fail {
  color: red;
}
</style>
