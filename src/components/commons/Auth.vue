<template>
  <load-ing :active.sync="isLoadingPage" :can-cancel="true" :is-full-page="fullPage"></load-ing>
</template>

<script>

import { mapGetters, mapMutations, mapActions } from 'vuex';
import webAuth from '../utils/auth0Connection';
import { AUTH_PROVIDERS } from '../../config'
import SupportedChains from '../utils/chains';
import { getUserAddressFromOfflineSigner, createClient, createNonSigningClient } from '../utils/cosmos-wallet-utils'
export default {
  name: 'AuthTication',
  components: {},
  computed: {
    ...mapGetters(["getActiveStep", 'getOnChainIssuerConfig'])
  },
  data() {
    return {
      isLoadingPage: false,
      fullPage: true,


      offlineSigner: null,
      userAddress: "",
      signingClient: null,
      nonSigningClient: null
    }
  },
  methods: {
    ...mapMutations(["nextStep", "setProfile", "setCosmosConnection"]),
    ...mapActions(["registerUser"]),
    async getUserInfo(accessToken) {
      if (accessToken) {
        const that = this;
        webAuth.client.userInfo(accessToken, function (err, user) {
          if (err) {
            console.error(err)
          }
          that.$store.commit('setProfile', { ...user, accessToken });
        })
      }
    },
    async connectWallet() {
      const requestedChainId = this.getOnChainIssuerConfig.chainId
      if (!requestedChainId) {
        throw new Error("ChainId not supported")
      }

      const chainConfig = SupportedChains.find(x => x.chainId == requestedChainId);
      if (!chainConfig) {
        throw new Error('Chain not supported for chainId requestedChainId ' + requestedChainId)
      }

      const chainId = chainConfig["chainId"];
      this.offlineSigner = window.getOfflineSigner(chainId)
      this.userAddress = await getUserAddressFromOfflineSigner(this.offlineSigner);
      console.log("User Address: ", this.userAddress)

      if (this.userAddress != "") {
        // walletConnectButton.innerText = ""
        // walletConnectButton.innerText = userAddress

        // Define the Keplr Offline singer client
        const chainRPC = chainConfig["rpc"]
        this.signingClient = await createClient(chainRPC, this.offlineSigner);
        this.nonSigningClient = await createNonSigningClient(chainRPC);

        console.log('Storing all essential objects in store')
        this.setCosmosConnection({
          signingClient: this.signingClient,
          nonSigningClient: this.nonSigningClient,
          offlineSigner: this.offlineSigner,
          userAddress: this.userAddress,
          chainId,
        })
      }
    }
  },
  async mounted() {
    try {
      const provider = this.$route.params['provider']
      console.log(provider)
      if (!provider) {
        throw new Error('No provider specified')
      }

      if (provider === AUTH_PROVIDERS.GOOGLE) {
        const routeHash = this.$route.hash;
        const accessToken = routeHash.split("&")[0].split("=")[1];
        const authToken = routeHash.split("&")[5].split("=")[1];
        const payload = {
          provider: AUTH_PROVIDERS.GOOGLE,
          accessToken,
          authToken
        }
        this.$store.commit('setThridPartyAuth', payload);


        ///
        console.log('Before calling getUserInfo')
        this.getUserInfo(accessToken)
        this.isLoadingPage = true;

        setTimeout(async () => {
          console.log('Before calling registerUser')
          await this.registerUser()
          console.log('After calling registerUser')
          ///
          console.log('Inside mounted Auth')
          this.nextStep(1)
          this.isLoadingPage = false
          this.$router.push({ path: "/" })
        }, 1500)
      } else if (provider === AUTH_PROVIDERS.KEPLR) {
        console.log('Provider is Keplr')
        await this.connectWallet()
        this.nextStep(1)
        this.$router.push({ path: "/" })
      }

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
