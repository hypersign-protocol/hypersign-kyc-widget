<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import WidgetConfig from './components/utils/widget.config'
import { mapMutations } from 'vuex'
export default {
  name: 'App',
  components: {},
  methods: {
    ...mapMutations(['setSteps', 'setTrustedSchemaIdsAndIssuers', 'setIdDocumentLicenseKey', 'clearAllLocalStore']),
    handleBeforeUnload() {
      this.clearAllLocalStore()
    },
  },
  mounted() {
    window.addEventListener('beforeunload', this.handleBeforeUnload)
  },

  async created() {
    if (WidgetConfig) {
      const steps = [
        {
          id: 0,
          isActive: true,
          stepName: 'SignIn',
          previous: 0,
          isEnabled: true,
        },
        {
          id: 1,
          isActive: false,
          stepName: 'VaultPIN',
          previous: 0,
          isEnabled: true,
        },
        {
          id: 2,
          isActive: false,
          stepName: 'AppInstructions',
          previous: 1,
          isEnabled: true,
        },
        {
          id: 3,
          isActive: false,
          stepName: 'LiveLiness3',
          name: 'Facial Recognition',
          previous: 2,
          isEnabled: false,
          stepTitle: 'Conduct liveliness check to prove you are a human',
          logo: 'face-id.png',
        },
        {
          id: 4,
          isActive: false,
          stepName: 'IdDocs4',
          name: 'Government-issued ID',
          previous: 3,
          isEnabled: false,
          stepTitle: 'Submit your ID document and recieve your KYC credential',
          logo: 'profile.png',
        },
        {
          id: 5,
          isActive: false,
          stepName: 'ZkProofs',
          name: 'Generate Proofs',
          previous: 4,
          isEnabled: false,
          stepTitle: 'Generate zkProof',
          logo: 'proof.png',
        },
        {
          id: 6,
          isActive: false,
          stepName: 'OnChainId4',
          name: 'On Chain Identity',
          previous: 5,
          isEnabled: false,
          stepTitle: 'Generate zkProof & Mint your on-chain Identity',
          logo: 'proof.png',
        },
        {
          id: 7,
          isActive: false,
          stepName: 'UserConsent',
          name: 'Provide User Consent',
          previous: 6,
          isEnabled: true,
          stepTitle: 'Provide consent of your data to be shared with the verifier app',
          logo: 'consent.png',
        },
        {
          id: 8,
          isActive: false,
          stepName: 'FinalResult',
          previous: 7,
          isEnabled: true,
        },
        {
          id: 9,
          isActive: false,
          stepName: 'SessionExpired',
          previous: 8,
          isEnabled: true,
        },
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
        } else if (WidgetConfig.env === 'prod') {
          this.setIdDocumentLicenseKey(WidgetConfig.licenseKey.prod)
        } else {
          this.setIdDocumentLicenseKey(WidgetConfig.licenseKey.dev)
        }
      }
    } else {
      throw new Error('Invalid widget configuration')
    }
  },
}
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
