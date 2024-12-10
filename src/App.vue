<template>
  <v-app>
    <v-container>
      <router-view />
    </v-container>
  </v-app>
  <!-- <div id="app">
    <router-view />
  </div> -->
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
          name: 'Face Verification',
          previous: 2,
          isEnabled: false,
          stepTitle: 'Conduct liveliness check to prove you are a human',
          logo: 'face-id.png',
          requiredCredentialTypes: ['PersonhoodCredential'],
          hasDone: false,
        },
        {
          id: 4,
          isActive: false,
          stepName: 'IdDocs4',
          name: 'ID Verification',
          previous: 3,
          isEnabled: false,
          stepTitle: 'Submit your ID document and recieve your KYC credential',
          logo: 'profile.png',
          requiredCredentialTypes: ['PassportCredential', 'GovernmentIdCredential'],
          hasDone: false,
        },
        {
          id: 5,
          isActive: false,
          stepName: 'ZkProofs',
          name: 'Proofs Generation',
          previous: 4,
          isEnabled: false,
          stepTitle: 'Generate Zero Knowledge Proof(s) & Mint your on-chain Identity',
          logo: 'proof.png',
          requiredCredentialTypes: ['zkProofOfKYC', 'zkProofOfAge', 'zkProofOfPersonHood'],
          hasDone: false,
        },
        // {
        //   id: 5,
        //   isActive: false,
        //   stepName: 'OnChainId4',
        //   name: 'OnChain ID Minting',
        //   previous: 4,
        //   isEnabled: false,
        //   stepTitle: 'Generate Zero Knowledge Proof(s) & Mint your on-chain Identity',
        //   logo: 'proof.png',
        //   requiredCredentialTypes: ['SBTCredential'],
        //   hasDone: false,
        // },
        {
          id: 6,
          isActive: false,
          stepName: 'UserConsent',
          name: 'User Consent',
          previous: 5,
          isEnabled: true,
          stepTitle: 'Provide consent of your data to the verifier app',
          logo: 'consent.png',
        },
        {
          id: 7,
          isActive: false,
          stepName: 'FinalResult',
          previous: 6,
          isEnabled: true,
        },
        {
          id: 8,
          isActive: false,
          stepName: 'SessionExpired',
          previous: 7,
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
