<template>
    <div>
        <div class="card-body min-h-36">
            <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></load-ing>
            <PageHeading :header="'Login'" :subHeader="'Create/Retrive your decentralized identity'" />
            <div class="mt-4 p-4" style="width: 70%;margin:auto;">
                <div>
                    <ConnectWalletButton @authEvent="myEventListener" :is-disable="error" />
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
import ConnectWalletButton from '../commons/authButtons/ConnectWalletButton.vue';
import GoogleButton from '../commons/authButtons/GoogleButton.vue';
import WidgetConfig from '../utils/widget.config'
export default {
    name: 'SignIn',
    computed: {
        ...mapGetters(["getCavachAccessToken", "getRedirectUrl", "getPresentationRequest", 'getOnChainIssuerConfig']),
        ...mapState(['hasLivelinessDone', 'hasKycDone'])
    },
    components: {
        ConnectWalletButton,
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
        };
    },
    methods: {
        ...mapMutations(["setCavachAccessToken", "setRedirectUrl", "nextStep", "setPresentationRequest", 'setTenantSubdomain', 'setSSIAccessToken', 'setOnChainIssuerConfig']),
        ...mapActions(["getNewSession", "registerUser"]),
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
        validationForOnChainIdConfig() {
            const params = this.$route.query;
            if (WidgetConfig.steps.onChainId) {

                if (!params.chainId || !params.contractAddress) {
                    console.log(this.getOnChainIssuerConfig)
                    if (this.getOnChainIssuerConfig.chainId == '' || this.getOnChainIssuerConfig.ecosystem == '' || this.getOnChainIssuerConfig.blockchain == '' || this.getOnChainIssuerConfig.contractAddress == '') {
                        this.error = true
                        throw new Error('Incorrect configuration for onchainId')
                    }
                }

                //chainID format: <ecosystem>:<blockchain>:<chainId>
                //  e.g: cosmos:comdex:localnet-1
                //  e.g: evm:polygon:134
                //  e.g: cosmos:nibiru:nibi-localnet-1
                const chainIdRequested = params.chainId;
                const chainIdComponents = chainIdRequested.split(':')
                // at 0: ecosystem
                // at 1: blockchain
                // at 2: chainId
                if (chainIdComponents.length != 3) {
                    const m = 'Invalid chainId, must be in format <ecosystem>:<blockchain>:<chainId>'
                    throw new Error(m)
                }

                // TODO: more checks, 
                // like ecosystem not supported
                // like chain not supported 
                if (chainIdComponents[2].indexOf(' ') > -1) {
                    // space not supported in chainId / networkid
                    throw new Error('Invalid chainId')
                }

                this.setOnChainIssuerConfig({
                    ecosystem: chainIdComponents[0] || this.getOnChainIssuerConfig.ecosystem,
                    blockchain: chainIdComponents[1] || this.getOnChainIssuerConfig.blockchain,
                    chainId: chainIdComponents[2] || this.getOnChainIssuerConfig.chainId,
                    contractAddress: params.contractAddress || this.getOnChainIssuerConfig.contractAddress
                })

            }
        },
        validationForAccessTokens() {
            const params = this.$route.query;

            if (!params.kycAccessToken || !params.pr || !params.ssiAccessToken) {
                if (this.getCavachAccessToken != '' && this.getPresentationRequest != '' && this.getSSIAccessToken != '') {
                    throw new Error('Error initalization of widget!')
                }
            }

            this.setCavachAccessToken(params.kycAccessToken || this.getCavachAccessToken)
            this.setPresentationRequest(params.pr || this.getPresentationRequest)
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