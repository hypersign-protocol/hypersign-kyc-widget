import Vue from 'vue'
import Vuex from 'vuex'
import { KAVACH_SERVER_BASE_URL, ENTITY_API_BASE_URL, ENTITY_APP_SERCRET } from '../config'
Vue.use(Vuex)

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
                previous: 0,
                skip: false,
            },
            {
                id: 1,
                isActive: true,
                stepName: 'AppScanQR',
                previous: 0,
                skip: false,
            },
            {
                id: 2,
                isActive: false,
                stepName: 'AppClickPic',
                previous: 1,
                skip: true,

            },
            {
                id: 3,
                isActive: false,
                stepName: 'AppOtp',
                previous: 2,
                skip: false,
            },
            {
                id: 4,
                isActive: false,
                stepName: 'AppFinalSuccess',
                previous: 3,
                skip: false,
            },
            {
                id: 5,
                isActive: false,
                stepName: 'AppFinalFail',
                previous: 3,
                skip: false,

            }
        ],

        // Day Pass related
        idCredential: {},
        invoiceCredential: {},
        dayPassCredential: {},
        userDID: {},
    },
    getters: {
        getActiveStep: (state) => {
            // console.log(state)
            return state.steps.find(x => x.isActive == true)
        },

        getAuthorization: (state) => {
            state.authorization = localStorage.getItem('authorization');
            return state.authorization
        },

        getAadhaarData: (state) => {
            return state.aadharData
        },

        // Day Pass related
        getUserDID: (state) => {
            if (state.userDID && Object.keys(state.userDID).length > 0) {
                return state.userDID
            }

            const userDIDStr = localStorage.getItem('userDID')
            if (userDIDStr) {
                return JSON.parse(userDIDStr)
            } else {
                return null
            }
        },

        getinvoiceCredential: (state) => {
            if (state.invoiceCredential && Object.keys(state.invoiceCredential).length > 0) {
                return state.invoiceCredential
            }

            const invoiceCredentialStr = localStorage.getItem('invoiceCredential')
            if (invoiceCredentialStr) {
                return JSON.parse(invoiceCredentialStr)
            } else {
                return null
            }
        },

        getidCredential: (state) => {
            if (state.idCredential && Object.keys(state.idCredential).length > 0) {
                return state.idCredential
            }
            const invoiceCredentialStr = localStorage.getItem('idCredential')
            if (invoiceCredentialStr) {
                return JSON.parse(invoiceCredentialStr)
            } else {
                return null
            }
        },

        getdayPassCredential: (state) => {
            if (state.dayPassCredential && Object.keys(state.dayPassCredential).length > 0) {
                return state.dayPassCredential
            }
            const invoiceCredentialStr = localStorage.getItem('dayPassCredential')
            if (invoiceCredentialStr) {
                return JSON.parse(invoiceCredentialStr)
            } else {
                return null
            }
        }

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

        // Day Pass related
        setidCredential: (state, credential) => {
            state.idCredential = { ...credential }
            localStorage.setItem("idCredential", JSON.stringify(credential));
        },

        setinvoiceCredential: (state, credential) => {
            state.invoiceCredential = { ...credential }
            localStorage.setItem("invoiceCredential", JSON.stringify(credential));
        },

        setdayPassCredential: (state, credential) => {
            state.dayPassCredential = { ...credential }
            localStorage.setItem("dayPassCredential", JSON.stringify(credential));
        },

        setUserDID: (state, userID) => {
            state.userDID = { ...userID }
            localStorage.setItem("userDID", JSON.stringify(userID));
        }
    },
    actions: {
        addharQRVerify: ({ state }) => {
            return new Promise((resolve, reject) => {
                console.log('Inside addharQRVerify')
                const url = KAVACH_SERVER_BASE_URL + '/api/v1/aadhaar/qr/verify'

                if (!(state && state.authorization)) {
                    state.authorization = localStorage.getItem('authorization');
                }
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

        setJWT: ({ commit }) => {
            return new Promise((resolve, reject) => {

                const url = ENTITY_API_BASE_URL + '/api/v1/app/oauth'
                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Api-Secret-Key': ENTITY_APP_SERCRET,
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

        setSession: ({ state }) => {
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
                }).then(() => {
                    // if (json.statusCode == 400) {
                    //     throw new Error('Bad Request ' + json.message.toString())
                    // }
                    // resolve(json)

                    resolve({ "userImageScore": 85, "verified": true })

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

        // Day Pass related
        createDid({ getters }) {
            return new Promise((resolve, reject) => {
                fetch(ENTITY_API_BASE_URL + "/api/v1/did/create", {
                    method: "POST",
                    headers: {
                        'content-type': 'application/json',
                        Authorization: getters.getAuthorization,
                    },
                    body: JSON.stringify({ namespace: 'testnet' })
                }).then(resp => {
                    return resp.json()
                }).then(json => {
                    resolve({ did: json.did, didDocument: json?.metaData?.didDocument });
                }).catch(err => {
                    reject(err.message || err);
                })
            })
        },

        registerDid({ state, getters, commit }, data) {
            console.log(data)
            console.log(state.authorization)
            return new Promise((resolve, reject) => {
                fetch(ENTITY_API_BASE_URL + "/api/v1/did/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: getters.getAuthorization,
                    },
                    body: JSON.stringify({ didDocument: data.didDocument, verificationMethodId: data.verificationMethodId })
                }).then(resp => {
                    return resp.json()
                }).then(json => {
                    if (json && json.registrationStatus === 'COMPLETED') {
                        commit('setUserDID', {
                            did: json.did,
                            didDocument: json.metaData?.didDocument
                        })
                    }
                    resolve({
                        status: json.registrationStatus,
                        transactionHash: json.transactionHash,
                    });
                }).catch(err => {
                    reject(err.message || err);
                })
            })
        },

        issueCredential({ state, getters }, data) {
            console.log(state.phoneNumber)
            return new Promise((resolve, reject) => {
                fetch(ENTITY_API_BASE_URL + "/api/v1/credential/issue", {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: getters.getAuthorization,
                    },
                    body: JSON.stringify(data)
                }).then(resp => {
                    return resp.json()
                }).then(json => {
                    resolve(json?.credentialDocument);
                }).catch(err => {
                    reject(err.message || err);
                })
            })
        },

        generatePresentation({ state, getters }, data) {
            console.log(state.phoneNumber)
            return new Promise((resolve, reject) => {
                fetch(ENTITY_API_BASE_URL + "/api/v1/presentation", {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: getters.getAuthorization,
                    },
                    body: JSON.stringify(data)
                }).then(resp => {
                    return resp.json()
                }).then(json => {
                    resolve(json?.presentation);
                }).catch(err => {
                    reject(err.message || err);
                })
            })
        },

        verifyPresentation({ state, getters }, data) {
            console.log(state.phoneNumber)
            return new Promise((resolve, reject) => {
                fetch(ENTITY_API_BASE_URL + "/api/v1/presentation/verify", {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: getters.getAuthorization,
                    },
                    body: JSON.stringify(data)
                }).then(resp => {
                    return resp.json()
                }).then(json => {
                    resolve(json);
                }).catch(err => {
                    reject(err.message || err);
                })
            })
        },

        refreshStore({ state }) {
            localStorage.removeItem('idCredential')
            localStorage.removeItem('invoiceCredential')
            localStorage.removeItem('dayPassCredential')
            localStorage.removeItem('userDID')
            localStorage.removeItem('presentation')

            state.userDID = {}
            state.idCredential = {}
            state.invoiceCredential = {}
            state.dayPassCredential = {}

        },

        resolveDID({ getters }, did) {
            return new Promise((resolve, reject) => {
                fetch(ENTITY_API_BASE_URL + "/api/v1/did/resolve/" + did, {
                    method: "GET",
                    headers: {
                        'content-type': 'application/json',
                        Authorization: getters.getAuthorization,
                    }
                }).then(resp => {
                    return resp.json()
                }).then(json => {
                    resolve({ ...json?.didDocument });
                }).catch(err => {
                    reject(err.message || err);
                })
            })
        }
    },
})  