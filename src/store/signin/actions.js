import { RequestHandler } from '../../components/utils/utils'
import { IP_RESOLVER_URL } from '../../config'
export default {
  // nextStep({ commit, getters }) {
  //   commit('NEXT_STEP', getters)
  // },
  nextStep({ commit }, stepNumber = null) {
    commit('NEXT_STEP', stepNumber)
  },
  previousStep({ commit }) {
    commit('PREVIOUS_STEP')
  },
  setStep({ commit }, step) {
    commit('SET_STEP', step)
  },
  updateStepState({ commit }, payload) {
    commit('UPDATE_STEP_STATE', payload)
  },

  getNewSession: async ({ commit, dispatch, getters }, payload) => {
    // try {
    const url = `${getters.getTenantKycServiceBaseUrl}/e-kyc/verification/session`
    const headers = {
      Authorization: 'Bearer ' + getters.getCavachAccessToken,
    }

    try {
      const ip = await dispatch('getClientIp')
      headers['X-Forwarded-For'] = ip
    } catch (e) {
      console.error(e)
    }

    const data = await RequestHandler(url, 'POST', payload, headers)
    if (data.sessionId) {
      commit('setSession', data.sessionId)
      return data
    } else {
      throw new Error(data)
    }
    // } catch (e) {
    //   console.log({ e })
    //   throw new Error(`Error getting new session  ${e}`)
    // }
  },

  fetchAppsWidgetConfig: ({ dispatch, commit, getters }) => {
    return new Promise(async (resolve, reject) => {
      // eslint-disable-line
      try {
        const url = `${getters.getTenantKycServiceBaseUrl}/e-kyc/verification/widget-config/`
        const headers = {
          Authorization: 'Bearer ' + getters.getCavachAccessToken,
        }

        try {
          const ip = await dispatch('getClientIp')
          headers['X-Forwarded-For'] = ip
        } catch (e) {
          console.error(e)
        }

        const data = await RequestHandler(url, 'GET', {}, headers)
        if (data && Object.keys(data) && Object.keys(data).length) {
          commit('setWidgetConfigFromDb', data)
          resolve(data)
        } else {
          throw new Error(data)
        }
      } catch (e) {
        reject(new Error(`Error getting widget config  ${e}`))
      }
    })
  },

  getOnChainConfigByIdAction: ({ dispatch, getters }, payload) => {
    /* eslint-disable */
    return new Promise(async (resolve, reject) => {
      try {
        if (!payload) {
          throw new Error('OnChainConfig id must be provided')
        }
        const url = `${getters.getTenantKycServiceBaseUrl}/e-kyc/verification/onchainkyc-config/${payload}`

        const headers = {
          Authorization: 'Bearer ' + getters.getCavachAccessToken,
        }

        try {
          const ip = await dispatch('getClientIp')
          headers['X-Forwarded-For'] = ip
        } catch (e) {
          console.error(e)
        }

        const data = await RequestHandler(url, 'GET', {}, headers)
        if (data && Object.keys(data) && Object.keys(data).length) {
          resolve(data)
        } else {
          throw new Error(data)
        }
      } catch (e) {
        reject(new Error(`Error getting onchain config  ${e}`))
      }
    })
  },

  async getClientIp() {
    try {
      // TODO: Remove hardcoded URL

      const resp = await fetch(IP_RESOLVER_URL)
      const json = await resp.json()
      return json.ip
    } catch (e) {
      console.error(e)
    }
  },
}
