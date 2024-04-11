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
    // MainPage,
  },
  methods: {
    ...mapMutations(["setSteps", "setTrustedSchemaIdsAndIssuers", "setIdDocumentLicenseKey"]),
  },
  async created() {

    if (WidgetConfig) {
      // Steps
      if (Object.keys(WidgetConfig.steps).length > 0) {
        let steps = [
          {
            id: 0,
            isActive: true,
            stepName: 'SignIn',
            previous: 0
          },
          {
            id: 1,
            isActive: false,
            stepName: 'VaultPIN',
            previous: 0
          },
          {
            id: 2,
            isActive: false,
            stepName: 'AppInstructions',
            previous: 1
          },
        ]

        if (WidgetConfig.steps.faceRecog && WidgetConfig.steps.idOcr) {
          // if faceRecog and ocr enabled
          // if only ocr enabled 
          steps.push({
            id: steps.length,
            isActive: false,
            stepName: 'Liveliness',
            name: 'Facial Recognition',
            previous: steps.length - 1
          })

          steps.push({
            id: steps.length,
            isActive: false,
            stepName: 'IdDocs',
            name: 'Government-issued ID',
            previous: steps.length - 1
          })
        } else if (WidgetConfig.steps.faceRecog && !WidgetConfig.steps.idOcr) {
          // if only faceRecog enabled
          steps.push({
            id: steps.length,
            isActive: false,
            stepName: 'Liveliness',
            name: 'Facial Recognition',
            previous: steps.length - 1
          })
        } else if (!WidgetConfig.steps.faceRecog && WidgetConfig.steps.idOcr) {
          // if faceRecog and ocr enabled
          // if only ocr enabled 
          steps.push({
            id: steps.length,
            isActive: false,
            stepName: 'Liveliness',
            name: 'Facial Recognition',
            previous: steps.length - 1
          })

          steps.push({
            id: steps.length,
            isActive: false,
            stepName: 'IdDocs',
            name: 'Government-issued ID',
            previous: steps.length - 1
          })
        } else if (WidgetConfig.steps.onChainId) {
          steps.push({
            id: steps.length,
            isActive: false,
            stepName: 'OnChainId',
            name: 'On Chain Identity',
            previous: steps.length - 1
          })
        } else if (!WidgetConfig.steps.faceRecog && !WidgetConfig.steps.idOcr) {
          console.log('Invalid widget configuration')
        }

        steps.push({
          id: steps.length,
          isActive: false,
          stepName: 'UserConsent',
          name: 'Provide User Consent',
          previous: steps.length - 1
        })

        steps.push({
          id: steps.length,
          isActive: false,
          stepName: 'FinalResult',
          previous: steps.length - 1
        })

        this.setSteps(steps)
      } else {
        throw new Error('Invalid widget configuration, steps is required')
      }

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
