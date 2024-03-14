<template>
    <div class="card-body" style="max-height:750px;">
        <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></load-ing>
        <PageHeading :header="'Login'" :subHeader="'Create/Retrive your decentralized identity'" />
        <div class="center">
            <div style="position: absolute; bottom: 50px;">
                <button class="btn btn-outline-dark btn-lg" style="width: 100%;" @click="loginWithGoogle"
                    data-cy="login-with-google" :disabled="error">
                    <i class="bi bi-google"></i> Continue with Google
                </button>
                <ConsentBox />
            </div>

        </div>
        <MessageBox :msg="toastMessage" :type="toastType" v-if="isToast" class="bottom" />
        <!-- <MessageBox msg="Hello" type="success" v-if="true" class="bottom" /> -->
    </div>
</template>

<script>
import webAuth from '../utils/auth0Connection';
import { mapMutations, mapActions, mapGetters, mapState } from "vuex";

export default {
    name: 'SignIn',
    computed: {
        ...mapGetters(["getCavachAccessToken", "getRedirectUrl", "getPresentationRequest"]),
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
        };
    },
    methods: {
        ...mapMutations(["setCavachAccessToken", "setRedirectUrl", "nextStep", "setPresentationRequest", 'setTenantSubdomain', 'setSSIAccessToken']),
        ...mapActions(["getNewSession", "registerUser"]),
        loginWithGoogle() {
            webAuth.authorize({
                connection: 'google-oauth2',
                redirectUri: `${window.location.origin}/auth/google?`,
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
        }
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