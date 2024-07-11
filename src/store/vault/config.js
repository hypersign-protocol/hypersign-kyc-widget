const storePrefix = 'vault.'
export default {
    LOCAL_STATES: {
        VAULT_LOCK: `${storePrefix}vaultLockStatus`,
        VAULT_DATA: `${storePrefix}vaultData`,
        VAULT_DATA_RAW: `${storePrefix}vaultDataRaw`,

        VAULT_KEY_DATA: `${storePrefix}vaultKeyData`,
        VAULT_KEY_DATA_RAW: `${storePrefix}vaultKeyDataRaw`,

        AUTH_SERVER_TOKEN: `${storePrefix}authServerAuthToken`,
    },
    VAULT_SERVER_BASE_URL: 'http://localhost:3002/api/v1',
    VAULT_NAMESPACE: 'hypersign-kyc',
    VAULT_KEY_NAMESPACE: 'vault-key',
}