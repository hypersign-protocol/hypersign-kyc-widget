import Vue from 'vue'
import Vuex from 'vuex'
import { KAVACH_SERVER_BASE_URL, ENTITY_API_BASE_URL, ENTITY_APP_SERCRET } from '../config'
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
                stepName: 'Liveliness',
                name: 'Facial Recognition',
                previous: 0
            },
            {
                id: 2,
                isActive: false,
                stepName: 'IdDocs',
                name: 'Government-issued ID',
                previous: 1
            },
            {
                id: 3,
                isActive: false,
                stepName: 'PreviewData',
                name: 'User Consent',
                previous: 2
            },
            {
                id: 4,
                isActive: false,
                stepName: 'FinalResult',
                previous: 3
            },
        ],


        //-----------------------------------------------------------------e-kyc
        hasLivelinessDone: false,
        hasKycDone: false,
        kycExtractedData: {},
        cavachAccessToken: "",
        redirectUrl: "",
        finalResults: false,
        session: "",
        livelinessResult: {},
        ocrIDDocResult: {},
        livelinessCapturedData: {
            tokenSelfiImage: ""
        },
        kycCapturedData: {
            tokenFrontDocumentImage: "",
            tokenFaceImage: "",
            countryCode: "",

        }
    },
    getters: {
        getActiveStep: (state) => {
            // console.log(state)
            return state.steps.find(x => x.isActive == true)
        },



        //-----------------------------------------------------------------e-kyc
        getCavachAccessToken(state) {
            return state.cavachAccessToken
        },
        getRedirectUrl(state) {
            return state.redirectUrl
        },
        getFinalResult(state) {
            return state.finalResult
        }
    },
    mutations: {

        nextStep: (state, jumpToStepId = null) => {

            // if (!session || session === "") {
            //     throw new Error("Error in initialization, please contact admin")
            // }

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
            state.session = payload;
        },
        setKycExtractedData(state, payload) {
            state.kycExtractedData = payload;
            state.hasKycDone = true;
        },
        setCavachAccessToken(state, payload) {
            state.cavachAccessToken = payload
        },
        setRedirectUrl(state, payload) {
            state.redirectUrl = payload
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
        getNewSession: ({ commit, state }, payload) => {
            return new Promise((resolve, reject) => {
                const url = `${apiServerBaseUrl}/e-kyc/verification/session`;
                const headers = {
                    'Authorization': 'Bearer ' + state.cavachAccessToken,
                    'Origin': "http://localhost:8080/",
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

        verifyResult: ({ commit, state }) => {
            return new Promise((resolve, reject) => {
                const url = `${apiServerBaseUrl}/e-kyc/verification/result`;
                const headers = {
                    'Authorization': 'Bearer ' + state.cavachAccessToken,
                    'Origin': "http://localhost:8080/",
                    "content-type": "application/json"
                };
                return fetch(url, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        sessionId: state.session
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

        verifyLiveliness: ({ commit, state }) => {
            return new Promise((resolve, reject) => {
                if (state.livelinessCapturedData.tokenSelfiImage === "" || !state.hasLivelinessDone) {
                    return reject('User has not performed liveliness check')
                }
                const url = `${apiServerBaseUrl}/e-kyc/verification/passive-liveliness`;
                const headers = {
                    'Authorization': 'Bearer ' + state.cavachAccessToken,
                    'Origin': "http://localhost:8080/",
                    "content-type": "application/json"
                };
                return fetch(url, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        sessionId: state.session,
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

        verifyOcrIDDoc: ({ commit, state }) => {
            return new Promise((resolve, reject) => {
                if (state.kycCapturedData.tokenFrontDocumentImage === "" || !state.hasKycDone) {
                    return reject('User has not performed ID capturing')
                }
                const url = `${apiServerBaseUrl}/e-kyc/verification/ocr-id-doc`;
                const headers = {
                    'Authorization': 'Bearer ' + state.cavachAccessToken,
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
                        sessionId: state.session,
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

    },


})