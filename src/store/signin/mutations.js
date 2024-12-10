import SignStoreConfig from './config'
import VaultStoreConfig from '../vault/config'

export default {
  NEXT_STEP(state, stepNumber = null) {
    const enabledSteps = state.steps.filter((step) => step.isEnabled)
    if (stepNumber !== null) {
      // Jump to specific step number (1-based index)
      const targetIndex = stepNumber
      if (targetIndex >= 0 && targetIndex < enabledSteps.length) {
        state.currentStepIndex = targetIndex
      }
    } else {
      // Default behavior: move to the next step
      if (state.currentStepIndex < enabledSteps.length - 1) {
        state.currentStepIndex++
      }
    }
  },
  PREVIOUS_STEP(state) {
    if (state.currentStepIndex > 0) {
      state.currentStepIndex--
    }
  },
  SET_STEP(state, step) {
    const index = state.steps.findIndex((s) => s.stepName === step && s.isEnabled)
    if (index !== -1) {
      state.currentStepIndex = index
    }
  },
  // Update the enabled state of a step
  UPDATE_STEP_STATE(state, payload) {
    const step = state.steps.find((s) => s.stepName === payload.stepName)
    if (step) {
      step.isEnabled = payload.isEnabled
    }
  },
  clearAllLocalStore() {
    localStorage.removeItem('mb-user-id')
    localStorage.removeItem(SignStoreConfig.LOCAL_STATES.PROFILE)
    localStorage.removeItem(SignStoreConfig.LOCAL_STATES.AUTH_SERVER_TOKEN)
    // localStorage.removeItem(SignStoreConfig.LOCAL_STATES.ON_CHAIN_CONFIG);

    // move these in store/vault module
    localStorage.removeItem(VaultStoreConfig.LOCAL_STATES.VAULT_DATA_RAW)
    localStorage.removeItem(VaultStoreConfig.LOCAL_STATES.VAULT_DATA)
    localStorage.removeItem(VaultStoreConfig.LOCAL_STATES.VAULT_LOCK)
    localStorage.removeItem('vault.vaultPin')
  },

  setOnChainIssuerConfig: (state, payload) => {
    console.log(state.hasKycDone)
    localStorage.setItem(SignStoreConfig.LOCAL_STATES.ON_CHAIN_CONFIG, JSON.stringify(payload))
  },
  setCosmosConnection: (state, payload) => {
    state.cosmosConnection = { ...payload }
  },
  setSteps: (state, payload) => {
    state.steps = payload
  },
  setTrustedSchemaIdsAndIssuers: (state, schemaIds) => {
    state.schemaIds = schemaIds
  },

  setAuthorization: (state, authorization) => {
    state.authorization = authorization
    localStorage.setItem(SignStoreConfig.LOCAL_STATES.AUTHORIZATION, authorization)
  },

  setSession(state, payload) {
    console.log(state.hasKycDone)
    localStorage.setItem(SignStoreConfig.LOCAL_STATES.SESSIONS, payload)
  },

  setCavachAccessToken(state, payload) {
    console.log(state.kycCapturedData)
    localStorage.setItem(SignStoreConfig.LOCAL_STATES.KYC_ACCESS_TOKEN, payload)
  },
  setRedirectUrl(state, payload) {
    console.log(state.kycCapturedData)
    localStorage.setItem(SignStoreConfig.LOCAL_STATES.REDIRECT_URL, payload)
  },
  setPresentationRequest(state, payload) {
    console.log(state.kycCapturedData)
    localStorage.setItem(SignStoreConfig.LOCAL_STATES.PR, payload)
  },

  setSSIAccessToken(state, payload) {
    console.log(state.kycCapturedData)
    localStorage.setItem(SignStoreConfig.LOCAL_STATES.SSI_ACCESS_TOKEN, payload)
  },

  setThridPartyAuth(state, payload) {
    state.authenticationAccessToken = { ...payload }
  },

  setProfile(state, payload) {
    console.log(state.hasKycDone)
    localStorage.setItem(SignStoreConfig.LOCAL_STATES.PROFILE, JSON.stringify(payload))
  },

  setAsNewUser(state, payload) {
    console.log(`Inside setAsNewUser ${state.hasKycDone}`)
    state.ifNewUser = payload
  },

  setTenantSubdomain(state, payload) {
    console.log(state.hasKycDone)
    localStorage.setItem(SignStoreConfig.LOCAL_STATES.SUBDOMAIN, payload)
  },

  setIdDocumentLicenseKey(state, payload) {
    state.idDocumentLicenseKey = payload
  },

  setWidgetConfigFromDb: (state, payload) => {
    // state.widgetConfigFromDb = { ...payload }
    localStorage.setItem(SignStoreConfig.LOCAL_STATES.WIDGET_CONFIG, JSON.stringify(payload))
  },
}
