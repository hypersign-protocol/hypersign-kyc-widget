<template>
  <div>
    <div class="card-body min-h-36">
      <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></load-ing>
      <PageHeading :header="'User Consent'" style="text-align: center" />

      <div class="widget-card widget-card-width" v-if="getPresentationRequestParsed">
        <div class="container credential-row">
          <div class="row">
            <div class="col-md-2">
              <img :src="getPresentationRequestParsed.logoUrl" class="avatar" v-if="getPresentationRequestParsed.logoUrl" />
              <i class="bi bi-robot avatar" style="font-size: xxx-large; display: inline-block" v-else></i>
            </div>
            <div class="col-md-10" style="text-align: left; font-size: large">
              <div class="row center-text-align" v-if="getPresentationRequestParsed.domain">
                <div class="col-md-12">
                  {{ getPresentationRequestParsed.domain }}
                </div>
              </div>
              <div class="row center-text-align" style="color: grey; font-size: smaller">
                <div class="col-md-12">
                  <span v-if="getPresentationRequestParsed.reason">
                    {{ getPresentationRequestParsed.reason }}
                  </span>
                  <span v-else> verifier app needs your information to allow you serivce </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="widget-card widget-card-width mt-1" style="overflow-y: auto; max-height: 335px">
        <div class="container">
          <div class="list-group mb-1 list-group-flush">
            <a href="javascript:void(0);" class="list-group-item list-group-item-action flex-column align-items-start" v-for="eachCredential in getTrustedIssuersCredentials" v-bind:key="eachCredential.id">
              <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">{{ eachCredential.type[1] }}</h5>
                <small>
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" :checked="shouldShare(eachCredential)" disabled />
                  </div>
                  <!-- <i class="bi bi-person-bounding-box" v-if="eachCredential.type[1] == 'PersonhoodCredential'"></i>
                  <i class="bi bi-calendar3-week" v-if="eachCredential.type[1] == 'DateOfBirthCredential'"></i>
                  <i class="bi bi-globe" v-if="eachCredential.type[1] == 'CitizenshipCredential'"></i>
                  <i class="bi bi-person-vcard" v-if="eachCredential.type[1] == 'PassportCredential'"></i>
                  <i class="bi bi-person-vcard" v-if="eachCredential.type[1] == 'GovernmentIdCredential'"></i>
                  <i class="bi bi-person-vcard" v-if="eachCredential.type[1].includes('zkProof') && !eachCredential.type[1].includes('SbtCredential') && listOfEnabledZkCredential"></i>
                  <i class="bi bi-person-badge" v-if="eachCredential.type[1].includes('SbtCredential')"></i> -->
                </small>
              </div>
              <p style="text-align: left"><InfoMessage :message="shorten(eachCredential.id)"></InfoMessage></p>
              <!-- <small style="text-align: left"><InfoMessage :message="'Valid Until: 12/12/2202'"></InfoMessage></small> -->
            </a>
            <!-- <li class="list-group-item d-flex justify-content-between align-items-center" v-for="eachCredential in getTrustedIssuersCredentials" v-bind:key="eachCredential.id">
              <i class="bi bi-person-bounding-box" v-if="eachCredential.type[1] == 'PersonhoodCredential'"></i>
              <i class="bi bi-calendar3-week" v-if="eachCredential.type[1] == 'DateOfBirthCredential'"></i>
              <i class="bi bi-globe" v-if="eachCredential.type[1] == 'CitizenshipCredential'"></i>
              <i class="bi bi-person-vcard" v-if="eachCredential.type[1] == 'PassportCredential'"></i>
              <i class="bi bi-person-vcard" v-if="eachCredential.type[1] == 'GovernmentIdCredential'"></i>
              <i class="bi bi-person-vcard" v-if="eachCredential.type[1].includes('zkProof') && !eachCredential.type[1].includes('SbtCredential') && listOfEnabledZkCredential"></i>
              <i class="bi bi-person-badge" v-if="eachCredential.type[1].includes('SbtCredential')"></i>
              {{ eachCredential.type[1] }}
              <InfoMessage :message="eachCredential.id"></InfoMessage>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" :checked="shouldShare(eachCredential)" disabled />
              </div>
            </li> -->
          </div>
          <!-- <div class="row credential-row p-1 mb-1" v-for="eachCredential in getTrustedIssuersCredentials" v-bind:key="eachCredential.id">
          </div> -->
        </div>
      </div>
      <p style="margin-top: 1%">
        <button class="btn btn-outline-dark" @click="submit()"><i class="bi bi-check-circle"></i> Authorize</button>
      </p>
    </div>
    <div class="footer">
      <MessageBox :msg="toastMessage" :type="toastType" :action="isToast ? 'show' : 'hide'" />
    </div>
  </div>
</template>

<script type="text/javascript">
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex'
import { HypersignVerifiablePresentation } from 'hs-ssi-sdk'
import { STEP_NAMES } from '@/config'
import VaultConfig from '@/store/vault/config'
import MESSAGE from '../utils/lang/en'
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
    ...mapGetters(['getUserDID', 'getVaultDataRaw', 'getPresentationRequestParsed', 'getWidgetConfigFromDb', 'getIfOncainIdStep', 'getIfzkProofStep', 'getIfIdDocumentStep', 'getIfUserConsentStep', 'getIfLivelinessStep']),

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
    ///

    checkIfOncainIdIsEnabled() {
      return this.getIfOncainIdStep.isEnabled
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

    checkIfzkProofIsEnabled() {
      return this.getIfzkProofStep.isEnabled
    },
    checkIfIdDocumentIsEnabled() {
      return this.getIfIdDocumentStep.isEnabled
    },
    checkIfUserConsentIsEnabled() {
      return this.getIfUserConsentStep.isEnabled
    },
    checkIfLivelinessIsEnabled() {
      return this.getIfLivelinessStep.isEnabled
    },
  },
  methods: {
    ...mapActions(['verifyResult']),
    ...mapMutations(['nextStep', 'previousStep', 'setUserPresentationConsent']),
    toast(msg, type = 'success') {
      this.isToast = true
      this.toastMessage = msg
      this.toastType = type

      setTimeout(() => {
        this.isToast = false
        this.toastMessage = ''
      }, 5000)
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
      } else if (eachCredential.type[1] === 'GovernmentIdCredential' && this.checkIfIdDocumentIsEnabled && !this.checkIfzkProofIsEnabled) {
        return true
      } else if (eachCredential.type[1] === 'PassportCredential' && this.checkIfIdDocumentIsEnabled && !this.checkIfzkProofIsEnabled) {
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
