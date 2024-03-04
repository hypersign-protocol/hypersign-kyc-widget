<template>
    <div class="card-body" style="max-height:750px;">
        <!-- <load-ing
      :active.sync="isLoadingPage"
      :can-cancel="true"
      :is-full-page="fullPage"
    ></load-ing> -->
        <PageHeading :header="'Login'" :subHeader="'Create/Retrive your decentralized identity'" />
        <div class="center">
            <div class="widget-card">
                <button class="btn btn-outline-dark btn-lg" @click="loginWithGoogle" data-cy="login-with-google">
                    <i class="bi bi-google"></i> Continue with Google
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import webAuth from '../utils/auth0Connection';

export default {
    name: 'SignIn',
    methods: {
        loginWithGoogle() {
            console.log('Inside sign in with google')
            webAuth.authorize({
                connection: 'google-oauth2',
                redirectUri: `${window.location.origin}/auth/google?`,
            });
        }
    }


}
</script>