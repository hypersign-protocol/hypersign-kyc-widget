import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        count: 0,
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
                stepName: 'AppFinalSuccess',
                previous: 2
            },
            {
                id: 4,
                isActive: false,
                stepName: 'AppFinalFail',
                previous: 2

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

        nextStep: (state) => {
            const activeStep = state.steps.find(x => x.isActive == true)
            const nextStepId = activeStep.id + 1;
            state.steps[activeStep.id].isActive = false;
            state.steps[nextStepId].isActive = true;
        },

        previousStep: (state) => {
            const activeStep = state.steps.find(x => x.isActive == true)
            const previousStepId = activeStep.previous
            state.steps[activeStep.id].isActive = false;
            state.steps[previousStepId].isActive = true;
        }
    },
    actions: {}
})