<template>
  <v-card class="pa-0">
    <!-- Flat and zero padding -->
    <v-toolbar color="white" flat dense class="pa-0 ma-0">
      <v-btn icon light>
        <i class="bi bi-arrow-left"></i>
      </v-btn>
      <v-toolbar-title class="grey--text text--darken-4"> {{ currentStep.name }} ({{ currentStepNumber }}/{{ totalConfiguredSteps }}) </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu bottom left :offset-y="true">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon text v-bind="attrs" v-on="on">
            <i class="bi bi-three-dots-vertical"></i>
          </v-btn>
        </template>
        <v-card class="mx-auto" max-width="300" tile>
          <v-list dense>
            <v-list-item-group color="primary">
              <v-list-item class="center">
                <v-avatar size="40">
                  <v-img :src="logoUrl"></v-img>
                </v-avatar>
              </v-list-item>
              <v-list-item class="center">
                <v-list-item-content>
                  <v-list-item-title>{{ getProfile.name }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <i class="bi bi-envelope-at"></i>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ getProfile.email }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-menu>
    </v-toolbar>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['currentStep', 'getProfile']),
    currentStepNumber() {
      return this.$store.getters.currentStepNumber - 3
    },
    totalConfiguredSteps() {
      return this.$store.getters.enabledStepsToShow.length
    },
    logoUrl() {
      return require('@/assets/' + 'selfi.png')
    },
  },
  methods: {
    previousStep() {
      this.$store.dispatch('previousStep')
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

@media (max-width: 450px) {
  .stepper {
    font-size: x-small;
  }
}
</style>
