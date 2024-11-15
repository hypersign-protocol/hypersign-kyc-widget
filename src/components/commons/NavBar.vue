<template>
  <div class="navbar navbar-expand-md navbar-light">
    <div class="container">
      <a href="#" class="navbar-brand">
        <img class="" src="../../../public/assets/img/hypersign_black_transparent_rect.png" width="100px" />
      </a>

      <span style="float: right; padding-right: 10px; float: right; padding-top: 4px; padding-left: 10px; border: 1px solid #808080eb; border-radius: 33px; padding-bottom: 4px; background: #80808024" v-if="getActiveStep.name && getActiveStep.isEnabled == true"> {{ getActiveStep.name }} ({{ getActiveStep.id - length - lengthToMinus }}/{{ kycStepsLength }}) </span>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { STEP_NAMES } from '@/config'

export default {
  computed: {
    ...mapState(['steps']),
    ...mapGetters(['getActiveStep']),
    length() {
      if (this.steps.find((x) => x.stepName === STEP_NAMES.ZkProofs).isEnabled === false) {
        if (this.getActiveStep.stepName === STEP_NAMES.UserConsent) {
          return 2
        } else {
          return 1
        }
      } else {
        return 1
      }
    },
    lengthToMinus() {
      const allRelevantSteps = this.steps.filter((step) => step.name != null)
      const notActiveSteps = allRelevantSteps.filter((step) => step.isActive === true)
      return notActiveSteps ? notActiveSteps.length : 0
    },
    kycStepsLength() {
      return this.steps.filter((step) => step.name != null && step.isEnabled === true).length
    },
  },
}
</script>
