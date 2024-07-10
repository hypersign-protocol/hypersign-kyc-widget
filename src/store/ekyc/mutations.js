export default {
    setLivelinessDone(state, payload) {
        state.hasLivelinessDone = payload;
    },
    setSbtMintDone(state, payload) {
        state.hasSbtMintDone = payload;
    },
    setKycDone(state, payload) {
        state.hasKycDone = payload;
    },
    setKycExtractedData(state, payload) {
        state.kycExtractedData = payload.data;
        state.hasKycDone = payload.status;
    },
    setResult(state, payload) {
        state.finalResult = payload
    },
    setLivelinessResult(state, payload) {
        state.livelinessResult = { ...payload }
    },
    setOcrIdDocResult(state, payload) {
        state.ocrIDDocResult = { ...payload }
    },

    setLivelinessCapturedData(state, payload) {
        state.livelinessCapturedData = { ...payload }
    },

    setKycCapturedData(state, payload) {
        state.kycCapturedData = { ...payload }
    },

    setUserPresentationConsent(state, payload) {
        state.userPresentationConsent = payload;
    },

    setIdToken(state, payload) {
        state.idToken = payload;
    },


}