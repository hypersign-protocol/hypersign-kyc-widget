import Vue from 'vue'
import Vuex from 'vuex'
import { KAVACH_SERVER_BASE_URL, ENTITY_API_BASE_URL, ENTITY_APP_SERCRET, HYPERSIGN_SERVICE_BASE_URL_FORMAT } from '../config'
import { decrypt, encrypt } from '../../src/components/utils/symmetricCrypto'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        qrString: "",
        phoneNumber: "",
        finalResult: {},
        aadharData: {},
        authorization: null,
        steps: [],
        // Trusted issuer and schemas
        schemaIds: {},
        //-----------------------------------------------------------------e-kyc
        hasLivelinessDone: false,
        hasKycDone: false,
        kycExtractedData: {},
        finalResults: false,
        livelinessResult: {},
        ocrIDDocResult: {},
        livelinessCapturedData: {
            tokenSelfiImage: ""
        },
        kycCapturedData: {
            tokenFrontDocumentImage: "",
            tokenFaceImage: "",
            countryCode: "",
        },

        // --- 
        authenticationAccessToken: {},
        ifNewUser: false,
        userPresentationConsent: {},
        idToken: "",
        idDocumentLicenseKey: "",
    },
    getters: {
        getActiveStep: (state) => {
            const step = state.steps.find(x => x.isActive == true)
            if (!step) {
                const step = state.steps.find(x => x.isActive == true)
                return step
            }
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
        getFinalResult(state) {
            return state.finalResult
        },

        getProfile() {
            const profileStr = localStorage.getItem('profile')
            if (profileStr) {
                return JSON.parse(profileStr)
            } else {
                return null
            }
        },


        // ---------------------------------------------------------------- User vault
        getVaultPin() {
            return localStorage.getItem('vaultPin')
        },
        getVaultLockStatus() {
            return localStorage.getItem('vaultLockStatus')
        },
        getVaultData() {
            return localStorage.getItem('vaultData')
        },
        getVaultDataRaw() {
            const vaultDataRawStr = localStorage.getItem('vaultDataRaw')
            return JSON.parse(vaultDataRawStr)
        },

        getVaultDataCredentials(filterCondition = {}) {
            console.log('filterCondition =' + filterCondition)
            const vaultDataRawStr = localStorage.getItem('vaultDataRaw')
            const vaultDataRaw = JSON.parse(vaultDataRawStr)
            const { hypersign } = vaultDataRaw
            const { credentials } = hypersign
            return credentials;
        },

        getUserDID() {
            // TODO check if user vault is unlocked 
            const vaultDataRawStr = localStorage.getItem('vaultDataRaw')
            if (vaultDataRawStr) {
                const vaultDataRaw = JSON.parse(vaultDataRawStr)

                const { hypersign } = vaultDataRaw
                if (hypersign) {
                    return hypersign.did
                }
            }
        },

        getPresentationRequest() {
            return localStorage.getItem("presentationRequest")
        },
        getSSIAccessToken() {
            return localStorage.getItem("ssiAccessToken")
        },
        getPresentationRequestParsed() {
            const base64EncodedPr = localStorage.getItem("presentationRequest")
            const prStr = atob(base64EncodedPr)
            return JSON.parse(prStr)
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

        getIdDocumentLicenseKey(state) {
            return state.idDocumentLicenseKey
        }
    },
    mutations: {

        setSteps: (state, steps) => {
            state.steps = steps
        },

        setTrustedSchemaIdsAndIssuers: (state, schemaIds) => {
            state.schemaIds = schemaIds
        },

        nextStep: (state, jumpToStepId = null) => {
            const activeStep = state.steps.find(x => x.isActive == true)
            const nextStepId = jumpToStepId ? jumpToStepId : activeStep.id + 1;
            state.steps[activeStep.id].isActive = false;
            state.steps[nextStepId].isActive = true;
        },

        previousStep: (state) => {
            const activeStep = state.steps.find(x => x.isActive == true)
            const previousStepId = activeStep.previous
            state.steps[activeStep.id].isActive = false;
            state.steps[previousStepId].isActive = true;
        },
        setAuthorization: (state, authorization) => {
            state.authorization = authorization
            localStorage.setItem('authorization', authorization)

        },
        setQrString: (state, qrString) => {
            state.qrString = qrString;
        },
        setImage: (state, imageData) => {
            state.imageData = imageData;
        },


        setPhoneNumber: (state, phoneNumber) => {
            state.phoneNumber = phoneNumber;
        },

        setFinalResult: (state, result) => {
            state.finalResult = { ...result };
        },

        setAadhaarData: (state, aadharData) => {
            state.aadharData = { ...aadharData };
        },

        //-----------------------------------------------------------------e-kyc
        setLivelinessDone(state, payload) {
            state.hasLivelinessDone = payload;
        },
        setKycDone(state, payload) {
            state.hasKycDone = payload;
        },
        setSession(state, payload) {
            console.log(state.hasKycDone)
            localStorage.setItem("session", payload)
        },
        setKycExtractedData(state, payload) {
            state.kycExtractedData = payload.data;
            state.hasKycDone = payload.status;
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

        // ---
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


        // --- vault
        setVaultPin(state, payload) {
            console.log(state.hasKycDone)
            localStorage.setItem('vaultPin', payload)
        },

        setVaultData(state, payload) {
            console.log(state.hasKycDone)
            localStorage.setItem('vaultData', payload)
        },

        setVaultRaw(state, payload) {
            console.log(state.hasKycDone)
            localStorage.setItem('vaultDataRaw', payload)
        },

        setVaultLockStatus(state, payload) {
            console.log(state.hasKycDone)
            localStorage.setItem('vaultLockStatus', payload)
        },

        setAsNewUser(state, payload) {
            console.log(state.hasKycDone)
            state.ifNewUser = payload;
        },

        setUserPresentationConsent(state, payload) {
            state.userPresentationConsent = payload;
        },

        setIdToken(state, payload) {
            state.idToken = payload;
        },

        setTenantSubdomain(state, payload) {
            console.log(state.hasKycDone)
            localStorage.setItem('subdomain', payload);
        },

        setIdDocumentLicenseKey(state, payload) {
            state.idDocumentLicenseKey = payload
        }
    },
    actions: {
        addharQRVerify: ({ state }) => {
            return new Promise((resolve, reject) => {
                console.log('Inside addharQRVerify')
                const url = KAVACH_SERVER_BASE_URL + '/api/v1/aadhaar/qr/verify'
                fetch(url, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: state.authorization,
                    },
                    body: JSON.stringify({
                        qrString: state.qrString

                    })
                }).then(resp => {
                    return resp.json()
                }).then(json => {
                    if (json.statusCode == 400) {
                        throw new Error('Bad Request ' + json.message.toString())
                    }
                    resolve(json)
                }).catch(e => {
                    reject(e.message)
                })
            })
        },
        setJWT: ({
            commit
        }) => {
            return new Promise((resolve, reject) => {

                const url = ENTITY_API_BASE_URL + '/api/v1/app/oauth'
                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Api-Secret-Key': ENTITY_APP_SERCRET
                    },
                    body: undefined
                }).then(resp => {
                    return resp.json()
                }).then(json => {
                    if (json.statusCode == 400) {
                        throw new Error('Bad Request ' + json.message.toString())
                    }
                    commit('setAuthorization', 'Bearer ' + json.access_token)
                    resolve()
                }).catch(e => {
                    reject(e.message)
                    localStorage.removeItem('authorization')
                })


            }

            )
        },
        setSession: ({
            state

        }) => {
            return new Promise((resolve, reject) => {
                console.log('Inside addharQRVerify')
                const url = KAVACH_SERVER_BASE_URL + '/api/v1/aadhaar/session'
                fetch(url, {
                    method: 'POST',
                    credentials: 'include',

                    headers: {
                        'content-type': 'application/json',
                        Authorization: state.authorization,

                    },
                    body: undefined
                }).then(resp => {
                    return resp.json()
                }).then(json => {

                    if (json.statusCode == 400) {
                        throw new Error('Bad Request ' + json.message.toString())
                    }
                    resolve(json)
                }).catch(e => {
                    reject(e.message)
                })
            })
        },

        verifyPhoneNumber: ({ state }) => {
            return new Promise((resolve, reject) => {
                console.log('Inside addharQRVerify')
                const url = KAVACH_SERVER_BASE_URL + '/api/v1/aadhaar/ph/verify'
                fetch(url, {
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify({
                        phoneNumber: state.phoneNumber
                    }),
                    headers: {
                        'content-type': 'application/json',
                        Authorization: state.authorization,

                    }
                }).then(resp => {
                    return resp.json()
                }).then(json => {
                    if (json.statusCode == 400) {
                        throw new Error('Bad Request ' + json.message.toString())
                    }
                    resolve(json)
                }).catch(e => {
                    reject(e.message)
                })
            })
        },

        verifyImage: ({ state }) => {
            return new Promise((resolve, reject) => {
                console.log('Inside verifyImage')
                const url = KAVACH_SERVER_BASE_URL + '/api/v1/aadhaar/img/verify'
                fetch(url, {
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify({
                        userImage: state.imageData
                    }),
                    headers: {
                        'content-type': 'application/json',
                        Authorization: state.authorization,

                    }
                }).then(resp => {
                    return resp.json()
                }).then(json => {
                    if (json.statusCode == 400) {
                        throw new Error('Bad Request ' + json.message.toString())
                    }
                    resolve(json)
                }).catch(e => {
                    reject(e.message)
                })
            })
        },

        getFinalResult: ({ state }) => {
            return new Promise((resolve, reject) => {
                console.log('Inside addharQRVerify')
                const url = KAVACH_SERVER_BASE_URL + '/api/v1/aadhaar/result'
                fetch(url, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        Authorization: state.authorization,
                        'content-type': 'application/json',

                    }
                }).then(resp => {
                    return resp.json()
                }).then(json => {
                    if (json.statusCode == 400) {
                        throw new Error('Bad Request ' + json.message.toString())
                    }
                    resolve(json)
                }).catch(e => {
                    reject(e.message)
                })
            })
        },




        // -----------------------------------------------------------------e-kyc
        getNewSession: ({ commit, dispatch, getters }, payload) => {
            /* eslint-disable */
            return new Promise(async (resolve, reject) => {
                const url = `${getters.getTenantKycServiceBaseUrl}/e-kyc/verification/session`;


                const headers = {
                    'Authorization': 'Bearer ' + getters.getCavachAccessToken,
                    'Origin': "http://localhost:4999/",
                    "content-type": "application/json"
                };

                try {
                    const ip = await dispatch('getClientIp');
                    headers['X-Forwarded-For'] = ip;
                } catch (e) {
                    console.error(e);
                }

                return fetch(url, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(payload)
                })
                    .then(response => response.json())
                    .then(json => {
                        if (json.statusCode && (json.statusCode != (200 || 201))) {
                            reject(json.message)
                        } else if (json.error) {
                            reject(json)
                        } else {
                            if (json) {
                                commit('setSession', json.sessionId);
                            }
                            resolve(json)
                        }
                    }).catch((e) => {
                        reject(new Error(`Error while fetching session  ${e}`))
                    })
            })
        },

        //TODO: Change name of this method to somethin liek, submitUserConsent()
        verifyResult: ({ commit, getters, state }) => {
            return new Promise((resolve, reject) => {
                if (Object.keys(state.userPresentationConsent).length <= 0) {
                    return reject(new Error('No user consent found'))
                }
                const url = `${getters.getTenantKycServiceBaseUrl}/e-kyc/verification/user-consent`;
                const headers = {
                    'Authorization': 'Bearer ' + getters.getCavachAccessToken,
                    'Origin': "http://localhost:8080/",
                    "content-type": "application/json"
                }
                return fetch(url, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        sessionId: getters.getSession,
                        presentation: state.userPresentationConsent
                    })
                })
                    .then(response => response.json())
                    .then(json => {
                        if (json.statusCode && (json.statusCode != (200 || 201))) {
                            reject(json.message)
                        } else if (json.error) {
                            reject(json)
                        } else {
                            if (json && json.success === true) {
                                commit('setResult', json.success);
                                commit('setIdToken', json.idToken);
                            }

                            resolve(json)
                        }
                    }).catch((e) => {
                        reject(new Error(`Verifying the result  ${e}`))
                    })
            })
        },

        verifyLiveliness: ({ commit, state, getters, dispatch }) => {
            return new Promise((resolve, reject) => {
                if (state.livelinessCapturedData.tokenSelfiImage === "" || !state.hasLivelinessDone) {
                    return reject('User has not performed liveliness check')
                }
                const url = `${getters.getTenantKycServiceBaseUrl}/e-kyc/verification/passive-liveliness`;
                const headers = {
                    'Authorization': 'Bearer ' + getters.getCavachAccessToken,
                    'Origin': "http://localhost:8080/",
                    "content-type": "application/json",
                    'x-ssi-access-token': getters.getSSIAccessToken,
                    'x-issuer-did': getters.getPresentationRequestParsed.issuerDID,
                    'x-issuer-did-ver-method': getters.getPresentationRequestParsed.issuerDIDVerificationMethod
                };
                return fetch(url, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        sessionId: getters.getSession,
                        tokenSelfiImage: state.livelinessCapturedData.tokenSelfiImage,
                        userDID: getters.getUserDID
                    })
                })
                    .then(response => response.json())
                    .then(async json => {
                        if (json.statusCode && (json.statusCode != (200 || 201))) {
                            return reject(json.message)
                        } else if (json.error) {
                            return reject(json)
                        } else {
                            if (json && json.serviceLivenessResult === 3) {
                                commit('setLivelinessResult', json);
                                await dispatch('updateVaultCredentials', json.credential);
                                return resolve(json)
                            } else {
                                reject(new Error('Error verifying liveliness check, error code: ' + json.serviceLivenessResult))
                            }
                        }
                    }).catch((e) => {
                        return reject(new Error(`Verifying the result  ${e}`))
                    })
            })
        },

        verifyOcrIDDoc: ({ commit, state, getters, dispatch }) => {
            return new Promise((resolve, reject) => {
                if (state.kycCapturedData.tokenFrontDocumentImage === "" || !state.hasKycDone) {
                    return reject('User has not performed ID capturing')
                }
                const url = `${getters.getTenantKycServiceBaseUrl}/e-kyc/verification/doc-ocr`;
                const headers = {
                    'Authorization': 'Bearer ' + getters.getCavachAccessToken,
                    'Origin': "http://localhost:8080/",
                    "content-type": "application/json",
                    'x-ssi-access-token': getters.getSSIAccessToken,
                    'x-issuer-did': getters.getPresentationRequestParsed.issuerDID,
                    'x-issuer-did-ver-method': getters.getPresentationRequestParsed.issuerDIDVerificationMethod
                };
                return fetch(url, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        documentType: 0,
                        tokenFrontDocumentImage: state.kycCapturedData.tokenFrontDocumentImage,
                        tokenFaceImage: state.kycCapturedData.tokenFaceImage,
                        countryCode: state.kycCapturedData.countryCode,
                        sessionId: getters.getSession,
                        userDID: getters.getUserDID,
                        ocr: { ...state.kycExtractedData.extractionRaw.ocr }
                    })
                })
                    .then(response => response.json())
                    .then(json => {
                        if (json.statusCode && (json.statusCode != (200 || 201))) {
                            return reject(json.message)
                        } else if (json.error) {
                            return reject(json)
                        } else {
                            if (json && json.serviceFacialAuthenticationResult === 0) {
                                commit('setOcrIdDocResult', json);
                                if (json.credentials && json.credentials.length > 0) {

                                    json.credentials.forEach(credential => {
                                        console.log('Updating each credentila in vault credential id ' + credential.id)
                                        dispatch('updateVaultCredentials', credential);
                                    })
                                }

                                return resolve(json)
                            } else {
                                return reject(new Error('Error verifying ID document, error code: ' + json.serviceFacialAuthenticationResult))
                            }
                        }
                    }).catch((e) => {
                        reject(new Error(`Verifying the result  ${e}`))
                    })
            })
        },


        // ----------------------------------------------------------------
        registerUser: ({ commit, getters }) => {
            return new Promise((resolve, reject) => {
                const url = 'https://authserver.hypersign.id/hs/api/v2/register'
                const headers = {
                    "content-type": "application/json"
                };
                const { email, name, accessToken } = getters.getProfile
                return fetch(url, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        "user": {
                            "name": name,
                            "email": email,
                            "did": "did:hid:testnet:z6MkwF5rDNi3oKiUaqA5aN9yLDW5zTUA4ghshW8Soq4M92ED", // TODO
                            // "nameSpace": "hypersign-kyc"
                        },
                        "isThridPartyAuth": true,
                        "expirationDate": "2030-12-31T00:00:00.000Z",
                        "thridPartyAuthProvider": "Google",
                        "accessToken": accessToken
                    })
                })
                    .then(response => response.json())
                    .then(json => {
                        if (json) {
                            if (json.error) {
                                return reject(json.error)
                            }

                            if (json.status === 403) {
                                commit('setAsNewUser', false)
                            } else {
                                commit('setAsNewUser', true)

                            }

                            commit('setAuthServerAuthToken', json.authToken)
                            resolve(json)
                        }
                    }).catch((e) => {
                        reject(new Error(`Verifying the result  ${e}`))
                    })
            })
        },

        syncUserData: ({ getters }) => {
            return new Promise((resolve, reject) => {
                const { email } = getters.getProfile
                if (!email) {
                    return reject(new Error('Invalid email, or user is not logged in'))
                }

                if (!localStorage.getItem('vaultData')) {
                    return reject(new Error('Invalid vault data'))
                }
                // const url = 'https://authserver.hypersign.id/hs/api/v2/sync/' + email

                const url = 'https://authserver.hypersign.id/hs/api/v2/sync'
                const headers = {
                    "content-type": "application/json",
                    "Authorization": "Bearer " + getters.getAuthServerAuthToken
                };

                return fetch(url, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        "user": {
                            "userId": email,
                            "sequenceNo": 0,
                            "docId": "randomId",
                            // "nameSpace": "hypersign-kyc"
                        },
                        "document": {
                            "encryptedMessage": localStorage.getItem('vaultData')
                        }
                    })
                })
                    .then(response => response.json())
                    .then(json => {
                        if (json) {
                            if (json.error) {
                                return reject(json.error)
                            }
                            // commit('setVaultData', json.encryptedMessage)
                            resolve()
                        }
                    }).catch((e) => {
                        reject(e)
                    })
            })
        },

        syncUserDataById: ({ getters, commit }) => {
            return new Promise((resolve, reject) => {
                const { email } = JSON.parse(localStorage.getItem('profile'))
                if (!email) {
                    return reject(new Error('Invalid email, or user is not logged in'))
                }

                const url = 'https://authserver.hypersign.id/hs/api/v2/sync/' + email
                const headers = {
                    "content-type": "application/json",
                    "Authorization": "Bearer " + getters.getAuthServerAuthToken
                };

                return fetch(url, {
                    method: 'GET',
                    headers,
                })
                    .then(response => response.json())
                    .then(json => {
                        if (json) {
                            if (json.error) {
                                return reject(json.error)
                            }
                            commit('setVaultData', json.encryptedMessage)
                            resolve()
                        }
                    }).catch((e) => {
                        reject(e)
                    })
            })
        },


        // ------------------------------------------------------------------ vault
        async lockVault({ commit, getters }) {
            try {
                const vaultPin = getters.getVaultPin
                let vaultRaw = getters.getVaultDataRaw
                if (!vaultRaw) {
                    return false
                }

                if (getters.getVaultLockStatus === true) {
                    throw new Error('Vault is already locked')
                }

                const encryptedData = await encrypt(JSON.stringify(vaultRaw), vaultPin)

                await commit('setVaultData', encryptedData)
                await commit('setVaultLockStatus', true)

                return true
            } catch (e) {
                throw new Error('Error: Could not lock vault')
            }
        },

        async unlockVault({ commit, getters }) {
            try {
                const vaultPin = getters.getVaultPin
                const vaultData = getters.getVaultData

                if (getters.getVaultLockStatus === false) {
                    throw new Error('Vault is already unlocked')
                }
                if (!vaultData || vaultData === 'undefined') {
                    return false
                }
                const decryptedData = await decrypt(vaultData, vaultPin)

                if (decryptedData === "") {
                    throw new Error('Error: Could not unlock vault, please check your PIN')
                }

                if (decryptedData) {
                    commit('setVaultRaw', decryptedData)
                    commit('setVaultLockStatus', false)
                }

                return true
            } catch (e) {
                throw new Error(e.message)
            }

        },

        async updateVaultCredentials({ commit, getters, dispatch }, payload) {
            try {
                // check if vault is unlocked
                if (getters.getVaultLockStatus === true) {
                    throw new Error('Vault is locked, please unlock first')
                }

                const vaultDataRaw = getters.getVaultDataRaw
                vaultDataRaw.hypersign.credentials.push(payload)
                if (vaultDataRaw) commit('setVaultRaw', JSON.stringify(vaultDataRaw))

                await dispatch('lockVault')

                setTimeout(async () => {
                    dispatch('syncUserData')
                    console.log('After calling syncUserData ... ')
                }, 2000)
            } catch (e) {
                throw new Error(e.message)
            }
        },

        async checkIfCredentialAlreadyExistsInVault({ commit, getters, state }) {
            // check if vault is unlocked, else throw error
            if (getters.getVaultLockStatus === true) {
                throw new Error('Vault is locked, please unlock first')
            }
            // get the raw data from vault
            const vaultDataRaw = getters.getVaultDataRaw
            const { hypersign } = vaultDataRaw
            const { credentials } = hypersign
            const { schemaIds } = state

            Object.keys(schemaIds).forEach(schema => {
                const { schemaId } = schemaIds[schema]
                const credential = credentials.some(credential => {
                    if (credential) {

                        // TODO: We can also add filter for trusted issuer later in the presentation request
                        if ((credential.credentialSchema.id === schemaId)) {
                            return credential
                        }
                    }
                })

                if (credential) {
                    if (schema === 'PersonhoodCredential') {
                        console.log("commiting setLivelinessDone")
                        commit('setLivelinessDone', true)
                    }

                    // if (['CitizenshipCredential', 'DateOfBirthCredential'].findIndex(x => x === schema) >= 0) {
                    //     console.log("commiting setKycDone")
                    //     commit('setKycDone', true)
                    // }

                    if (schema === 'PassportCredential') {
                        commit('setKycDone', true)
                    }
                }
            })
        },


        async getClientIp() {
            try {
                const resp = await fetch('https://api.ipify.org?format=json')
                const json = await resp.json()
                console.log(json)
                return json.ip
            } catch (e) {
                console.error(e)
            }
        }
    }
})