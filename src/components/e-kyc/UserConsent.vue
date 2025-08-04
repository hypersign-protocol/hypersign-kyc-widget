<template>
  <div class="kyc-container">
    <div class="card-body min-h-36">
      <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></load-ing>
      <VerifierInfoCard :logoUrl="getPresentationRequestParsed.logoUrl" :domain="getPresentationRequestParsed.domain" :name="getPresentationRequestParsed.name" />
      <div class="mt-4 p-4 widget-card-width" style="margin: auto">
        <v-card class="mx-auto" max-width="400">
          <v-card-title class="text-h6">Credentials to Share</v-card-title>
          <v-card-text>
            <div v-for="eachCredential in getTrustedIssuersCredentials" v-bind:key="eachCredential.id" class="d-flex align-center mb-3">
              <v-icon class="mr-3" color="primary">
                <i class="bi bi-person-bounding-box" v-if="eachCredential.type[1] == 'PersonhoodCredential'"></i>
                <i class="bi bi-calendar3-week" v-if="eachCredential.type[1] == 'DateOfBirthCredential'"></i>
                <i class="bi bi-globe" v-if="eachCredential.type[1] == 'CitizenshipCredential'"></i>
                <i class="bi bi-person-vcard" v-if="eachCredential.type[1] == 'PassportCredential'"></i>
                <i class="bi bi-person-vcard" v-if="eachCredential.type[1] == 'GovernmentIdCredential'"></i>
                <i class="bi bi-person-vcard" v-if="eachCredential.type[1].includes('zkProof') && !eachCredential.type[1].includes('SbtCredential') && listOfEnabledZkCredential"></i>
                <i class="bi bi-person-badge" v-if="eachCredential.type[1].includes('SbtCredential')"></i>
              </v-icon>
              <div class="flex-grow-1">
                <div class="text-subtitle-2">{{ eachCredential.type[1] }}</div>
                <div class="text-caption text-grey">{{ shorten(eachCredential.id) }}</div>
              </div>
              <v-checkbox :model-value="shouldShare(eachCredential)" color="primary"></v-checkbox>
            </div>
          </v-card-text>
        </v-card>

        <v-card class="mx-auto mt-4" max-width="400">
          <v-card-text>
            <v-checkbox v-model="consentChecked" :rules="[(v) => !!v || 'You must agree to continue']" required class="consent-checkbox">
              <template v-slot:label>
                <div class="consent-text">
                  <span>I understand, have read and agree to the</span>
                  <span><a href="#" class="consent-link">Terms of Use</a> and <a href="#" class="consent-link">Privacy Policy</a></span>
                </div>
              </template>
            </v-checkbox>
          </v-card-text>
        </v-card>

        <v-btn block color="primary" @click="submit()" :disabled="!consentChecked" class="mt-4"> Continue </v-btn>
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
      consentChecked: false,
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
      if (str.length <= 40) {
        return str
      }
      const firstPart = str.slice(0, 20)
      const lastPart = str.slice(-20)
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
        // TODO: Generating the presention with all the VCs
        this.toast(MESSAGE.USER_CONSENT.DATA_SUBMIT, 'success')
        const presentation = await this.generatePresentation()
        this.setUserPresentationConsent(presentation)
        // TODO:  sign this presentation

        // const signedPresentation  = await this.signPresentation(presentation)

        // Submitting the presentation
        this.isLoading = true
        this.toast(MESSAGE.USER_CONSENT.DATA_SUBMIT, 'warning')
        this.$emit('verifyIdDocEvent', true)

        // TODO: send this presentation in the verifyResult API // TODO: change the name of this API as well as functioin
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
.widget-card-width {
  width: 80%;
  margin: auto;
}

@media (max-width: 200px) {
  .widget-card-width {
    width: 100%;
  }
}

.consent-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.consent-link {
  color: #1976d2;
  text-decoration: none;
}

.consent-link:hover {
  text-decoration: underline;
}
</style>
