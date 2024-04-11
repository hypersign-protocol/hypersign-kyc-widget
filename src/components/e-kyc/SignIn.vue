<template>
    <div class="card-body">
        <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></load-ing>
        <PageHeading :header="'Login'" :subHeader="'Create/Retrive your decentralized identity'" />
        <div class="mt-4 p-4" style="width: 70%;margin:auto;">
            <div>
                <button type="button" class="btn btn-outline-dark btn-lg mb-2" style="width: 100%;"
                    @click="connectWallet()">
                    <i class="bi bi-currency-bitcoin"></i> Connect Keplr</button>

                <button class="btn btn-outline-dark btn-lg" style="width: 100%;" @click="loginWithGoogle"
                    data-cy="login-with-google" :disabled="error">
                    <i class="bi bi-google"></i> Continue with Google
                </button>
                <ConsentBox />
            </div>
        </div>
        <div class="container">
            <MessageBox :msg="toastMessage" :type="toastType" v-if="isToast" />
        </div>
        <!-- <MessageBox msg="Hello" type="success" v-if="true" class="bottom" /> -->
    </div>
</template>

<script>
import webAuth from '../utils/auth0Connection';
import { mapMutations, mapActions, mapGetters, mapState } from "vuex";
import SupportedChains from '../utils/chains';
import { AUTH_PROVIDERS } from '../../config'
import WidgetConfig from '../../components/utils/widget.config'

export default {
    name: 'SignIn',
    computed: {
        ...mapGetters(["getCavachAccessToken", "getRedirectUrl", "getPresentationRequest", 'getOnChainIssuerConfig']),
        ...mapState(['hasLivelinessDone', 'hasKycDone'])
    },
    data() {
        return {
            isLoading: false,
            fullPage: true,
            toastMessage: "",
            toastType: "success",
            isToast: false,
            error: false,


            offlineSigner: null,
            userAddress: "",
            signingClient: null,
            nonSigningClient: null
        };
    },
    methods: {
        ...mapMutations(["setCavachAccessToken", "setRedirectUrl", "nextStep", "setPresentationRequest", 'setTenantSubdomain', 'setSSIAccessToken', 'setOnChainIssuerConfig']),
        ...mapActions(["getNewSession", "registerUser"]),
        loginWithGoogle() {
            webAuth.authorize({
                connection: 'google-oauth2',
                redirectUri: `${window.location.origin}/auth/${AUTH_PROVIDERS.GOOGLE}?`,
            });
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
        async connectWallet() {
            const requestedChainId = this.getOnChainIssuerConfig.chainId
            if (!requestedChainId) {
                throw new Error("ChainId not supported")
            }

            const chainConfig = SupportedChains.find(x => x.chainId == requestedChainId);
            if (!chainConfig) {
                throw new Error('Chain not supported for chainId requestedChainId ' + requestedChainId)
            }

            const chainId = chainConfig["chainId"];
            // const chainCoinDenom = chainConfig["feeCurrencies"][0]["coinMinimalDenom"]

            if (!window.getOfflineSigner || !window.keplr) {
                console.error("Please install keplr extension");
            } else {
                if (window.keplr.experimentalSuggestChain) {
                    try {
                        await window.keplr.experimentalSuggestChain(
                            chainConfig
                        );
                    } catch {
                        console.error("Failed to suggest the chain");
                    }
                } else {
                    console.error("Please use the recent version of keplr extension");
                }
            }

            await window.keplr.enable(chainId);
            this.$router.push(`/auth/${AUTH_PROVIDERS.KEPLR}`)
        }
    },
    async created() {
        const params = this.$route.query;
        if (WidgetConfig.steps.onChainId) {
            if (!params.chainId || !params.contractAddress) {
                console.log(this.getOnChainIssuerConfig)
                if (this.getOnChainIssuerConfig.chainId == '' || this.getOnChainIssuerConfig.contractAddress == '') {
                    console.log('Error: 401')
                    this.error = true
                    this.toast('Incorrect configuration for onchainId', "error");
                    return;
                }
            }

            this.setOnChainIssuerConfig({
                chainId: params.chainId || this.getOnChainIssuerConfig.chainId,
                contractAddress: params.contractAddress || this.getOnChainIssuerConfig.contractAddress
            })

        }

        if (!params.kycAccessToken || !params.pr || !params.ssiAccessToken) {
            if (this.getCavachAccessToken != '' && this.getPresentationRequest != '' && this.getSSIAccessToken != '') {
                console.log('Error: 401')
                this.error = true
                this.toast('Error initalization of widget!', "error");
                return;
            }
        }

        this.setCavachAccessToken(params.kycAccessToken || this.getCavachAccessToken)
        // this.setRedirectUrl(params.redirectUrl || this.getRedirectUrl)
        this.setPresentationRequest(params.pr || this.getPresentationRequest)
        this.setSSIAccessToken(params.ssiAccessToken || this.ssiAccessToken)

        const parsedAccessToken = this.parseJwt(params.kycAccessToken)
        this.setTenantSubdomain(parsedAccessToken.subdomain)

        try {
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