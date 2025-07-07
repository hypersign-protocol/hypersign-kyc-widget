const storePrefix = 'signin.'
export default {
  LOCAL_STATES: {
    SSI_ACCESS_TOKEN: `${storePrefix}ssiAccessToken`,
    KYC_ACCESS_TOKEN: `${storePrefix}cavachAccessToken`,
    REDIRECT_URL: `${storePrefix}redirectUrl`,
    AUTHORIZATION: `${storePrefix}authorization`,
    PROFILE: `${storePrefix}profile`,
    SUBDOMAIN: `${storePrefix}subdomain`,
    SESSIONS: `${storePrefix}session`,
    PR: `${storePrefix}presentationRequest`,
    WIDGET_CONFIG: `${storePrefix}widgetConfigFromDb`,
    ON_CHAIN_CONFIG: `${storePrefix}onChainIssuerConfig`,
    KYC_SERVICE_USER_ACCESS_TOKEN: `${storePrefix}kycServiceUserAccessToken`,
  },
}
