import { RequestHandler } from '../../components/utils/utils';
import { EVENT, EVENTS } from '../../components/utils/eventBus';

export default {
    //TODO: Change name of this method to somethin liek, submitUserConsent()
    verifyResult: ({ commit, getters, state }) => {

        return new Promise(async (resolve, reject) => { // eslint-disable-line
            if (Object.keys(state.userPresentationConsent).length <= 0) {
                return reject(new Error('No user consent found'))
            }

            try {
                const url = `${getters.getTenantKycServiceBaseUrl}/e-kyc/verification/user-consent`;
                const headers = {
                    'Authorization': 'Bearer ' + getters.getCavachAccessToken,
                }
                headers['X-AuthServer-Access-Token'] = getters.getAuthServerAuthToken;
                const body = {
                    sessionId: getters.getSession,
                    presentation: state.userPresentationConsent
                }
                const json = await RequestHandler(url, 'POST', body, headers)
                if (json && json.success == true) {
                    commit('setResult', json.success);
                    commit('setIdToken', json.idToken);
                    resolve(json)
                } else {
                    return reject(new Error(json))
                }

            } catch (e) {
                reject(new Error(`Error verifying the user consent  ${e}`))
            }
        })
    },

    verifyLiveliness: ({ commit, state, getters, dispatch }) => {
        return new Promise(async (resolve, reject) => { // eslint-disable-line
            if (state.livelinessCapturedData.tokenSelfiImage === "" || !state.hasLivelinessDone) {
                return reject('User has not performed liveliness check')
            }
            try {
                const url = `${getters.getTenantKycServiceBaseUrl}/e-kyc/verification/passive-liveliness`;
                const headers = {
                    'Authorization': 'Bearer ' + getters.getCavachAccessToken,
                    'x-ssi-access-token': getters.getSSIAccessToken,
                    'x-issuer-did': getters.getPresentationRequestParsed.issuerDID,
                    'x-issuer-did-ver-method': getters.getPresentationRequestParsed.issuerDIDVerificationMethod
                };
                headers['X-AuthServer-Access-Token'] = getters.getAuthServerAuthToken;
                const body = {
                    sessionId: getters.getSession,
                    tokenSelfiImage: state.livelinessCapturedData.tokenSelfiImage,
                    biometricTemplateRaw: state.livelinessCapturedData.biometricTemplateRaw,
                    bestImageTokenized: state.livelinessCapturedData.bestImageTokenized,
                    userDID: getters.getUserDID
                }
                const json = await RequestHandler(url, 'POST', body, headers)

                if (json && json.serviceLivenessResult === 3) {
                    commit('setLivelinessResult', json);
                    if (json.credential) await dispatch('updateVaultCredentials', json.credential);
                    return resolve(json)
                } else {
                    return reject(new Error(json))
                }

            } catch (e) {
                reject(new Error(`Error verifying liveliness check  ${e}`))
            }
        })
    },

    // eventSource -----
    verifyLivelinessStatus(
        { getters }
    ) {
        const sessionId = getters.getSession
        const url = `${getters.getTenantKycServiceBaseUrl}/e-kyc/verification/passive-liveliness/status/` + sessionId;
        const eventSource = new EventSource(url + '?' + `authorization=Bearer ${getters.getCavachAccessToken}`, {})
        eventSource.onopen = function (event) {
            console.log('Connection opened', event);
        };
        eventSource.onmessage = function (event) {
            console.log('New message:', event.data);
            let payload = {
                success: true,
                message: event.data
            }
            if (event.data.includes("not generated") || event.data.includes("completed")) {
                eventSource.close()
            }

            if (event.data.includes("error")) {
                payload.success = false;
                eventSource.close()
            }
            EVENT.emitEvent(EVENTS.LIVELINESS, payload);

        };
        eventSource.onerror = function (error) {
            console.error('EventSource failed:', error);
            eventSource.close()
        };
    },
    // ---------------


    verifyOcrIDDoc: ({ commit, state, getters, dispatch }) => {
        return new Promise(async (resolve, reject) => { // eslint-disable-line
            if (state.kycCapturedData.tokenFrontDocumentImage === "" || !state.hasKycDone) {
                return reject('User has not performed ID capturing')
            }

            if (!state.livelinessCapturedData.bestImageTokenized) {
                return reject('User has not performed Facial recognition')
            }
            try {
                const url = `${getters.getTenantKycServiceBaseUrl}/e-kyc/verification/doc-ocr`;
                const headers = {
                    'Authorization': 'Bearer ' + getters.getCavachAccessToken,
                    'x-ssi-access-token': getters.getSSIAccessToken,
                    'x-issuer-did': getters.getPresentationRequestParsed.issuerDID,
                    'x-issuer-did-ver-method': getters.getPresentationRequestParsed.issuerDIDVerificationMethod
                };
                headers['X-AuthServer-Access-Token'] = getters.getAuthServerAuthToken;
                const body = {
                    documentType: 0,
                    tokenFrontDocumentImage: state.kycCapturedData.tokenFrontDocumentImage,
                    bestImageTokenized: state.livelinessCapturedData.bestImageTokenized,
                    tokenFaceImage: state.livelinessCapturedData.tokenSelfiImage || state.livelinessCapturedData.base64Image,
                    countryCode: state.kycCapturedData.countryCode,
                    sessionId: getters.getSession,
                    userDID: getters.getUserDID,
                    ocr: { ...state.kycExtractedData.extractionRaw.ocr }
                }
                const json = await RequestHandler(url, 'POST', body, headers)
                if (json && json.serviceFacialAuthenticationResult === 3) {
                    commit('setOcrIdDocResult', json);
                    if (json.credentials && json.credentials.length > 0) {
                        json.credentials.forEach(credential => {
                            console.log('Updating each credentila in vault credential id ' + credential.id)
                            dispatch('updateVaultCredentials', credential);
                        })
                    }
                    return resolve(json)
                } else {
                    return reject(new Error(json))
                }

            } catch (e) {
                return reject(new Error('Error verifying ID document ' + e.message))
            }
        })
    },

    // eventSource -----
    verifyOCRDocStatus(
        { getters }
    ) {
        const sessionId = getters.getSession
        const url = `${getters.getTenantKycServiceBaseUrl}/e-kyc/verification/doc-ocr/status/` + sessionId;
        const eventSource = new EventSource(url + '?' + `authorization=Bearer ${getters.getCavachAccessToken}`, {})
        eventSource.onopen = function (event) {
            console.log('Connection opened', event);
        };
        eventSource.onmessage = function (event) {
            console.log('New message:', event.data);
            let payload = {
                success: true,
                message: event.data
            }
            if (event.data.includes("not generated") || event.data.includes("completed")) {
                eventSource.close()
            }

            if (event.data.includes("error")) {
                payload.success = false;
                eventSource.close()
            }
            EVENT.emitEvent(EVENTS.IDDOCOCR, payload);

        };
        eventSource.onerror = function (error) {
            console.error('EventSource failed:', error);
            eventSource.close()
        };
    },
    // ---------------


    verifySbtMint: ({ commit, getters, dispatch }, payload) => {
        return new Promise(async (resolve, reject) => { // eslint-disable-line
            try {
                const url = `${getters.getTenantKycServiceBaseUrl}/e-kyc/verification/sbt-mint`;
                const headers = {
                    'Authorization': 'Bearer ' + getters.getCavachAccessToken,
                    'x-ssi-access-token': getters.getSSIAccessToken,
                    'x-issuer-did': getters.getPresentationRequestParsed.issuerDID,
                    'x-issuer-did-ver-method': getters.getPresentationRequestParsed.issuerDIDVerificationMethod
                };
                headers['X-AuthServer-Access-Token'] = getters.getAuthServerAuthToken;
                const body = {
                    sessionId: getters.getSession,
                    userDID: getters.getUserDID,
                    sbtData: {
                        ...payload
                    }
                }

                const json = await RequestHandler(url, 'POST', body, headers)
                if (json.credentials && json.credentials.length > 0) {
                    commit('setSbtMintDone', true);
                    json.credentials.forEach(credential => {
                        console.log('Updating each credentila in vault credential id ' + credential.id)
                        dispatch('updateVaultCredentials', credential);
                    })
                    return resolve(json)
                } else {
                    return reject(new Error(json));
                }
            } catch (e) {
                reject(new Error(`Verifying the sbt mint result  ${e}`))
            }
        })
    },

}