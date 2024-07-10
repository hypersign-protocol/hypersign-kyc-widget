import { HYPERSIGN_SERVICE_BASE_URL_FORMAT } from '../../config'
export default {
    getActiveStep: (state) => {
        const step = state.steps.find(x => {
            if ((x.isActive === true) && (x.isEnabled === true)) {
                return x
            }
        })
        return step
    },
    //-----------------------------------------------------------------e-kyc
    getSession() {
        return localStorage.getItem("session")
    },
    getCavachAccessToken() {
        return localStorage.getItem("cavachAccessToken")
    },
    getRedirectUrl() {
        return localStorage.getItem("redirectUrl")
    },
    getAuthServerAuthToken() {
        return localStorage.getItem("authServerAuthToken")
    },

    getProfile() {
        const profileStr = localStorage.getItem('profile')
        if (profileStr) {
            return JSON.parse(profileStr)
        } else {
            return null
        }
    },
    getSSIAccessToken() {
        return localStorage.getItem("ssiAccessToken")
    },

    getTenantSubdomain() {
        return localStorage.getItem('subdomain');
    },

    getTenantKycServiceBaseUrl() {
        const subdomain = localStorage.getItem('subdomain');
        if (!subdomain) {
            throw new Error('Invalid accessToken')
        }
        return HYPERSIGN_SERVICE_BASE_URL_FORMAT.replace('<subdomain>', subdomain)
    },

    getPresentationRequest() {
        return localStorage.getItem("presentationRequest")
    },

    getPresentationRequestParsed() {
        const base64EncodedPr = localStorage.getItem("presentationRequest")
        const prStr = atob(base64EncodedPr)
        return JSON.parse(prStr)
    },

    getIdDocumentLicenseKey(state) {
        return state.idDocumentLicenseKey
    },

    getOnChainIssuerConfig: () => {
        const t = localStorage.getItem("onChainIssuerConfig")
        if (t) {
            return JSON.parse(t)
        } else {
            return null
        }
    },
    getWidgetConfigFromDb: (state) => {
        console.log(state.hasKycDone)
        const t = localStorage.getItem('widgetConfigFromDb');
        if (t) {
            return JSON.parse(t)
        } else {
            return null
        }
    }
}