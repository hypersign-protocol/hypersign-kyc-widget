<template>
  <div class="signin-container">
    <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></load-ing>

    <!-- Header Section -->
    <div class="header-section">
      <div class="logo-container">
        <img :src="getWidgetConfigFromDb?.userConsent?.logoUrl" class="logo" v-if="getWidgetConfigFromDb?.userConsent?.logoUrl" />
        <div class="logo-placeholder" v-else>H</div>
      </div>
      <h1 class="main-title" v-if="getWidgetConfigFromDb?.serviceName">Verification for {{ getWidgetConfigFromDb?.serviceName }}</h1>
      <h1 class="main-title" v-else>Verification for Verifier App</h1>
    </div>

    <!-- Content Section -->
    <div class="content-section">
      <p class="description" v-if="getWidgetConfigFromDb?.serviceName">
        You are about to share your personal data with <strong>{{ getWidgetConfigFromDb?.serviceName }}</strong> for identity verification.
      </p>
      <p class="description" v-else>You are about to share your personal data with <strong>hypersign-kyc-demo.netlify.app</strong> for identity verification.</p>
      <!-- Data Collection Box -->
      <div class="data-box">
        <div class="box-header">
          <div class="info-icon">
            <i class="bi bi-info-circle"></i>
          </div>
          <span class="box-title">Data Collection</span>
        </div>
        <div class="box-content">
          <p>The following information will be collected:</p>
          <ul class="box-list">
            <li>A selfie (used for face verification)</li>
            <li>A government-issued identity document</li>
            <li>Your basic personal details such as full name, date of birth, and gender</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Action Section -->
    <div class="action-section">
      <ConsentBox @consent-changed="onConsentChanged" />
      <GoogleButton :is-disable="error || !isConsentChecked" />
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapGetters, mapState } from 'vuex'
// import ConnectWalletButton from '../commons/authButtons/ConnectWalletButton.vue';
import GoogleButton from '../commons/authButtons/GoogleButton.vue'
import WidgetConfig from '../utils/widget.config'
import { STEP_NAMES } from '@/config'
import MESSAGE from '../utils/lang/en'
import SignStoreConfig from '@/store/signin/config'
import { EVENT, EVENTS } from '../utils/eventBus'
export default {
  name: STEP_NAMES.SignIn,
  computed: {
    ...mapGetters(['getCavachAccessToken', 'getSSIAccessToken', 'getRedirectUrl', 'getPresentationRequest', 'getOnChainIssuerConfig', 'getWidgetConfigFromDb', 'getSession']),
    ...mapState(['hasLivelinessDone', 'hasKycDone']),
  },
  components: {
    // ConnectWalletButton,
    GoogleButton,
  },
  data() {
    return {
      isConsentChecked: false,
      isLoading: false,
      fullPage: true,
      toastMessage: '',
      toastType: 'success',
      isToast: false,
      error: false,
      pr: '',
    }
  },
  methods: {
    ...mapMutations(['setCavachAccessToken', 'setRedirectUrl', 'nextStep', 'setPresentationRequest', 'setTenantSubdomain', 'setSession', 'setSSIAccessToken', 'setOnChainIssuerConfig']),
    ...mapActions(['getNewSession', 'getOnChainConfigByIdAction', 'fetchAppsWidgetConfig']),
    myEventListener(data) {
      if (data.status === 'success') {
        this.$router.push(`/auth/${data.provider}`)
      } else {
        this.error = true
        throw new Error(MESSAGE.SIGN.AUTH_PROVIDER_ERR + data.provider)
      }
    },
    toast(msg, type = 'success') {
      EVENT.emitEvent(
        EVENTS.NOTIFY,
        JSON.stringify({
          toastMessage: msg,
          toastType: type,
        })
      )
    },
    parseJwt(token) {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
          })
          .join('')
      )

      return JSON.parse(jsonPayload)
    },
    async validationForOnChainIdConfig() {
      this.isLoading = true
      const onChainIssuerConfigs = []
      if (this.getWidgetConfigFromDb.onChainId.enabled) {
        const onchainIdConfiguration = this.getWidgetConfigFromDb.onChainId.selectedOnChainKYCconfiguration
        if (!onchainIdConfiguration) {
          if (this.getOnChainIssuerConfig.chainId === '' || this.getOnChainIssuerConfig.ecosystem === '' || this.getOnChainIssuerConfig.blockchain === '' || this.getOnChainIssuerConfig.contractAddress === '') {
            this.error = true
            throw new Error('Incorrect configuration for onchainId')
          }
          throw new Error('Incorrect configuration: OnChainConfig Id must be passed for onchainId step')
        }
        for (let i = 0; i < onchainIdConfiguration.length; i++) {
          const onchainconfig = await this.getOnChainConfigByIdAction(onchainIdConfiguration[i])
          const { blockchainLabel, kycContractAddress, sbtContractAddress } = onchainconfig

          // chainID format: <ecosystem>:<blockchain>:<chainId>
          //  e.g: cosmos:comdex:localnet-1
          //  e.g: evm:polygon:134
          //  e.g: cosmos:nibiru:nibi-localnet-1
          const chainIdComponents = blockchainLabel.split(':')
          // at 0: ecosystem
          // at 1: blockchain
          // at 2: chainId

          onChainIssuerConfigs.push({
            id: onchainIdConfiguration[i],
            ecosystem: chainIdComponents[0],
            blockchain: chainIdComponents[1],
            chainId: chainIdComponents[2],
            contractAddress: kycContractAddress,
            sbtContractAddress,
            masterWalletAddress: onchainconfig?.options?.masterWalletAddress,
            name: chainIdComponents[1] + ':' + chainIdComponents[2],
          })
        }

        this.setOnChainIssuerConfig(onChainIssuerConfigs)
      } else {
        // this.toast(MESSAGE.SIGN.ONCHAIN_CONFIG_NOT_FOUND_ERR, 'warning')
        // Warning: ONCHAIN_CONFIG_NOT_FOUND_ERR
      }
      this.isLoading = false
    },
    preparePresentationRequest() {
      if (!this.getWidgetConfigFromDb) {
        throw new Error(MESSAGE.SIGN.WIDGET_CONFIG_ERR)
      }
      const presentationRequest = {
        query: [
          {
            type: 'QueryByExample',
            credentialQuery: [
              {
                example: {
                  type: 'PersonhoodCredential',
                  credentialSchema: {
                    id: WidgetConfig.schemaIds.PersonhoodCredential.schemaId,
                  },
                },
                trustedIssuer: [
                  {
                    required: true,
                    issuer: WidgetConfig.schemaIds.PassportCredential.issuer,
                  },
                ],
              },
            ],
          },
          {
            type: 'QueryByExample',
            credentialQuery: [
              {
                example: {
                  type: 'PassportCredential',
                  credentialSchema: {
                    id: WidgetConfig.schemaIds.PassportCredential.schemaId,
                  },
                },
                trustedIssuer: [
                  {
                    required: true,
                    issuer: WidgetConfig.schemaIds.PassportCredential.issuer,
                  },
                ],
              },
            ],
          },
          {
            type: 'QueryByExample',
            credentialQuery: [
              {
                example: {
                  type: 'SBTCredential',
                  credentialSchema: {
                    id: WidgetConfig.schemaIds.SBTCredential.schemaId,
                  },
                },
                trustedIssuer: [
                  {
                    required: true,
                    issuer: WidgetConfig.schemaIds.SBTCredential.issuer,
                  },
                ],
              },
            ],
          },
        ],
        reason: this.getWidgetConfigFromDb.userConsent.reason,
        issuerDID: this.getWidgetConfigFromDb.issuerDID,
        issuerDIDVerificationMethod: this.getWidgetConfigFromDb.issuerVerificationMethodId,
        domain: this.getWidgetConfigFromDb.userConsent.domain,
        logoUrl: this.getWidgetConfigFromDb.userConsent.logoUrl,
      }
      const presentationRequestStr = JSON.stringify(presentationRequest)
      this.pr = btoa(presentationRequestStr)
    },

    validatePresentationRequest() {
      this.preparePresentationRequest()
      if (!this.pr) {
        if (this.getPresentationRequest !== '') {
          throw new Error(MESSAGE.SIGN.WIDGET_INIT_ERR)
        }
      }

      this.setPresentationRequest(this.pr || this.getPresentationRequest)
    },

    validationForAccessTokens() {
      const params = this.$route.query

      if (!params.kycAccessToken || !params.ssiAccessToken) {
        if (this.getCavachAccessToken === '' && this.getSSIAccessToken === '') {
          throw new Error(MESSAGE.SIGN.INVALID_ACCESS_TOKEN)
        }
      }

      const kycAccessToken = params.kycAccessToken || this.getCavachAccessToken
      const ssiAccessToken = params.ssiAccessToken || this.getSSIAccessToken
      this.setCavachAccessToken(kycAccessToken)
      this.setSSIAccessToken(ssiAccessToken)

      const parsedAccessToken = this.parseJwt(kycAccessToken)
      this.setTenantSubdomain(parsedAccessToken.subdomain)
    },

    async validationSessionId() {
      const params = this.$route.query
      if (localStorage.getItem('forgotPassword')) {
        params.sessionId = localStorage.getItem(SignStoreConfig.LOCAL_STATES.SESSIONS)
        localStorage.removeItem('forgotPassword')
      }
      if (!params.sessionId) {
        if (this.getSession !== '') {
          this.isLoading = true
          await this.getNewSession()
          this.isLoading = false
          return
        }
      }
      this.setSession(params.sessionId)
    },
    onConsentChanged(value) {
      this.isConsentChecked = value
    },
  },
  async created() {
    try {
      // validation of access tokens
      this.validationForAccessTokens()

      /// /  Mandatory validations of params dapps passed in the widget url
      await this.validationSessionId()

      await this.fetchAppsWidgetConfig()

      this.validatePresentationRequest()

      // validation of onchainId params, if enabled
      this.validationForOnChainIdConfig()

      /// // service provider has to set the session...
      // this.isLoading = true;
      // await this.getNewSession()
      // this.isLoading = false;
      this.toast(MESSAGE.SIGN.WIDGET_READY_TO_USE, 'success')
    } catch (e) {
      this.error = true
      if (e.message?.indexOf('jwt') === 0) {
        this.toast(MESSAGE.SIGN.TOKEN_EXPIRED, 'error')
        this.isLoading = false
        return
      }
      this.toast(e.message, 'error')
      this.isLoading = false
    }
  },
}
</script>
<style scoped>
.signin-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
  background-color: #ffffff;
}

