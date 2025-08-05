<template>
  <v-card class="pa-0 navbar-container">
    <v-toolbar color="white" flat dense class="pa-0 ma-0 navbar-toolbar">
      <v-btn icon light class="navbar-btn">
        <i class="bi bi-arrow-left"></i>
      </v-btn>
      <v-toolbar-title class="grey--text text--darken-4 navbar-title"> {{ currentStep.name }} ({{ currentStepNumber }}/{{ totalConfiguredSteps }}) </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu bottom left :offset-y="true">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon text v-bind="attrs" v-on="on" class="navbar-btn">
            <i class="bi bi-three-dots-vertical"></i>
          </v-btn>
        </template>
        <v-card class="mx-auto navbar-menu" max-width="300" tile>
          <v-list dense>
            <v-list-item-group color="primary">
              <v-list-item class="center">
                <v-avatar size="40">
                  <v-img :src="logoUrl"></v-img>
                </v-avatar>
              </v-list-item>
              <v-list-item class="center">
                <v-list-item-content>
                  <v-list-item-title class="navbar-menu-text">{{ getProfile.name }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <i class="bi bi-envelope-at navbar-menu-icon"></i>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="navbar-menu-text">{{ getProfile.email }}</v-list-item-title>
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
.navbar-container {
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
}

.navbar-toolbar {
  background-color: #ffffff;
}

.navbar-btn {
  color: #000000;
}

.navbar-title {
  color: #000000;
  font-weight: 500;
}

.navbar-menu {
  border-radius: 12px;
  border: 1px solid #e0e0e0;
}

.navbar-menu-text {
  color: #000000;
}

.navbar-menu-icon {
  color: #666666;
}

.stepper {
  float: right;
  padding-right: 10px;
  float: right;
  padding-top: 4px;
  padding-left: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 33px;
  padding-bottom: 4px;
  background: #f5f5f5;
  font-size: smaller;
  color: #000000;
}

@media (max-width: 450px) {
  .stepper {
    font-size: x-small;
  }
}
</style>
