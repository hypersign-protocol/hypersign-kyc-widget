import {
  KAVACH_SERVER_BASE_URL,
  ENTITY_API_BASE_URL,
  ENTITY_APP_SERCRET,
} from '../../config'
export default {
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
          qrString: state.qrString,
        }),
      })
        .then((resp) => {
          return resp.json()
        })
        .then((json) => {
          if (json.statusCode === 400) {
            throw new Error('Bad Request ' + json.message.toString())
          }
          resolve(json)
        })
        .catch((e) => {
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
        body: undefined,
      })
        .then((resp) => {
          return resp.json()
        })
        .then((json) => {
          if (json.statusCode === 400) {
            throw new Error('Bad Request ' + json.message.toString())
          }
          commit('setAuthorization', 'Bearer ' + json.access_token)
          resolve()
        })
        .catch((e) => {
          reject(e.message)
          localStorage.removeItem('authorization')
        })
    })
  },
  setSession: ({ state }) => {
    return new Promise((resolve, reject) => {
      const url = KAVACH_SERVER_BASE_URL + '/api/v1/aadhaar/session'
      fetch(url, {
        method: 'POST',
        credentials: 'include',

        headers: {
          'content-type': 'application/json',
          Authorization: state.authorization,
        },
        body: undefined,
      })
        .then((resp) => {
          return resp.json()
        })
        .then((json) => {
          if (json.statusCode === 400) {
            throw new Error('Bad Request ' + json.message.toString())
          }
          resolve(json)
        })
        .catch((e) => {
          reject(e.message)
        })
    })
  },

  verifyPhoneNumber: ({ state }) => {
    return new Promise((resolve, reject) => {
      const url = KAVACH_SERVER_BASE_URL + '/api/v1/aadhaar/ph/verify'
      fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({
          phoneNumber: state.phoneNumber,
        }),
        headers: {
          'content-type': 'application/json',
          Authorization: state.authorization,
        },
      })
        .then((resp) => {
          return resp.json()
        })
        .then((json) => {
          if (json.statusCode === 400) {
            throw new Error('Bad Request ' + json.message.toString())
          }
          resolve(json)
        })
        .catch((e) => {
          reject(e.message)
        })
    })
  },

  verifyImage: ({ state }) => {
    return new Promise((resolve, reject) => {
      const url = KAVACH_SERVER_BASE_URL + '/api/v1/aadhaar/img/verify'
      fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({
          userImage: state.imageData,
        }),
        headers: {
          'content-type': 'application/json',
          Authorization: state.authorization,
        },
      })
        .then((resp) => {
          return resp.json()
        })
        .then((json) => {
          if (json.statusCode === 400) {
            throw new Error('Bad Request ' + json.message.toString())
          }
          resolve(json)
        })
        .catch((e) => {
          reject(e.message)
        })
    })
  },

  getFinalResult: ({ state }) => {
    return new Promise((resolve, reject) => {
      const url = KAVACH_SERVER_BASE_URL + '/api/v1/aadhaar/result'
      fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          Authorization: state.authorization,
          'content-type': 'application/json',
        },
      })
        .then((resp) => {
          return resp.json()
        })
        .then((json) => {
          if (json.statusCode === 400) {
            throw new Error('Bad Request ' + json.message.toString())
          }
          resolve(json)
        })
        .catch((e) => {
          reject(e.message)
        })
    })
  },
}
