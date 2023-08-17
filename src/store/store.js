import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        qrString: "",
        phoneNumber: "",
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

        setQrString: (state, qrString) => {
            state.qrString = qrString;
        },

        setPhoneNumber: (state, phoneNumber) => {
            state.phoneNumber = phoneNumber;
        }



    },
    actions: {
        addharQRVerify: ({ state }) => {
            return new Promise((resolve, reject) => {
                console.log('Inside addharQRVerify')
                const url = 'http://localhost:3000' + '/api/v1/aadhaar/qr/verify'
                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
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

        setSession: () => {
            return new Promise((resolve, reject) => {
                console.log('Inside addharQRVerify')
                const url = 'http://localhost:3000' + '/api/v1/aadhaar/session'
                fetch(url, {
                    method: 'POST',
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
                const url = 'http://localhost:3000' + '/api/v1/aadhaar/ph/verify'
                fetch(url, {
                    method: 'POST',
                    body: JSON.stringify({
                        phoneNumber: state.phoneNumber
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

        getFinalResult: () => {
            return new Promise((resolve, reject) => {
                console.log('Inside addharQRVerify')
                const url = 'http://localhost:3000' + '/api/v1/aadhaar/result'
                fetch(url, {
                    method: 'GET',
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

    }
})