/* Header Section */
.header-section {
  text-align: center;
  margin-bottom: 24px;
}

.logo-container {
  margin-bottom: 12px;
}

.logo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.logo-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #000000;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  margin: 0 auto;
}

.main-title {
  font-size: 18px;
  font-weight: 600;
  color: #000000;
  margin: 0;
  line-height: 1.3;
}

/* Content Section */
.content-section {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.description {
  font-size: 12px;
  color: #666666;
  line-height: 1.5;
  margin-bottom: 20px;
  text-align: left;
}

/* Data Collection Box */
.data-box {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
  color: #333333;
}

.box-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.info-icon {
  width: 20px;
  height: 20px;
  background-color: #6c757d;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
}

.info-icon i {
  font-size: 12px;
  color: #ffffff;
}

.box-title {
  font-size: 14px;
  font-weight: 600;
  color: #333333;
}

.box-content p {
  font-size: 13px;
  color: #666666;
  margin-bottom: 8px;
  font-weight: 500;
  text-align: left;
}

.box-list {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
}

.box-list li {
  font-size: 12px;
  color: #666666;
  margin-bottom: 4px;
  padding-left: 12px;
  position: relative;
  line-height: 1.4;
}

.box-list li:before {
  content: '•';
  position: absolute;
  left: 0;
  color: #6c757d;
  font-weight: bold;
}

/* Action Section */
.action-section {
  margin-top: 16px;
}

.widget-card-width {
  width: 100%;
  margin: auto;
}

@media (max-width: 450px) {
  .signin-container {
    padding: 16px;
  }

  .main-title {
    font-size: 16px;
  }

  .description {
    font-size: 12px;
  }

  .data-box {
    padding: 12px;
  }

  .box-title {
    font-size: 13px;
  }

  .box-content p {
    font-size: 12px;
  }

  .box-list li {
    font-size: 11px;
  }
}

@media (max-width: 200px) {
  .widget-card-width {
    width: 100%;
  }
}
</style>
