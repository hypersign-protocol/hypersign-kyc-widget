import VaultConfig from './config'

export default {

    getVaultMnemonic(state) {
        return state.vaultMnemonic
    },
    getVault(state) {
        return state.vault
    },

    getVaultId(state) {
        return state.vaultId
    },

    getVaultWallet(state) {
        return state.vaultWallet
    },

    getVaultPin(state) {
        return state.vaultPin;
        // return localStorage.getItem('vaultPin')
    },
    getVaultLockStatus() {
        return localStorage.getItem(VaultConfig.LOCAL_STATES.VAULT_LOCK)
    },
    getVaultData() {
        return localStorage.getItem(VaultConfig.LOCAL_STATES.VAULT_DATA)
    },
    getVaultDataRaw() {
        const vaultDataRawStr = localStorage.getItem(VaultConfig.LOCAL_STATES.VAULT_DATA_RAW)
        return JSON.parse(vaultDataRawStr)
    },

    getAuthServerAuthToken() {
        return localStorage.getItem(VaultConfig.LOCAL_STATES.AUTH_SERVER_TOKEN)
    },

    getVaultDataCredentials() {
        const vaultDataRawStr = localStorage.getItem(VaultConfig.LOCAL_STATES.VAULT_DATA_RAW)
        const vaultDataRaw = JSON.parse(vaultDataRawStr)
        const { hypersign } = vaultDataRaw
        const { credentials } = hypersign
        return credentials;
    },

    getUserDID() {
        // TODO check if user vault is unlocked 
        const vaultDataRawStr = localStorage.getItem(VaultConfig.LOCAL_STATES.VAULT_DATA_RAW)
        if (vaultDataRawStr) {
            const vaultDataRaw = JSON.parse(vaultDataRawStr)

            const { hypersign } = vaultDataRaw
            if (hypersign) {
                return hypersign.did
            }
        }
    },
}