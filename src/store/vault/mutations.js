import VaultConfig from './config'
export default {
    setVaultMnemonic(state, payload) {
        state.vaultMnemonic = payload
    },

    setVaultWallet(state, payload) {
        state.vaultWallet = payload
    },

    setVault(state, payload) {
        state.vault = payload
    },

    setVaultId(state, payload) {
        state.vaultId = payload
    },

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

    updateVaultRawCredentials(state, payload) {
        console.log(state.hasKycDone)
        let vaultRaw = localStorage.getItem(VaultConfig.LOCAL_STATES.VAULT_DATA_RAW)
        if (vaultRaw) {
            vaultRaw = JSON.parse(vaultRaw)
            if (!Array.isArray(vaultRaw.hypersign.credentials)) {
                vaultRaw.hypersign.credentials = []
            }
            vaultRaw.hypersign.credentials.push(...payload)
        }
        if (typeof vaultRaw == 'object') {
            vaultRaw = JSON.stringify(vaultRaw)
        }
        localStorage.setItem(VaultConfig.LOCAL_STATES.VAULT_DATA_RAW, vaultRaw)
    },

    setVaultRaw(state, payload) {
        console.log(state.hasKycDone)
        let vaultRaw = localStorage.getItem(VaultConfig.LOCAL_STATES.VAULT_DATA_RAW)
        if (vaultRaw) {
            vaultRaw = JSON.parse(vaultRaw)
            if (vaultRaw.hypersign) {
                if (Array.isArray(vaultRaw.credentials) && (typeof payload == 'object')) {
                    vaultRaw.credentials.push(JSON.parse(payload))
                }
            }
        } else {
            vaultRaw = payload
        }

        if (typeof vaultRaw == 'object') {
            vaultRaw = JSON.stringify(vaultRaw)
        }
        localStorage.setItem(VaultConfig.LOCAL_STATES.VAULT_DATA_RAW, vaultRaw)
    },

    setVaultLockStatus(state, payload) {
        console.log(state.hasKycDone)
        localStorage.setItem(VaultConfig.LOCAL_STATES.VAULT_LOCK, payload)
    },

}