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
        ...mapGetters(["getCavachAccessToken", "getRedirectUrl"]),
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
        ...mapMutations(["setCavachAccessToken", "setRedirectUrl", "nextStep",]),
        ...mapActions(["getNewSession", "registerUser"]),
        loginWithGoogle() {
            console.log('Inside sign in with google')
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
    },
    async created() {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries());
        if (!params.cavachAccessToken || !params.redirectUrl) {
            if (this.getCavachAccessToken != '' && !this.getRedirectUrl != '') {
                console.log('Error: 401')
                this.error = true
                this.toast('Error initalization of widget!', "error");
                return;
            }
        }

        this.setCavachAccessToken(params.cavachAccessToken || this.getCavachAccessToken)
        this.setRedirectUrl(params.redirectUrl || this.getRedirectUrl)

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