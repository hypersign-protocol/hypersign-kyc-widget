<template>
  <div class="consent-container">
    <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></load-ing>

    <!-- Main Content -->
    <div>
      <!-- Header Section -->
      <div class="header-section">
        <p class="subtitle">Review and authorize data sharing</p>
      </div>

      <!-- Verifier Info Section -->
      <div class="verifier-section" v-if="getPresentationRequestParsed">
        <v-card class="verifier-card" outlined>
          <v-list-item>
            <v-list-item-avatar tile size="60" class="verifier-avatar-left">
              <img :src="getPresentationRequestParsed.logoUrl" class="avatar" v-if="getPresentationRequestParsed.logoUrl" alt="Verifier Logo" />
              <i class="bi bi-robot avatar-placeholder" v-else></i>
            </v-list-item-avatar>
            <v-list-item-content class="verifier-content-left">
              <v-list-item-title class="verifier-domain" v-if="getPresentationRequestParsed.domain">
                {{ getPresentationRequestParsed.domain }}
              </v-list-item-title>
              <v-list-item-subtitle v-if="getPresentationRequestParsed.reason">
                {{ getPresentationRequestParsed.reason }}
              </v-list-item-subtitle>
              <v-list-item-subtitle v-else>The app is requesting the following information to verify your identity</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </div>

      <!-- Credentials Section -->
      <div class="credentials-section" v-if="getTrustedIssuersCredentials.length > 0">
        <div class="credentials-header">
          <p class="section-subtitle-bold">The following credentials will be shared with the verifier</p>
        </div>

        <v-card class="credentials-card" outlined>
          <v-list class="credentials-list" style="max-height: 250px; overflow-y: auto">
            <v-list-item v-for="eachCredential in getTrustedIssuersCredentials" :key="eachCredential.id" class="credential-item">
              <v-list-item-avatar class="credential-icon">
                <v-avatar>
                  <i class="bi bi-person-bounding-box" v-if="eachCredential.type[1] == 'PersonhoodCredential'"></i>
                  <i class="bi bi-calendar3-week" v-if="eachCredential.type[1] == 'DateOfBirthCredential'"></i>
                  <i class="bi bi-globe" v-if="eachCredential.type[1] == 'CitizenshipCredential'"></i>
                  <i class="bi bi-person-vcard" v-if="eachCredential.type[1] == 'PassportCredential'"></i>
                  <i class="bi bi-person-vcard" v-if="eachCredential.type[1] == 'GovernmentIdCredential'"></i>
                  <i class="bi bi-person-vcard" v-if="eachCredential.type[1].includes('zkProof') && !eachCredential.type[1].includes('SbtCredential') && listOfEnabledZkCredential"></i>
                  <i class="bi bi-person-badge" v-if="eachCredential.type[1].includes('SbtCredential')"></i>
                </v-avatar>
              </v-list-item-avatar>

              <v-list-item-content class="credential-details">
                <v-list-item-title class="credential-type">{{ eachCredential.type[1] }}</v-list-item-title>
                <v-list-item-subtitle class="credential-id">{{ shorten(eachCredential.id) }}</v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-switch :input-value="shouldShare(eachCredential)" :color="shouldShare(eachCredential) ? 'black' : 'grey'" disabled dense></v-switch>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card>
      </div>

      <!-- Action Section -->
      <div class="action-section">
        <v-btn block color="black" @click="submit()" :disabled="isLoading" class="btn-primary">
          <v-icon left>mdi-check-circle</v-icon>
          {{ isLoading ? 'Processing...' : 'Authorize & Continue' }}
        </v-btn>


      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex'
import { HypersignVerifiablePresentation } from 'hs-ssi-sdk'
import { STEP_NAMES } from '@/config'
import VaultConfig from '@/store/vault/config'
import MESSAGE from '../utils/lang/en'
import { EVENT, EVENTS } from '../utils/eventBus'

