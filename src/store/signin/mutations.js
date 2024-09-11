
import SignStoreConfig from './config'
import VaultStoreConfig from '../vault/config'

export default {
    clearAllLocalStore() {
        localStorage.removeItem('mb-user-id');
        localStorage.removeItem(SignStoreConfig.LOCAL_STATES.PROFILE);
        localStorage.removeItem(SignStoreConfig.LOCAL_STATES.AUTH_SERVER_TOKEN);
        localStorage.removeItem(SignStoreConfig.LOCAL_STATES.ON_CHAIN_CONFIG);



        // move these in store/vault module
        localStorage.removeItem(VaultStoreConfig.LOCAL_STATES.VAULT_DATA_RAW);
        localStorage.removeItem(VaultStoreConfig.LOCAL_STATES.VAULT_DATA);
        localStorage.removeItem(VaultStoreConfig.LOCAL_STATES.VAULT_LOCK);
        localStorage.removeItem('vault.vaultPin');
    },



    setOnChainIssuerConfig: (state, payload) => {
        console.log(state.hasKycDone)
        localStorage.setItem(SignStoreConfig.LOCAL_STATES.ON_CHAIN_CONFIG, JSON.stringify(payload))
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
        state.ifNewUser = payload;
    },

    setTenantSubdomain(state, payload) {
        console.log(state.hasKycDone)
        localStorage.setItem(SignStoreConfig.LOCAL_STATES.SUBDOMAIN, payload);
    },

    setIdDocumentLicenseKey(state, payload) {
        state.idDocumentLicenseKey = payload
    },

    setWidgetConfigFromDb: (state, payload) => {
        // state.widgetConfigFromDb = { ...payload }
        localStorage.setItem(SignStoreConfig.LOCAL_STATES.WIDGET_CONFIG, JSON.stringify(payload));
    },



}