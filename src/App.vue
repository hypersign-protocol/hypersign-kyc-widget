<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
// import MainPage from "./components/MainPage.vue";
// import { encrypt, decrypt } from './components/utils/symmetricCrypto';
import WidgetConfig from './components/utils/widget.config'
import { mapMutations } from 'vuex';
export default {
  name: "App",
  components: {
  },
  methods: {
    ...mapMutations(["setSteps", "setTrustedSchemaIdsAndIssuers", "setIdDocumentLicenseKey", "clearAllLocalStore"]),
    handleBeforeUnload() {
      this.clearAllLocalStore()
    }
  },
  mounted() {
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  },

  async created() {

    if (WidgetConfig) {

      let steps = [
        { "id": 0, "isActive": true, "stepName": "SignIn", "previous": 0, "isEnabled": true },
        { "id": 1, "isActive": false, "stepName": "VaultPIN", "previous": 0, "isEnabled": true },
        { "id": 2, "isActive": false, "stepName": "AppInstructions", "previous": 1, "isEnabled": true },
        { "id": 3, "isActive": false, "stepName": "LiveLiness3", "name": "Facial Recognition", "previous": 2, "isEnabled": false },
        { "id": 4, "isActive": false, "stepName": "IdDocs4", "name": "Government-issued ID", "previous": 3, "isEnabled": false },
        { "id": 5, "isActive": false, "stepName": "OnChainId4", "name": "On Chain Identity", "previous": 4, "isEnabled": false },
        { "id": 6, "isActive": false, "stepName": "UserConsent", "name": "Provide User Consent", "previous": 5, "isEnabled": true },
        { "id": 7, "isActive": false, "stepName": "FinalResult", "previous": 6, "isEnabled": true }
      ]
      this.setSteps(steps)

      // trusted issuers and schemaIds
      if (WidgetConfig.schemaIds) {
        this.setTrustedSchemaIdsAndIssuers(WidgetConfig.schemaIds)
      } else {
        throw new Error('Invalid widget configuration, schemaIds is required')
      }

      // set license key
      if (WidgetConfig.licenseKey) {
        if (WidgetConfig.env === 'dev') {
          this.setIdDocumentLicenseKey(WidgetConfig.licenseKey.dev)
        } else if (WidgetConfig.env === 'stage') {
          this.setIdDocumentLicenseKey(WidgetConfig.licenseKey.stage)
        } else {
          this.setIdDocumentLicenseKey(WidgetConfig.licenseKey.dev)
        }
      }

    } else {
      throw new Error('Invalid widget configuration')
    }
  },

};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
}
</style>
