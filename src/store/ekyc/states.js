export default {
    hasLivelinessDone: false,
    hasKycDone: false,
    hasSbtMintDone: false,
    kycExtractedData: {},
    finalResults: false,
    livelinessResult: {},
    ocrIDDocResult: {},
    extractionToken:{},
    finalResult: {},
    livelinessCapturedData: {
        tokenSelfiImage: "",
        biometricTemplateRaw: "",
        bestImageTokenized: ""
    },
    kycCapturedData: {
        tokenFrontDocumentImage: "",
        tokenBackDocumentImage:"",
        tokenFaceImage: "",
        countryCode: "",
    },
    userPresentationConsent: {},
}