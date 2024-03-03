<template>

    <div class="body">
        <Button @click="loginWithGoogle" data-cy="login-with-google">
            Continue with Google
        </Button>
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