import { decrypt, encrypt } from '../../components/utils/symmetricCrypto'
import VaultConfig from './config'
import { RequestHandler } from '../../components/utils/utils'
import { VaultClient } from '../../vault-client/client'
import { VaultWalletManager } from '../../vault-client/wallet';
const bip39 = require("bip39")
const { VAULT_KMS_SERVER_BASE_URL, VAULT_EDV_SERVER_BASE_URL } = VaultConfig

export default {

    async initializeVault({ commit, getters }, payload) {
        let { vaultId } = payload ? payload : {};
        if (!vaultId) {
            vaultId = getters.getVaultId;
        }
        const vaultWallet = getters.getVaultWallet
        if (!vaultWallet) throw new Error("VaultWallet not provided")
        const vault = new VaultClient(vaultWallet, {
            edvId: vaultId,
            edvUrl: VAULT_EDV_SERVER_BASE_URL
        })
        await vault.Init()
        commit('setVault', vault)
    },

    async intitalizeVaultWallet({ commit }, payload) {
        const { mnemonic } = payload
        const vaultWallet = await VaultWalletManager.getWallet(mnemonic);
        commit('setVaultWallet', vaultWallet)
    },

    registerUser: ({ commit, getters, dispatch }) => {
        //eslint-disable-next-line
        return new Promise(async (resolve, reject) => {
            console.log('Inside registerUser() ...')
            const url = `${VAULT_KMS_SERVER_BASE_URL}/auth`
            const headers = {
                "content-type": "application/json"
            };
            const { email, name, accessToken } = getters.getProfile

            // generate new mnemonic 
            const mnemonic = bip39.generateMnemonic(256)
            commit('setVaultMnemonic', mnemonic)

            await dispatch('intitalizeVaultWallet', { mnemonic })

            const did = getters.getVaultWallet.didDocument.id
            // store at authserver
            return fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    "user": {
                        "name": name,
                        "email": email,
                        "did": did
                    },
                    "isThridPartyAuth": true,
                    "expirationDate": "2030-12-31T00:00:00.000Z",
                    "authProvider": "Google",
                    "accessToken": accessToken,
                    "secret": mnemonic
                })
            })
                .then(response => response.json())
                .then(async json => {
                    if (json) {
                        if (json.error) {
                            return reject(json.error)
                        }

                        if (json) {
                            await commit('setAuthServerAuthToken', json.message.authToken)
                            const { kmsIds, vaultId } = json.message
                            if (kmsIds && kmsIds.length > 0) {
                                await dispatch('getKMSById', { kmsId: kmsIds[0] })
                            }

                            if (vaultId) {
                                await commit('setVaultId', vaultId)
                            }

                            if (json.status === 403) {
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

    createKMS: async ({ getters, dispatch }) => {
        try {
            console.log('Inside createKMS() ....')
            const mnemonic_raw = getters.getVaultMnemonic
            if (!mnemonic_raw) {
                throw new Error('No key found to be stored on kms')
            }

            const vaultPin = getters.getVaultPin
            if (!vaultPin) {
                throw new Error('No PIN is set fo the vault')
            }

            const encryptedData = await encrypt(mnemonic_raw, vaultPin)

            if (getters.getAuthServerAuthToken) {
                const url = `${VAULT_KMS_SERVER_BASE_URL}/kms`
                const headers = {
                    "content-type": "application/json",
                    "Authorization": "Bearer " + getters.getAuthServerAuthToken
                };
                const body = {
                    "secret": encryptedData,
                    "did": getters.getVaultWallet.didDocument.id,
                }
                const resp = await RequestHandler(url, 'POST', body, headers, {})
                if (resp && resp.kmsId) {
                    const { kmsId } = resp
                    dispatch('getKMSById', { kmsId: kmsId })
                }
                return resp
            } else {
                throw new Error('User is not authenticated with authserver')
            }
        } catch (e) {
            throw new Error(e.message)
        }
    },

    deleteAccount: async ({ getters }) => {
        try {
            if (getters.getAuthServerAuthToken) {
                const url = `${VAULT_KMS_SERVER_BASE_URL}/user`
                const headers = {
                    "content-type": "application/json",
                    "Authorization": "Bearer " + getters.getAuthServerAuthToken
                };

                const resp = await RequestHandler(url, 'DELETE', {}, headers, {})
                return resp
            } else {
                throw new Error('User is not authenticated with authserver')
            }
        } catch (e) {
            throw new Error(e.message)
        }
    },

    getKMSById: async ({ getters, commit }, payload) => {
        try {
            console.log('Inside getKMSById() ....')
            const { kmsId } = payload;
            if (!kmsId) {
                throw new Error('kmsId must be specified')
            }
            if (getters.getAuthServerAuthToken) {
                const url = `${VAULT_KMS_SERVER_BASE_URL}/kms/${kmsId}`
                const headers = {
                    "content-type": "application/json",
                    "Authorization": "Bearer " + getters.getAuthServerAuthToken
                };
                const resp = await RequestHandler(url, 'GET', {}, headers, {})
                // eslint-disable-next-line
                // debugger;
                if (resp && resp.secret && resp.secret.mnemonic) {
                    // this is supposed to be encrypted data...only later to be decrypted..
                    commit('setVaultData', resp.secret.mnemonic)
                }
                return resp
            }
        } catch (e) {
            throw new Error(e.message)
        }
    },

    getUserAccessMnemomic: async ({ getters, commit }) => {
        try {
            console.log('Inside getUserAccessMnemomic() ....')
            const vaultPin = getters.getVaultPin
            if (!vaultPin) {
                throw new Error('No vault pin specified')
            }
            const getEncrytedVaultMnemonic = getters.getVaultData;
            const mnemonic = await decrypt(getEncrytedVaultMnemonic, vaultPin)
            await commit('setVaultMnemonic', mnemonic)
        } catch (e) {
            throw new Error(e.message)
        }
    },

    getDocumentIdsByNamespace: async ({ getters, commit }, payload) => {
        try {
            console.log('Inside getDocumentIdsByNamespace() ....')
            const vault = getters.getVault;
            if (vault) {
                const queryResult = await vault.Query({
                    equals: [
                        {
                            'content.metaData.namespace': payload.namespace
                        }]
                })
                console.log(queryResult)
                for (let i = 0; i < queryResult.length; i++) {
                    const actualDoc = await vault.GetDecryptedDocument(queryResult[i].id)
                    commit('updateVaultRawCredentials', [actualDoc.document])
                }
            } else {
                throw new Error('Vault has not been initialized')
            }

        } catch (e) {
            throw new Error(e.message)
        }
    },

    addUpdateDocumentById: async ({ getters }, payload) => {
        try {
            if (!payload) {
                throw new Error('Payload is required')
            }

            const { namespace, document } = payload;
            if (!document) {
                throw new Error('Kindly pass document to add or update in edv')
            }

            const vault = getters.getVault;
            if (vault) {
                const indexes = [
                    {
                        index: VaultConfig.VAULT_INDEX,
                        unique: false
                    }]
                const content = {
                    document: document, // credential..
                    metaData: {
                        namespace: namespace,
                    },
                }
                const preparedDoc = vault.PrepareEdvDocument(content, indexes)
                vault.CreateDocument({ preparedDoc: preparedDoc })
            } else {
                throw new Error('Vault is not initialized')
            }
        } catch (e) {
            throw new Error(e.message)
        }
    },

    retriveVaultCredentials: async ({ dispatch }) => {
        try {
            await dispatch('getDocumentIdsByNamespace', { namespace: VaultConfig.VAULT_NAMESPACE })
        } catch (e) {
            throw new Error(e.message)
        }
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
                const payload1 = {
                    document: payload,
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
                    if ((credential.credentialSchema?.id === schemaId) && trustedIssuerList.includes(credential.issuer)) {
                        return credential
                    }
                    if ((credential.type.includes(schema)) && trustedIssuerList.includes(credential.issuer)) {
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

                if (schema === 'GovermentIdCredential') {
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
