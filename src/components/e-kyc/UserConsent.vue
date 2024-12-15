<template>
  <div>
    <div class="card-body min-h-36">
      <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></load-ing>
      <div class="kyc-container">
        <v-card class="mx-auto" outlined style="text-align: start">
          <v-list-item three-line>
            <v-list-item-content>
              <div v-if="getPresentationRequestParsed.domain">{{ getPresentationRequestParsed.domain }}</div>
              <v-list-item-subtitle v-if="getPresentationRequestParsed.reason">{{ getPresentationRequestParsed.reason }}</v-list-item-subtitle>
              <v-list-item-subtitle v-else>The verifier app needs the following information to allow you use their serivce</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-avatar tile size="80">
              <img :src="getPresentationRequestParsed.logoUrl" class="avatar" v-if="getPresentationRequestParsed.logoUrl" />
              <i class="bi bi-robot avatar" style="font-size: xxx-large; display: inline-block" v-else></i>
            </v-list-item-avatar>
          </v-list-item>
        </v-card>
      </div>
      <div class="mt-1 kyc-container" style="overflow-y: auto; max-height: 335px; text-align: left">
        <v-card>
          <v-list two-line subheader>
            <v-list-item link v-for="eachCredential in getTrustedIssuersCredentials" v-bind:key="eachCredential.id">
              <v-list-item-avatar style="border: 1px solid lightgrey">
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

              <v-list-item-content>
                <v-list-item-title class="text-overline">{{ eachCredential.type[1] }}</v-list-item-title>
                <v-list-item-subtitle>{{ shorten(eachCredential.id) }}</v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-btn icon ripple>
                  <v-switch :input-value="shouldShare(eachCredential)" flat disabled></v-switch>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card>
      </div>
      <div class="mt-1 kyc-container">
        <v-btn block color="secondary" @click="submit()"><i class="bi bi-check-circle mx-1"></i> Authorize</v-btn>
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
.credential-row {
  padding: 10px;
  font-size: x-large;
}

.credential-row-type {
  text-align: left;
}

.credential-row-switch {
  align-content: right;
}

.form-switch {
  padding-left: 1.5em;
}

.conset-message {
  color: grey;
  font-size: x-small;
}

.widget-card-width {
  width: 95%;
  margin: auto;
}

@media (max-width: 768px) {
  .widget-card-width {
    margin: auto;
    width: 100%;
  }
  .center-text-align {
    text-align: center;
  }
  .credential-row {
    padding: 0px;
  }
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #f8f9fa;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
