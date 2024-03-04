<template>
  <load-ing :active.sync="isLoadingPage" :can-cancel="true" :is-full-page="fullPage"></load-ing>
</template>

<script>

import { mapGetters, mapMutations, mapActions } from 'vuex';
import webAuth from '../utils/auth0Connection';
export default {
  name: 'AuthTication',
  components: {},
  computed: {
    ...mapGetters(["getActiveStep"])
  },
  data() {
    return {
      isLoadingPage: false,
      fullPage: true
    }
  },
  methods: {
    ...mapMutations(["nextStep"]),
    ...mapActions(["registerUser"]),
    getUserInfo(accessToken) {
      if (accessToken) {
        const that = this;
        webAuth.client.userInfo(accessToken, function (err, user) {
          if (err) {
            console.error(err)
          }
          that.$store.commit('setProfile', { ...user, accessToken });
        })
      }
    }
  },
  async mounted() {
    try {

      console.log('Inside mounted Auth')
      const routeHash = this.$route.hash;
      const accessToken = routeHash.split("&")[0].split("=")[1];
      const authToken = routeHash.split("&")[5].split("=")[1];
      const payload = {
        provider: 'Google',
        accessToken,
        authToken
      }
      this.$store.commit('setThridPartyAuth', payload);


      ///
      this.getUserInfo(accessToken)
      this.isLoadingPage = true
      console.log('Before calling registerUser')
      await this.registerUser()
      console.log('After calling registerUser')



      ///
      console.log('Inside mounted Auth')
      this.nextStep(3)
      this.isLoadingPage = false
      this.$router.push({ path: "/" })

    } catch (e) {
      console.log('error =' + e)
      this.isLoadingPage = false
      this.nextStep(1)
      this.$router.push({ path: "/" })
    }


  }
};


</script>

<style></style>
