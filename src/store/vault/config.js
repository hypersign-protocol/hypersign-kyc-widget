const storePrefix = 'vault.'
export default {
    LOCAL_STATES: {
        VAULT_LOCK: `${storePrefix}vaultLockStatus`,
        VAULT_DATA: `${storePrefix}vaultData`,
        VAULT_DATA_RAW: `${storePrefix}vaultDataRaw`,
        AUTH_SERVER_TOKEN: `${storePrefix}authServerAuthToken`,
    },
    VAULT_SERVER_BASE_URL: 'https://authserver.hypersign.id/hs/api/v2'
}