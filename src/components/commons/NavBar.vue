<template>
  <v-row>
    <v-col cols="12" offset-sm="0">
      <v-card>
        <v-toolbar color="white" flat>
          <v-btn icon light>
            <i class="bi bi-arrow-left"></i>
          </v-btn>
          <v-toolbar-title class="grey--text text--darken-4"> {{ getActiveStep.name }} ({{ getActiveStep.id - length - lengthToMinus }}/{{ kycStepsLength }}) </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu bottom left :offset-y="true">
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon text v-bind="attrs" v-on="on">
                <i class="bi bi-three-dots-vertical"></i>
              </v-btn>
            </template>
            <v-card class="mx-auto" max-width="300" tile>
              <v-list dense>
                <v-subheader>MENU</v-subheader>
                <v-list-item-group color="primary">
                  <v-list-item>
                    <v-list-item-icon>
                      <i class="bi bi-list"></i>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Item 1</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-icon>
                      <i class="bi bi-list"></i>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Item 2</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card>
          </v-menu>
        </v-toolbar>
      </v-card>
    </v-col>
  </v-row>
  <!-- <div class="navbar navbar-expand-md navbar-light" style="justify-content: end">
    <a href="#" class="navbar-brand">
      <img class="" src="../../../public/assets/img/hypersign_black_transparent_rect.png" width="100px" />
    </a>

    <span class="stepper" v-if="getActiveStep.name && getActiveStep.isEnabled == true"> {{ getActiveStep.name }} ({{ getActiveStep.id - length - lengthToMinus }}/{{ kycStepsLength }}) </span>
  </div> -->
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { STEP_NAMES } from '@/config'

export default {
  computed: {
    ...mapState(['steps']),
    ...mapGetters(['getActiveStep', 'getIfzkProofStep']),
    length() {
      if (this.getIfzkProofStep.isEnabled === false) {
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

<style scoped>
.stepper {
  float: right;
  padding-right: 10px;
  float: right;
  padding-top: 4px;
  padding-left: 10px;
  border: 1px solid #808080eb;
  border-radius: 33px;
  padding-bottom: 4px;
  background: #80808024;
  font-size: smaller;
}

@media (max-width: 768px) {
  .stepper {
    font-size: x-small;
  }
}
</style>
