import { RequestHandler } from '../../components/utils/utils'
export default {
  getNewSession: async ({ commit, dispatch, getters }, payload) => {
    try {
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
    } catch (e) {
      throw new Error(`Error getting new session  ${e}`)
    }
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
      const resp = await fetch('https://api.ipify.org?format=json')
      const json = await resp.json()
      return json.ip
    } catch (e) {
      console.error(e)
    }
  },
}
