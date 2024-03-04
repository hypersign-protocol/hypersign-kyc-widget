<script>

import { mapGetters, mapMutations, mapActions } from 'vuex';
import webAuth from '../utils/auth0Connection';
export default {
  name: 'AuthTication',
  components: {},
  computed: {
    ...mapGetters(["getActiveStep"])
  },
  methods: {
    ...mapMutations(["nextStep"]),
    ...mapActions(["registerUser", "syncUserData"]),
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

      const resp = await this.registerUser()
      console.log(resp)

      this.syncUserData()
      ///
      console.log('Inside mounted Auth')
      this.nextStep(3)
      this.$router.push({ path: "/" })

    } catch (e) {
      this.nextStep(2)
      this.$router.push({ path: "/" })
    }


  }
};


</script>

<style></style>
