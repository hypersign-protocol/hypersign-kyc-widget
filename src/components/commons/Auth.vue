<script>

import { mapGetters, mapMutations } from 'vuex';
export default {
  name: 'AuthTication',
  components: {},
  computed: {
    ...mapGetters(["getActiveStep"])
  },
  methods: {
    ...mapMutations(["nextStep"])
  },
  mounted() {
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
    console.log('Inside mounted Auth')
    this.nextStep(3)
    this.$router.push({ path: "/" })
  }
};


</script>

<style></style>
