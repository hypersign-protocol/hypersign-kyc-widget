export default {
    clearAllLocalStore() {
        localStorage.removeItem('vaultDataRaw');
        localStorage.removeItem('mb-user-id');
        localStorage.removeItem('profile');
        localStorage.removeItem('vaultData');
        localStorage.removeItem('authServerAuthToken');
        localStorage.removeItem('vaultLockStatus');
        localStorage.removeItem('vaultLockStatus');
        localStorage.removeItem('vaultPin');
        localStorage.removeItem('onChainIssuerConfig');
    },



    setOnChainIssuerConfig: (state, payload) => {
        console.log(state.hasKycDone)
        localStorage.setItem("onChainIssuerConfig", JSON.stringify(payload))
    },
    setCosmosConnection: (state, payload) => {
        state.cosmosConnection = { ...payload };
    },
    setSteps: (state, payload) => {
        state.steps = payload
    },
    setAStep: (state, payload) => {
        let items = [...state.steps]; // create a new copy
        const stepIndex = items.findIndex(step => step.id === payload.id)

        // mutate it 
        items[stepIndex] = { ...payload }

        // return the new copy
        state.steps = items;
    },
    setTrustedSchemaIdsAndIssuers: (state, schemaIds) => {
        state.schemaIds = schemaIds
    },

    /* eslint-disable */
    nextStep: (state, jumpToStepId = null) => {
        const activeStep = state.steps.find(x => ((x.isActive == true) && (x.isEnabled == true)))
        let nextStepId = 0
        if (jumpToStepId) {
            nextStepId = jumpToStepId
        } else if (activeStep) {
            nextStepId = activeStep.id + 1
        }

        console.log({
            activeStep
        })

        state.steps[activeStep.id].isActive = false;
        state.steps[nextStepId].isActive = true;
        console.log({
            nextStep: state.steps[nextStepId]
        })
    },
    previousStep: (state) => {
        const activeStep = state.steps.find(x => (x.isActive == true))
        const previousStepId = activeStep.previous
        state.steps[activeStep.id].isActive = false;
        state.steps[previousStepId].isActive = true;
    },
    setAuthorization: (state, authorization) => {
        state.authorization = authorization
        localStorage.setItem('authorization', authorization)

    },

    setSession(state, payload) {
        console.log(state.hasKycDone)
        localStorage.setItem("session", payload)
    },

    setCavachAccessToken(state, payload) {
        console.log(state.kycCapturedData)
        localStorage.setItem("cavachAccessToken", payload)
    },
    setRedirectUrl(state, payload) {
        console.log(state.kycCapturedData)
        localStorage.setItem("redirectUrl", payload)
    },
    setPresentationRequest(state, payload) {
        console.log(state.kycCapturedData)
        localStorage.setItem("presentationRequest", payload)
    },

    setSSIAccessToken(state, payload) {
        console.log(state.kycCapturedData)

        localStorage.setItem("ssiAccessToken", payload)
    },

    setThridPartyAuth(state, payload) {
        state.authenticationAccessToken = { ...payload }
    },

    setProfile(state, payload) {
        console.log(state.hasKycDone)
        localStorage.setItem('profile', JSON.stringify(payload))
    },

    setAuthServerAuthToken(state, payload) {
        console.log(state.hasKycDone)
        localStorage.setItem("authServerAuthToken", payload)
    },

    setAsNewUser(state, payload) {
        console.log(state.hasKycDone)
        state.ifNewUser = payload;
    },

    setTenantSubdomain(state, payload) {
        console.log(state.hasKycDone)
        localStorage.setItem('subdomain', payload);
    },

    setIdDocumentLicenseKey(state, payload) {
        state.idDocumentLicenseKey = payload
    },

    setWidgetConfigFromDb: (state, payload) => {
        // state.widgetConfigFromDb = { ...payload }
        localStorage.setItem('widgetConfigFromDb', JSON.stringify(payload));
    },



}