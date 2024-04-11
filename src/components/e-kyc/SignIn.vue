<template>
    <div class="card-body">
        <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></load-ing>
        <PageHeading :header="'Login'" :subHeader="'Create/Retrive your decentralized identity'" />
        <div class="mt-4 p-4" style="width: 70%;margin:auto;">
            <div>
                <ConnectWalletButton @authEvent="myEventListener" :is-disable="error" />
                <GoogleButton :is-disable="error" />
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
// import webAuth from '../utils/auth0Connection';
import { mapMutations, mapActions, mapGetters, mapState } from "vuex";
// import { AUTH_PROVIDERS } from '../../config'
import ConnectWalletButton from '../commons/ConnectWalletButton.vue';
import GoogleButton from '../commons/GoogleButton.vue';
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
    },
    async created() {
        const params = this.$route.query;

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