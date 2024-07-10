export default {
    getVaultPin(state) {
        return state.vaultPin;
        // return localStorage.getItem('vaultPin')
    },
    getVaultLockStatus() {
        return localStorage.getItem('vaultLockStatus')
    },
    getVaultData() {
        return localStorage.getItem('vaultData')
    },
    getVaultDataRaw() {
        const vaultDataRawStr = localStorage.getItem('vaultDataRaw')
        return JSON.parse(vaultDataRawStr)
    },

    getVaultDataCredentials() {
        const vaultDataRawStr = localStorage.getItem('vaultDataRaw')
        const vaultDataRaw = JSON.parse(vaultDataRawStr)
        const { hypersign } = vaultDataRaw
        const { credentials } = hypersign
        return credentials;
    },

    getUserDID() {
        // TODO check if user vault is unlocked 
        const vaultDataRawStr = localStorage.getItem('vaultDataRaw')
        if (vaultDataRawStr) {
            const vaultDataRaw = JSON.parse(vaultDataRawStr)

            const { hypersign } = vaultDataRaw
            if (hypersign) {
                return hypersign.did
            }
        }
    },
}