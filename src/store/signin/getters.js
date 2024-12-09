import { HYPERSIGN_SERVICE_BASE_URL_FORMAT } from '../../config'
import SignStoreConfig from './config'
export default {
  getActiveStep: (state) => {
    const step = state.steps.find((x) => {
      if (x.isActive === true && x.isEnabled === true) {
        return x
      }
    })
    return step
  },
  getSession() {
    return localStorage.getItem(SignStoreConfig.LOCAL_STATES.SESSIONS)
  },
  getCavachAccessToken() {
    return localStorage.getItem(SignStoreConfig.LOCAL_STATES.KYC_ACCESS_TOKEN)
  },
  getRedirectUrl() {
    return localStorage.getItem(SignStoreConfig.LOCAL_STATES.REDIRECT_URL)
  },
  getProfile() {
    const profileStr = localStorage.getItem(SignStoreConfig.LOCAL_STATES.PROFILE)
    if (profileStr) {
      return JSON.parse(profileStr)
    } else {
      return null
    }
  },
  getSSIAccessToken() {
    return localStorage.getItem(SignStoreConfig.LOCAL_STATES.SSI_ACCESS_TOKEN)
  },

  getTenantSubdomain() {
    return localStorage.getItem(SignStoreConfig.LOCAL_STATES.SUBDOMAIN)
  },

  getTenantKycServiceBaseUrl() {
    const subdomain = localStorage.getItem(SignStoreConfig.LOCAL_STATES.SUBDOMAIN)
    if (!subdomain) {
      throw new Error('Invalid accessToken')
    }
    return HYPERSIGN_SERVICE_BASE_URL_FORMAT.replace('<subdomain>', subdomain)
  },

  getPresentationRequest() {
    return localStorage.getItem(SignStoreConfig.LOCAL_STATES.PR)
  },

  getPresentationRequestParsed() {
    const base64EncodedPr = localStorage.getItem(SignStoreConfig.LOCAL_STATES.PR)
    const prStr = atob(base64EncodedPr)
    return JSON.parse(prStr)
  },

  getIdDocumentLicenseKey(state) {
    return state.idDocumentLicenseKey
  },

  getOnChainIssuerConfig: () => {
    const t = localStorage.getItem(SignStoreConfig.LOCAL_STATES.ON_CHAIN_CONFIG)
    if (t) {
      return JSON.parse(t)
    } else {
      return null
    }
  },
  getWidgetConfigFromDb: (state) => {
    console.log(state.hasKycDone)
    const t = localStorage.getItem(SignStoreConfig.LOCAL_STATES.WIDGET_CONFIG)
    if (t) {
      return JSON.parse(t)
    } else {
      return null
    }
  },
}
