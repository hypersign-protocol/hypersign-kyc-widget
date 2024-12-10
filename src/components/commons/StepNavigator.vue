<template>
  <v-row>
    <!-- <h2>Current Step</h2> -->
    <v-btn @click="previousStep()" :disabled="isFirstStep">Previous</v-btn>
    <v-btn @click="nextStep()" :disabled="isLastStep">Next</v-btn>
  </v-row>
</template>
<script type="text/javascript">
// import { mapMutations } from 'vuex'
export default {
  name: 'StepNavigator',
  computed: {
    currentStep() {
      return this.$store.getters.currentStep
    },
    isFirstStep() {
      return this.$store.getters.isFirstStep
    },
    isLastStep() {
      return this.$store.getters.isLastStep
    },
    currentStepNumber() {
      return this.$store.getters.currentStepNumber
    },
  },
  methods: {
    // ...mapMutations(['NEXT_STEP, PREVIOUS_STEP']),
    nextStep() {
      this.$store.dispatch('nextStep')
    },
    previousStep() {
      this.$store.dispatch('previousStep')
    },
  },
}
</script>
