import { STEP_NAMES } from '@/config'

export default {
  getFinalResult(state) {
    return state.finalResult
  },
  getIfOncainIdStep(state) {
    return state.steps.find((x) => x.stepName === STEP_NAMES.OnChainId)
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
}
