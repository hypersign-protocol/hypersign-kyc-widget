<template>
    <div>
        <div class="card-body min-h-36">
            <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></load-ing>
            <PageHeading :header="'Login'" :subHeader="'Create/Retrive your decentralized identity'" />
            <div class="mt-4 p-4" style="width: 70%;margin:auto;">
                <div>
                    <!-- <ConnectWalletButton @authEvent="myEventListener" :is-disable="error" /> -->
                    <GoogleButton :is-disable="error" />
                    <ConsentBox />
                </div>
            </div>
        </div>
        <MessageBox :msg="toastMessage" :type="toastType" v-if="isToast" />
    </div>
</template>

<script>
import { mapMutations, mapActions, mapGetters, mapState } from "vuex";
// import ConnectWalletButton from '../commons/authButtons/ConnectWalletButton.vue';
import GoogleButton from '../commons/authButtons/GoogleButton.vue';
// import WidgetConfig from '../utils/widget.config'
import { STEP_NAMES } from '@/config'
export default {
    name: STEP_NAMES.SignIn,
    computed: {
        ...mapGetters(["getCavachAccessToken", "getRedirectUrl", "getPresentationRequest", 'getOnChainIssuerConfig', 'getWidgetConfigFromDb']),
        ...mapState(['hasLivelinessDone', 'hasKycDone'])
    },
    components: {
        // ConnectWalletButton,
        GoogleButton
    },
    data() {
        return {
            isLoading: false,
            fullPage: true,
            toastMessage: "",
            toastType: "success",
            isToast: false,
            error: false,
            pr: ""
        };
    },
    methods: {
        ...mapMutations(["setCavachAccessToken", "setRedirectUrl", "nextStep", "setPresentationRequest", 'setTenantSubdomain', 'setSSIAccessToken', 'setOnChainIssuerConfig']),
        ...mapActions(["getNewSession", "registerUser", "getOnChainConfigByIdAction", "fetchAppsWidgetConfig"]),
        myEventListener(data) {
            if (data.status == 'success') {
                this.$router.push(`/auth/${data.provider}`)
            } else {
                this.error = true
                throw new Error('Could not authenticate with provider ')
            }
        },
        toast(msg, type = "success") {
            this.isToast = true;
            this.toastMessage = msg;
            this.toastType = type;

            setTimeout(() => {
                this.isToast = false;
                this.toastMessage = "";
            }, 2000);
        },
        parseJwt(token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
        },
        async validationForOnChainIdConfig() {
            if (this.getWidgetConfigFromDb.onChainId.enabled) {
                const onchainIdConfiguration = this.getWidgetConfigFromDb.onChainId.selectedOnChainKYCconfiguration;
                if (!onchainIdConfiguration) {
                    console.log(this.getOnChainIssuerConfig)
                    if (this.getOnChainIssuerConfig.chainId == '' || this.getOnChainIssuerConfig.ecosystem == '' || this.getOnChainIssuerConfig.blockchain == '' || this.getOnChainIssuerConfig.contractAddress == '') {
                        this.error = true
                        throw new Error('Incorrect configuration for onchainId')
                    }
                    throw new Error('Incorrect configuration: OnChainConfig Id must be passed for onchainId step')
                }

                const onchainconfig = await this.getOnChainConfigByIdAction(onchainIdConfiguration)
                const { blockchainLabel, kycContractAddress, sbtContractAddress } = onchainconfig;

                //chainID format: <ecosystem>:<blockchain>:<chainId>
                //  e.g: cosmos:comdex:localnet-1
                //  e.g: evm:polygon:134
                //  e.g: cosmos:nibiru:nibi-localnet-1
                const chainIdComponents = blockchainLabel.split(':')
                // at 0: ecosystem
                // at 1: blockchain
                // at 2: chainId

                this.setOnChainIssuerConfig({
                    ecosystem: chainIdComponents[0],
                    blockchain: chainIdComponents[1],
                    chainId: chainIdComponents[2],
                    contractAddress: kycContractAddress,
                    sbtContractAddress
                })

            }
        },
        preparePresentationRequest() {
            if (!this.getWidgetConfigFromDb) {
                throw new Error('Widget configuration is not available')
            }
            const presentationRequest = {
                "query": [
                    {
                        "type": "QueryByExample",
                        "credentialQuery": [
                            {
                                "example": {
                                    "type": "PersonhoodCredential",
                                    "credentialSchema": {
                                        "id": "sch:hid:testnet:z6Mkvtd73dDgg7HU8wLCmXbe2RAHPAU1Ex1VUXCFtPV7u36i:1.0"
                                    }
                                },
                                "trustedIssuer": [
                                    {
                                        "required": true,
                                        "issuer": "did:hid:testnet:zCyAz2wfKjAaWE4FW75KxpZh2wuo9kRAUZyV2xEe93cKr"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "QueryByExample",
                        "credentialQuery": [
                            {
                                "example": {
                                    "type": "PassportCredential",
                                    "credentialSchema": {
                                        "id": "sch:hid:testnet:z6MkgMXXQL7YD7BufNLbjrwueoj4nmih9xujJ6aozJDmzFWx:1.0"
                                    }
                                },
                                "trustedIssuer": [
                                    {
                                        "required": true,
                                        "issuer": "did:hid:testnet:zCyAz2wfKjAaWE4FW75KxpZh2wuo9kRAUZyV2xEe93cKr"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "QueryByExample",
                        "credentialQuery": [
                            {
                                "example": {
                                    "type": "SBTCredential",
                                    "credentialSchema": {
                                        "id": "sch:hid:testnet:z6MkgHqTUpPtkXJ9dAMt25WQB5MHmC1qqc74z7q2fZk2kPQP:1.0"
                                    }
                                },
                                "trustedIssuer": [
                                    {
                                        "required": true,
                                        "issuer": "did:hid:testnet:zCyAz2wfKjAaWE4FW75KxpZh2wuo9kRAUZyV2xEe93cKr"
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "reason": this.getWidgetConfigFromDb.userConsent.reason,
                "issuerDID": this.getWidgetConfigFromDb.issuerDID,
                "issuerDIDVerificationMethod": this.getWidgetConfigFromDb.issuerVerificationMethodId,
                "domain": this.getWidgetConfigFromDb.userConsent.domain,
                "logoUrl": this.getWidgetConfigFromDb.userConsent.logoUrl
            }
            const presentationRequestStr = JSON.stringify(presentationRequest)
            this.pr = btoa(presentationRequestStr)
        },

        validatePresentationRequest() {
            this.preparePresentationRequest();
            if (!this.pr) {
                if (this.getPresentationRequest != '') {
                    throw new Error('Error initalization of widget!')
                }
            }

            this.setPresentationRequest(this.pr || this.getPresentationRequest)
        },

        validationForAccessTokens() {
            const params = this.$route.query;

            if (!params.kycAccessToken || !params.ssiAccessToken) {
                if (this.getCavachAccessToken != '' && this.getSSIAccessToken != '') {
                    throw new Error('Error initalization of widget, invalid token!')
                }
            }

            this.setCavachAccessToken(params.kycAccessToken || this.getCavachAccessToken)
            this.setSSIAccessToken(params.ssiAccessToken || this.ssiAccessToken)

            const parsedAccessToken = this.parseJwt(params.kycAccessToken)
            this.setTenantSubdomain(parsedAccessToken.subdomain)
        }
    },
    async created() {
        try {

            ////  Mandatory validations of params dapps passed in the widget url
            // validation of access tokens
            this.validationForAccessTokens()

            await this.fetchAppsWidgetConfig()

            this.validatePresentationRequest()

            // validation of onchainId params, if enabled
            this.validationForOnChainIdConfig()

            this.isLoading = true;
            await this.getNewSession()
            this.isLoading = false;

        } catch (e) {
            this.error = true
            this.toast(e.message, "error");
            this.isLoading = false;
        }

    }


}
</script>