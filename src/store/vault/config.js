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
    // KMS server to manager user's key
    VAULT_KMS_SERVER_BASE_URL: 'https://authserver-v2.hypersign.id/api/v1', //'http://localhost:3002/api/v1',
    VAULT_NAMESPACE: 'hypersign-kyc',
    VAULT_KEY_NAMESPACE: 'vault-key',
    VAULT_INDEX: 'content.metaData.namespace',
    // Encryted data vault service
    VAULT_EDV_SERVER_BASE_URL: 'https://edv.hypersign.id' //'http://localhost:3005',
}