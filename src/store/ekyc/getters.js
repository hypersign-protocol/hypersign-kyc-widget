import { STEP_NAMES } from '@/config'

export default {
  getFinalResult(state) {
    return state.finalResult
  },
  getIfzkProofStep(state) {
    return state.steps.find((x) => x.stepName === STEP_NAMES.ZkProofs)
  },
  getIfIdDocumentStep(state) {
    return state.steps.find((x) => x.stepName === STEP_NAMES.IdDocs)
  },
  getIfUserConsentStep(state) {
    return state.steps.find((x) => x.stepName === STEP_NAMES.UserConsent)
  },
  getIfLivelinessStep(state) {
    return state.steps.find((x) => x.stepName === STEP_NAMES.LiveLiness)
  },
  // Checking ....
  checkIfOncainIdIsEnabled(state, getters) {
    if (getters.getWidgetConfigFromDb.onChainId.enabled) {
      return true
    } else return false
  },
  checkIfIdDocumentIsEnabled(state, getters) {
    if (getters.getWidgetConfigFromDb.idOcr.enabled) {
      return true
    } else return false
  },
  checkIfLivelinessIsEnabled(state, getters) {
    if (getters.getWidgetConfigFromDb.faceRecog.enabled) {
      return true
    } else return false
  },
  checkIfzkProofIsEnabled(state, getters) {
    if (getters.getWidgetConfigFromDb.zkProof?.enabled) {
      return true
    } else return false
  },
  checkIfUserConsentIsEnabled(state, getters) {
    if (getters.getWidgetConfigFromDb.userConsent.enabled) {
      return true
    } else return false
  },
}
