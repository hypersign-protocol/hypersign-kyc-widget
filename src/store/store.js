import Vue from 'vue'
import Vuex from 'vuex'
import { KAVACH_SERVER_BASE_URL, ENTITY_API_BASE_URL, ENTITY_APP_SERCRET } from '../config'
import { decrypt, encrypt } from '../../src/components/utils/symmetricCrypto'
Vue.use(Vuex)
const apiServerBaseUrl = 'http://ent-0b22db9.localhost:3001/api/v1';

export default new Vuex.Store({
    state: {
        qrString: "",
        phoneNumber: "",
        finalResult: {},
        aadharData: {},
        authorization: null,
        steps: [

            {
                id: 0,
                isActive: true,
                stepName: 'AppInstructions',
                previous: 0
            },
            {
                id: 1,
                isActive: false,
                stepName: 'SignIn',
                previous: 0
            },
            {
                id: 2,
                isActive: true,
                stepName: 'VaultPIN',
                previous: 1
            },
            {
                id: 3,
                isActive: false,
                stepName: 'Liveliness',
                name: 'Facial Recognition',
                previous: 2
            },
            {
                id: 4,
                isActive: false,
                stepName: 'IdDocs',
                name: 'Government-issued ID',
                previous: 2
            },
            {
                id: 5,
                isActive: false,
                stepName: 'PreviewData',
                name: 'User Consent',
                previous: 3
            },
            {
                id: 6,
                isActive: false,
                stepName: 'FinalResult',
                previous: 4
            },
        ],


        //-----------------------------------------------------------------e-kyc
        hasLivelinessDone: false,
        hasKycDone: false,
        kycExtractedData: {},
        // cavachAccessToken: "",
        // redirectUrl: "",
        finalResults: false,
        //session: "",
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
    },
    getters: {
        getActiveStep: (state) => {
            // console.log(state)
            // const stepIndex = localStorage.getItem("currentStep") //
            const step = state.steps.find(x => x.isActive == true)
            // console.log(stepIndex)
            // let step = stepIndex ? state.steps[stepIndex] : state.steps.find(x => x.isActive == true);
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
            if (vaultDataRawStr) {
                return JSON.parse(vaultDataRawStr)
            } else {
                return null
            }
        },
    },
    mutations: {

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
        setSession(state, payload) {
            console.log(state.hasKycDone)
            localStorage.setItem("session", payload)
        },
        setKycExtractedData(state, payload) {
            state.kycExtractedData = payload;
            state.hasKycDone = true;
        },
        setCavachAccessToken(state, payload) {
            console.log(state.kycCapturedData)
            localStorage.setItem("cavachAccessToken", payload)
        },
        setRedirectUrl(state, payload) {
            console.log(state.kycCapturedData)
            localStorage.setItem("redirectUrl", payload)
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
            return localStorage.setItem("authServerAuthToken", payload)
        },


        // --- vault
        setVaultPin(state, payload) {
            console.log(state.hasKycDone)
            return localStorage.setItem('vaultPin', payload)
        },

        setVaultData(state, payload) {
            console.log(state.hasKycDone)
            return localStorage.setItem('vaultData', payload)
        },

        setVaultRaw(state, payload) {
            console.log(state.hasKycDone)

            return localStorage.setItem('vaultDataRaw', JSON.stringify(payload))
        },

        // setVaultLockStatus(state, payload) {

        // }

        setAsNewUser(state, payload) {
            console.log(state.hasKycDone)
            state.ifNewUser = payload;
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




        //-----------------------------------------------------------------e-kyc
        getNewSession: ({ commit, getters }, payload) => {
            return new Promise((resolve, reject) => {
                const url = `${apiServerBaseUrl}/e-kyc/verification/session`;
                const headers = {
                    'Authorization': 'Bearer ' + getters.getCavachAccessToken,
                    'Origin': "http://localhost:4999/",
                    "content-type": "application/json"
                };
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

        verifyResult: ({ commit, getters }) => {
            return new Promise((resolve, reject) => {
                const url = `${apiServerBaseUrl}/e-kyc/verification/result`;
                const headers = {
                    'Authorization': 'Bearer ' + getters.getCavachAccessToken,
                    'Origin': "http://localhost:8080/",
                    "content-type": "application/json"
                };
                return fetch(url, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        sessionId: getters.getSession
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
                            }

                            resolve(json)
                        }
                    }).catch((e) => {
                        reject(new Error(`Verifying the result  ${e}`))
                    })
            })
        },

        verifyLiveliness: ({ commit, state, getters }) => {
            return new Promise((resolve, reject) => {
                if (state.livelinessCapturedData.tokenSelfiImage === "" || !state.hasLivelinessDone) {
                    return reject('User has not performed liveliness check')
                }
                const url = `${apiServerBaseUrl}/e-kyc/verification/passive-liveliness`;
                const headers = {
                    'Authorization': 'Bearer ' + getters.getCavachAccessToken,
                    'Origin': "http://localhost:8080/",
                    "content-type": "application/json"
                };
                return fetch(url, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        sessionId: getters.getSession,
                        tokenSelfiImage: state.livelinessCapturedData.tokenSelfiImage
                    })
                })
                    .then(response => response.json())
                    .then(json => {
                        if (json.statusCode && (json.statusCode != (200 || 201))) {
                            return reject(json.message)
                        } else if (json.error) {
                            return reject(json)
                        } else {
                            if (json && json.serviceLivenessResult === 3) {
                                commit('setLivelinessResult', json);
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

        verifyOcrIDDoc: ({ commit, state, getters }) => {
            return new Promise((resolve, reject) => {
                if (state.kycCapturedData.tokenFrontDocumentImage === "" || !state.hasKycDone) {
                    return reject('User has not performed ID capturing')
                }
                const url = `${apiServerBaseUrl}/e-kyc/verification/ocr-id-doc`;
                const headers = {
                    'Authorization': 'Bearer ' + getters.getCavachAccessToken,
                    'Origin': "http://localhost:8080/",
                    "content-type": "application/json"
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
                            "did": "did:hid:testnet:z6MkwF5rDNi3oKiUaqA5aN9yLDW5zTUA4ghshW8Soq4M92ED" // TODO
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


        syncUserData: ({ commit, getters }) => {
            return new Promise((resolve, reject) => {
                const { email } = getters.getProfile
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
                        reject(new Error(`Verifying the result  ${e}`))
                    })
            })
        },


        // --- vault
        async lockVault({ commit, getters }) {
            const vaultPin = getters.getVaultPin
            const vaultRaw = getters.getVaultDataRaw
            if (!vaultRaw) {
                throw new Error('vaultRaw not found')
            }
            const encryptedData = await encrypt(vaultRaw, vaultPin)
            commit('setVaultData', encryptedData)
            return true
        },

        async unlockVault({ commit, getters }) {
            const vaultPin = getters.getVaultPin
            const vaultData = getters.getVaultData
            if (!vaultData) {
                throw new Error('Vault data not found')
            }
            const decryptedData = await decrypt(vaultData, vaultPin)
            commit('setVaultRaw', decryptedData)
            return true
        },

        async updateVaultData() {
            //  fetch current unlocked vault data
            // const r1= await this.unlockVault()
            // update that data
            // lock the vault 
        }
    },


})