<template>
  <div>
    <v-btn block color="secondary" @click="loginWithGoogle()" :disabled="isDisable"><i class="bi bi-google mx-1"></i> Continue with Google</v-btn>
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
