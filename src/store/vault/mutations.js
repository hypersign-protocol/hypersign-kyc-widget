export default {
    clearVaultPin() {
        localStorage.setItem('vaultLockStatus', false)
        localStorage.removeItem('vaultPin')
    },
    setVaultPin(state, payload) {
        // console.log(state.hasKycDone)
        // localStorage.setItem('vaultPin', payload)
        state.vaultPin = payload;
    },

    setVaultData(state, payload) {
        console.log(state.hasKycDone)
        localStorage.setItem('vaultData', payload)
    },

    setVaultRaw(state, payload) {
        console.log(state.hasKycDone)
        localStorage.setItem('vaultDataRaw', payload)
    },

    setVaultLockStatus(state, payload) {
        console.log(state.hasKycDone)
        localStorage.setItem('vaultLockStatus', payload)
    },

}