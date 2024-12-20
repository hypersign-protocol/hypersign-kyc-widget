import VaultConfig from './config'

export default {
  getExtractionToken(state) {
    return state.extractionToken
  },
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
    return state.vaultPin
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
  getVaultCredentials() {
    const vaultDataRawStr = localStorage.getItem(VaultConfig.LOCAL_STATES.VAULT_DATA_RAW)
    const valutRaw = JSON.parse(vaultDataRawStr)
    const { hypersign } = valutRaw
    const { credentials } = hypersign
    return credentials
  },
  getAuthServerAuthToken() {
    return localStorage.getItem(VaultConfig.LOCAL_STATES.AUTH_SERVER_TOKEN)
  },

  getVaultDataCredentials() {
    const vaultDataRawStr = localStorage.getItem(VaultConfig.LOCAL_STATES.VAULT_DATA_RAW)
    const vaultDataRaw = JSON.parse(vaultDataRawStr)
    const { hypersign } = vaultDataRaw
    const { credentials } = hypersign
    return credentials
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

  getCredentialFromVault: (state) => (params) => {
    const raw = localStorage.getItem(VaultConfig.LOCAL_STATES.VAULT_DATA_RAW)

    const vaultDataRaw = JSON.parse(raw)

    if (!vaultDataRaw) {
      return
    }

    const { hypersign } = vaultDataRaw
    const { credentials } = hypersign
    const { schemaIds } = state

    let credentialToReturn
    Object.keys(schemaIds).forEach((schema) => {
      const { schemaId } = schemaIds[schema]
      const credential = credentials.find((credential) => {
        if (credential) {
          // TODO: We can also add filter for trusted issuer later in the presentation request
          if (credential.credentialSchema?.id === schemaId && params.trustedIssuerList.includes(credential.issuer)) {
            return credential
          }
          if (credential.type.includes(schema) && params.trustedIssuerList.includes(credential.issuer)) {
            return credential
          }
        }
      })

      if ((credential && params.credentialType.includes(schema)) || (credential && params.credentialType.includes(credential.type[1]))) {
        credentialToReturn = credential
      }
    })

    return credentialToReturn
  },
}
