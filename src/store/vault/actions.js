import { decrypt, encrypt } from '../../components/utils/symmetricCrypto'
import SignInStoreConfig from '../signin/config'
import VaultConfig from './config'
import { RequestHandler } from '../../components/utils/utils'
const { VAULT_SERVER_BASE_URL } = VaultConfig

export default {

    registerUser: ({ commit, getters, dispatch }) => {
        return new Promise((resolve, reject) => {
            const url = `${VAULT_SERVER_BASE_URL}/auth`
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
                    "authProvider": "Google",
                    "accessToken": accessToken
                })
            })
                .then(response => response.json())
                .then(async json => {
                    if (json) {
                        if (json.error) {
                            return reject(json.error)
                        }

                        await commit('setAuthServerAuthToken', json.authToken)

                        // check if this user has docs in key nameapces
                        const response = await dispatch('getDocumentIdsByNamespace', { namespace: VaultConfig.VAULT_KEY_NAMESPACE })
                        if (response) {
                            if (response.length > 0) {
                                commit('setAsNewUser', false)
                            } else {
                                commit('setAsNewUser', true)
                            }
                        }

                        resolve(json)
                    }
                }).catch((e) => {
                    reject(new Error(`Verifying the result  ${e}`))
                })
        })
    },

    getDocumentIdsByNamespace: async ({ getters }, payload) => {
        try {
            const queryParams = {}
            if (payload) {
                const { namespace } = payload;
                if (namespace) {
                    queryParams['namespace'] = namespace
                }

                queryParams['page'] = 1
                queryParams['perpage'] = 10
            }

            if (getters.getAuthServerAuthToken) {
                const url = `${VAULT_SERVER_BASE_URL}/document`
                const headers = {
                    "content-type": "application/json",
                    "Authorization": "Bearer " + getters.getAuthServerAuthToken
                };
                const resp = await RequestHandler(url, 'GET', {}, headers, queryParams)
                return resp
            }
        } catch (e) {
            throw new Error(e.message)
        }
    },

    getDocumentById: async ({ getters }, payload) => {
        try {
            const queryParams = {}
            if (payload) {
                const { namespace } = payload;
                if (namespace) {
                    queryParams['namespace'] = namespace
                }
            }

            const { documentId } = payload;
            if (!documentId) {
                throw new Error('DocumentId must be specified')
            }

            if (getters.getAuthServerAuthToken) {
                const url = `${VAULT_SERVER_BASE_URL}/document/${documentId}`
                const headers = {
                    "content-type": "application/json",
                    "Authorization": "Bearer " + getters.getAuthServerAuthToken
                };
                const resp = await RequestHandler(url, 'GET', {}, headers, queryParams)
                return resp
            }
        } catch (e) {
            throw new Error(e.message)
        }
    },

    addUpdateDocumentById: async ({ getters }, payload) => {
        try {
            //debugger //eslint-disable-line 
            if (!payload) {
                throw new Error('Payload is required')
            }

            const { namespace, documentId, document, metadata } = payload;
            if (!document) {
                throw new Error('Kindly pass document to add or update in edv')
            }

            const body = {
                "document": {
                    "data": document
                },
            }

            if (metadata) {
                body['metadata'] = metadata
            }

            if (namespace) {
                body['namespace'] = namespace
            }

            if (documentId) {
                body['documentId'] = documentId
            }

            if (getters.getAuthServerAuthToken) {
                const url = `${VAULT_SERVER_BASE_URL}/document`
                const headers = {
                    "content-type": "application/json",
                    "Authorization": "Bearer " + getters.getAuthServerAuthToken
                };
                const resp = await RequestHandler(url, 'POST', body, headers)
                return resp
            }
        } catch (e) {
            throw new Error(e.message)
        }
    },

    retriveVaultKeys: async ({ dispatch, commit }) => {
        try {
            const response = await dispatch('getDocumentIdsByNamespace', { namespace: VaultConfig.VAULT_KEY_NAMESPACE })
            if (response && response.length > 0) {
                const { edvDocId } = response[0]
                if (edvDocId) {
                    const response = await dispatch('getDocumentById', { namespace: VaultConfig.VAULT_KEY_NAMESPACE, documentId: edvDocId })
                    if (response) {
                        const { data } = response
                        if (data) {
                            await commit('setVaultData', data)
                            await dispatch('unlockVault')
                        }
                    }
                }
            }
        } catch (e) {
            throw new Error(e.message)
        }
    },

    retriveVaultCredentials: async ({ dispatch, getters, commit }) => {
        try {
            const response = await dispatch('getDocumentIdsByNamespace', { namespace: VaultConfig.VAULT_NAMESPACE })
            if (response && response.length > 0) {
                for (let i = 0; i < response.length; i++) {
                    const { edvDocId } = response[i]
                    if (edvDocId) {
                        const response = await dispatch('getDocumentById', { namespace: VaultConfig.VAULT_NAMESPACE, documentId: edvDocId })
                        if (response) {
                            const { data } = response
                            if (data) {
                                const vaultPin = getters.getVaultPin
                                decrypt(data, vaultPin)
                                    .then(decryptedData => {
                                        if (decryptedData) {
                                            commit('updateVaultRawCredentials', [JSON.parse(decryptedData)])
                                        }
                                    }).catch(error => {
                                        throw new Error(error);
                                    })
                            } else {
                                console.error('No data found')
                            }
                        } else {
                            console.error('No response found')
                        }
                    }
                }
            }
        } catch (e) {
            throw new Error(e.message)
        }
    },

    syncUserData: ({ getters }) => {
        return new Promise((resolve, reject) => {
            const { email } = getters.getProfile
            if (!email) {
                return reject(new Error('Invalid email, or user is not logged in'))
            }

            if (!localStorage.getItem(VaultConfig.LOCAL_STATES.VAULT_DATA)) {
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
                        "encryptedMessage": localStorage.getItem(VaultConfig.LOCAL_STATES.VAULT_DATA)
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
            const { email } = JSON.parse(localStorage.getItem(SignInStoreConfig.LOCAL_STATES.PROFILE))
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

    async lockVault({ commit, getters }, payload = {}) {
        try {
            const vaultPin = getters.getVaultPin

            let vaultRaw = getters.getVaultDataRaw
            if (payload && Object.keys(payload).length > 0) {
                vaultRaw = payload
            }

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
            if (payload) commit('updateVaultRawCredentials', [payload])

            if (getters.getVaultPin) {
                const encryptedData = await encrypt(JSON.stringify(payload), getters.getVaultPin)
                const payload1 = {
                    document: encryptedData,
                    namespace: VaultConfig.VAULT_NAMESPACE,
                    metadata: 'credentials'
                }
                dispatch('addUpdateDocumentById', payload1)
            } else {
                throw new Error('Vault PIN not set')
            }
        } catch (e) {
            throw new Error(e.message)
        }
    },

    async checkIfCredentialAlreadyExistsInVault({ commit, getters, state }) {
        const raw = localStorage.getItem(VaultConfig.LOCAL_STATES.VAULT_DATA_RAW)
        const vaultDataRaw = JSON.parse(raw)
        if (!vaultDataRaw) {
            return;
        }

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