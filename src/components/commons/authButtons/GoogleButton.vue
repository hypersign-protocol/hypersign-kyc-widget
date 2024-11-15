<template>
  <div>
    <button class="btn btn-outline-dark btn-lg" style="width: 100%" @click="loginWithGoogle()" :disabled="isDisable"><i class="bi bi-google"></i> Continue with Google</button>
  </div>
</template>

<script>
import webAuth from '../..//utils/auth0Connection'
import { AUTH_PROVIDERS } from '@/config'

export default {
  props: {
    isDisable: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    loginWithGoogle() {
      webAuth.authorize({
        connection: 'google-oauth2',
        redirectUri: `${window.location.origin}/auth/${AUTH_PROVIDERS.GOOGLE}?`,
      })
    },
  },
}
</script>