export default {
  name: STEP_NAMES.UserConsent,
  data() {
    return {
      isLoading: false,
      fullPage: true,
      toastMessage: '',
      toastType: 'success',
      isToast: false,
      hypersignVP: null,

    }
  },
  created() {
    this.hypersignVP = new HypersignVerifiablePresentation()
  },
  computed: {
    ...mapState(['steps']),
    ...mapGetters(['checkIfUserConsentIsEnabled', 'checkIfOncainIdIsEnabled', 'checkIfIdDocumentIsEnabled', 'checkIfLivelinessIsEnabled', 'checkIfzkProofIsEnabled', 'getUserDID', 'getVaultDataRaw', 'getPresentationRequestParsed', 'getWidgetConfigFromDb', 'getIfzkProofStep', 'getIfIdDocumentStep', 'getIfUserConsentStep', 'getIfLivelinessStep']),

    /// // vault
    getVaultDataCredentials() {
      const { hypersign } = JSON.parse(localStorage.getItem(VaultConfig.LOCAL_STATES.VAULT_DATA_RAW))
      const { credentials } = hypersign
      return credentials
    },
    credentailsTypesInWallet() {
      const types = this.getVaultDataCredentials.map((x) => x.type)
      const allTypes = [].concat(...types)
      const uniqueTypes = Array.from(new Set(allTypes))
      const uniqueTypesWithoutDefaultTypes = uniqueTypes.filter((x) => x !== 'VerifiableCredential')
      return uniqueTypesWithoutDefaultTypes
    },
    getTrustedIssuers() {
      const issuerDID = this.getWidgetConfigFromDb.issuerDID
      if (issuerDID) {
        return issuerDID.split(',')
      } else {
        return []
      }
    },
    getTrustedIssuersCredentials() {
      return this.getVaultDataCredentials.filter((x) => this.getTrustedIssuers.includes(x.issuer))
    },
    listOfEnabledZkCredential() {
      if (this.getWidgetConfigFromDb.zkProof?.proofs?.length > 0) {
        const data = this.getWidgetConfigFromDb.zkProof?.proofs?.map((e) => e.proofType)
        return new Set(data)
      } else {
        throw new Error('zkProof Config is not set')
      }
    },
    listOfEnabledSBTCredential() {
      if (this.getWidgetConfigFromDb.zkProof?.proofs?.length > 0) {
        const data = this.getWidgetConfigFromDb.zkProof?.proofs?.map((e) => e.proofType + 'SbtCredential')
        return new Set(data)
      } else {
        throw new Error('zkProof Config is not set')
      }
    },
  },
  methods: {
    ...mapActions(['verifyResult', 'nextStep']),
    ...mapMutations(['previousStep', 'setUserPresentationConsent']),

    toast(msg, type = 'success') {
      EVENT.emitEvent(
        EVENTS.NOTIFY,
        JSON.stringify({
          toastMessage: msg,
          toastType: type,
        })
      )
    },
    interSect(s1, s2) {
      const intersect = s1.intersection(s2)
      if (intersect.size > 0) {
        return true
      }
      return false
    },
    shorten(str) {
      if (str.length <= 30) {
        return str
      }
      const firstPart = str.slice(0, 15)
      const lastPart = str.slice(-15)
      return `${firstPart}...${lastPart}`
    },
    shouldShare(eachCredential) {
      if (eachCredential.type[1] === 'PersonhoodCredential' && this.checkIfLivelinessIsEnabled && !this.checkIfzkProofIsEnabled) {
        return true
      } else if (eachCredential.type[1] === 'GovernmentIdCredential' && this.checkIfIdDocumentIsEnabled && !this.checkIfzkProofIsEnabled && !this.checkIfOncainIdIsEnabled) {
        return true
      } else if (eachCredential.type[1] === 'PassportCredential' && this.checkIfIdDocumentIsEnabled && !this.checkIfzkProofIsEnabled && !this.checkIfOncainIdIsEnabled) {
        return true
      } else if (eachCredential.type[1].includes('zkProof') && !eachCredential.type[1].includes('SbtCredential') && this.checkIfzkProofIsEnabled && !this.checkIfOncainIdIsEnabled && this.interSect(this.listOfEnabledZkCredential, new Set([eachCredential.type[1]]))) {
        return true
      } else if (eachCredential.type[1].includes('SbtCredential') && this.checkIfOncainIdIsEnabled && this.interSect(this.listOfEnabledSBTCredential, new Set([eachCredential.type[1]]))) {
        return true
      }
      return false
    },
    async submit() {
      try {
        this.toast(MESSAGE.USER_CONSENT.DATA_SUBMIT, 'success')
        const presentation = await this.generatePresentation()
        this.setUserPresentationConsent(presentation)

        this.isLoading = true
        this.toast(MESSAGE.USER_CONSENT.DATA_SUBMIT, 'warning')
        this.$emit('verifyIdDocEvent', true)

        await this.verifyResult()
        this.isLoading = false
        this.nextStep()
      } catch (e) {
        this.nextStep(8)
        this.toast(e.message, 'error')
        this.isLoading = false
      }
    },
    async generatePresentation() {
      const filteredCredentials = this.getTrustedIssuersCredentials.filter((x) => this.shouldShare(x))
      const params = {
        verifiableCredentials: [...filteredCredentials],
        holderDid: this.getUserDID,
      }
      return await this.hypersignVP.generate(params)
    },


  },
}
</script>

