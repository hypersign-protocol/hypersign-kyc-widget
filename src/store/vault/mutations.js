import VaultConfig from './config'
export default {
    clearVaultPin() {
        localStorage.setItem(VaultConfig.LOCAL_STATES.VAULT_LOCK, false)

    },
    setVaultPin(state, payload) {
        state.vaultPin = payload;
    },

    setVaultData(state, payload) {
        console.log(state.hasKycDone)
        localStorage.setItem(VaultConfig.LOCAL_STATES.VAULT_DATA, payload)
    },

    setAuthServerAuthToken(state, payload) {
        console.log(state.hasKycDone)
        localStorage.setItem(VaultConfig.LOCAL_STATES.AUTH_SERVER_TOKEN, payload)
    },

    setVaultRaw(state, payload) {
        console.log(state.hasKycDone)
        localStorage.setItem(VaultConfig.LOCAL_STATES.VAULT_DATA_RAW, payload)
    },

    setVaultLockStatus(state, payload) {
        console.log(state.hasKycDone)
        localStorage.setItem(VaultConfig.LOCAL_STATES.VAULT_LOCK, payload)
    },

}