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

        idCredential: {},
        invoiceCredential: {},
        dayPassCredential: {},

        steps: [
            {
                id: 0,
                isActive: true,
                stepName: 'AppInstructions',
                previous: 0
            },
            {
                id: 1,
                isActive: true,
                stepName: 'AppScanQR',
                previous: 0
            },
            {
                id: 2,
                isActive: false,
                stepName: 'AppClickPic',
                previous: 1

            },
            {
                id: 3,
                isActive: false,
                stepName: 'AppOtp',
                previous: 2
            },
            {
                id: 4,
                isActive: false,
                stepName: 'AppFinalSuccess',
                previous: 3
            },
            {
                id: 5,
                isActive: false,
                stepName: 'AppFinalFail',
                previous: 3

            }
        ]
    },
    getters: {
        getActiveStep: (state) => {
            // console.log(state)
            return state.steps.find(x => x.isActive == true)
        },
        getUserDID: () => {
            const userDIDStr = localStorage.getItem('userDID')
            if (userDIDStr) {
                return JSON.parse(userDIDStr)
            } else {
                return {}
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
            // state.imageData = imageData;
            state.invoiceCredential = { ...imageData };
            localStorage.setItem("invoiceCredential", JSON.stringify(state.invoiceCredential));
        },


        setPhoneNumber: (state, phoneNumber) => {
            // state.phoneNumber = phoneNumber;
            state.idCredential = { ...phoneNumber };
            localStorage.setItem("idCredential", JSON.stringify(state.idCredential));
        },

        setFinalResult: (state, result) => {
            state.dayPassCredential = { ...result };
            localStorage.setItem("dayPassCredential", JSON.stringify(state.dayPassCredential));
        },

        setAadhaarData: (state, aadharData) => {
            localStorage.setItem("aadharData", JSON.stringify(aadharData));
            state.aadharData = { ...aadharData };
        },

        // setidCredential: (state, credential) => {
        //     console.log('setidCredential called ')
        //     state.idCredential = { ...credential };
        // },
        // setinvoiceCredential: (state, credential) => {
        //     state.invoiceCredential = { ...credential };
        // },
        // setdayPassCredential: (state, credential) => {
        //     state.dayPassCredential = { ...credential };
        // }

        setUserDID: (state, userID) => {
            console.log(state.userDID);
            console.log('setting userDID in localStorage')
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

        createDid() {
            return new Promise((resolve, reject) => {
                fetch(ENTITY_API_BASE_URL + "/api/v1/did/create", {
                    method: "POST",
                    headers: {
                        'content-type': 'application/json',
                        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6Ijc4ZGQ0MjQ0MDU4YzU3ZDVhYTY1MjY4MzU2ZTliZDQ2N2Y4MyIsInVzZXJJZCI6InZpc2h3YXNiaHVzaGFuMDAxQGdtYWlsLmNvbSIsImdyYW50VHlwZSI6ImNsaWVudF9jcmVkZW50aWFscyIsImlhdCI6MTY5NzQ1NTk1NiwiZXhwIjoxNjk3NDcwMzU2fQ.70Oze-qnKAf-dM1QNkxu0m9DwXyOeEXhevQRAW4Mqbo",
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

        registerDid({ state, commit }, data) {
            console.log(data)
            console.log(state.authorization)
            return new Promise((resolve, reject) => {
                fetch(ENTITY_API_BASE_URL + "/api/v1/did/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6Ijc4ZGQ0MjQ0MDU4YzU3ZDVhYTY1MjY4MzU2ZTliZDQ2N2Y4MyIsInVzZXJJZCI6InZpc2h3YXNiaHVzaGFuMDAxQGdtYWlsLmNvbSIsImdyYW50VHlwZSI6ImNsaWVudF9jcmVkZW50aWFscyIsImlhdCI6MTY5NzQ1NTk1NiwiZXhwIjoxNjk3NDcwMzU2fQ.70Oze-qnKAf-dM1QNkxu0m9DwXyOeEXhevQRAW4Mqbo",
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

        issueCredential({ state }, data) {
            console.log(state.phoneNumber)
            return new Promise((resolve, reject) => {
                fetch(ENTITY_API_BASE_URL + "/api/v1/credential/issue", {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6Ijc4ZGQ0MjQ0MDU4YzU3ZDVhYTY1MjY4MzU2ZTliZDQ2N2Y4MyIsInVzZXJJZCI6InZpc2h3YXNiaHVzaGFuMDAxQGdtYWlsLmNvbSIsImdyYW50VHlwZSI6ImNsaWVudF9jcmVkZW50aWFscyIsImlhdCI6MTY5NzQ1NTk1NiwiZXhwIjoxNjk3NDcwMzU2fQ.70Oze-qnKAf-dM1QNkxu0m9DwXyOeEXhevQRAW4Mqbo",
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
        }
    },
})  