<style scoped>
.consent-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 10px;
  background-color: #ffffff;
  padding-bottom: 0px;
}

/* Header Section */
.header-section {
  text-align: center;
  margin-bottom: 0px;
}

.subtitle {
  font-size: 16px;
  color: #666666;
  margin: 0;
  line-height: 1.3;
}

/* Verifier Section */
.verifier-section {
  margin-bottom: 24px;
}

.verifier-card {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
}

.verifier-avatar-left {
  margin-right: 12px !important;
}

.verifier-content-left {
  flex: 1;
  min-width: 0;
}

.verifier-domain {
  font-size: 16px !important;
  font-weight: 600 !important;
  color: #333333 !important;
  margin: 0 !important;
  line-height: 1.3 !important;
  text-align: left !important;
  overflow: visible !important;
  text-overflow: unset !important;
  white-space: normal !important;
  word-wrap: break-word !important;
  font-size: 0.9rem !important;
}

.verifier-content-left .v-list-item__title {
  overflow: visible !important;
  text-overflow: unset !important;
  white-space: normal !important;
  word-wrap: break-word !important;
}

.verifier-content-left .v-list-item__subtitle {
  overflow: visible !important;
  text-overflow: unset !important;
  white-space: normal !important;
  word-wrap: break-word !important;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
}

.avatar-placeholder {
  font-size: 24px;
  color: #6c757d;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

/* Credentials Section */
.credentials-section {
  margin-bottom: 24px;
}

.credentials-header {
  margin-bottom: 16px;
}

.section-subtitle-bold {
  font-size: 14px;
  font-weight: 600;
  color: #333333;
  margin: 0;
  line-height: 1.3;
  text-align: left;
}

.credentials-card {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
}

.credential-item {
  border-bottom: 1px solid #f0f0f0;
  padding: 8px 16px !important;
  min-height: 48px !important;
}

.credential-icon {
  margin-right: 12px;
}

.credential-icon .v-avatar {
  background-color: #f8f9fa !important;
  border: 1px solid #e9ecef !important;
  width: 32px !important;
  height: 32px !important;
  min-width: 32px !important;
  min-height: 32px !important;
  flex-shrink: 0 !important;
}

.credential-icon i {
  font-size: 16px;
  color: #6c757d;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 100% !important;
  height: 100% !important;
}

.credential-details {
  flex: 1;
  min-width: 0;
}

.credential-details .v-list-item__title {
  text-align: left !important;
  justify-content: flex-start !important;
  font-size: 13px !important;
  line-height: 1.2 !important;
  margin-bottom: 2px !important;
}

.credential-details .v-list-item__subtitle {
  text-align: left !important;
  justify-content: flex-start !important;
  font-size: 11px !important;
  line-height: 1.2 !important;
}

.credential-type {
  font-size: 13px !important;
  font-weight: 600 !important;
  color: #333333 !important;
  margin: 0 !important;
  line-height: 1.2 !important;
  text-align: left !important;
  word-wrap: break-word !important;
}

.credential-id {
  font-size: 11px !important;
  color: #666666 !important;
  margin: 0 !important;
  font-family: monospace !important;
  line-height: 1.2 !important;
  text-align: left !important;
  word-wrap: break-word !important;
}

/* Action Section */
.action-section {
  margin-top: 24px;
}

.btn-primary {
  width: 100%;
  padding: 10px 16px;
  background-color: #000000;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
}

.btn-primary:hover {
  background-color: #333333;
}

.btn-primary:active {
  transform: translateY(1px);
}
</style>
