import { decrypt, encrypt } from '../../components/utils/symmetricCrypto'
// import { RequestHandler } from '../../components/utils/utils';
const VAULT_SERVER_BASE_URL = 'https://authserver.hypersign.id/hs/api/v2'
export default {
    // ---------------------------------------------------------------- EDV (auth server)
    registerUser: ({ commit, getters }) => {
        return new Promise((resolve, reject) => {
            const url = `${VAULT_SERVER_BASE_URL}/register`
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
            // const url = `${VAULT_SERVER_BASE_URL}/sync/` + email

            const url = `${VAULT_SERVER_BASE_URL}/sync`
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

            const url = `${VAULT_SERVER_BASE_URL}/sync/` + email
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
            if (!vaultData) {
                return false
            }

            if (getters.getVaultLockStatus === false) {
                throw new Error('Vault is already unlocked')
            }
            if (!vaultData || vaultData === 'undefined') {
                return false
            }
            console.log('Before calling decryt ')
            console.log({
                vaultData, vaultPin
            })
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
            commit('clearVaultPin')
            console.error(e)
            throw new Error('Error: Could not unlock vault, please check your PIN')
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
        const { schemaIds } = state;
        const issuerDID = getters.getWidgetConfigFromDb.issuerDID
        let trustedIssuerList = []
        if (issuerDID) {
            trustedIssuerList = issuerDID.split(',')
        }


        Object.keys(schemaIds).forEach(schema => {
            const { schemaId } = schemaIds[schema]
            const credential = credentials.find(credential => {
                if (credential) {
                    // TODO: We can also add filter for trusted issuer later in the presentation request
                    if ((credential.credentialSchema.id === schemaId) && trustedIssuerList.includes(credential.issuer)) {
                        return credential
                    }

                }
            })

            if (credential) {
                if (schema === 'PersonhoodCredential') {
                    commit('setLivelinessCapturedData', credential.credentialSubject)
                    commit('setLivelinessDone', true)
                }

                // if (['CitizenshipCredential', 'DateOfBirthCredential'].findIndex(x => x === schema) >= 0) {
                //     console.log("commiting setKycDone")
                //     commit('setKycDone', true)
                // }

                if (schema === 'PassportCredential') {
                    commit('setKycDone', true)
                }

                if (schema === 'SBTCredential') {
                    commit('setSbtMintDone', true)
                }
            } else {
                console.log('Credential not found for schema ' + schemaId)
            }
        })
    },

}