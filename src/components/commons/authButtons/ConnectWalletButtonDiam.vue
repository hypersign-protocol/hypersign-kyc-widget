<template>
  <div>
    <button
      type="button"
      class="btn btn-outline-dark btn-lg mb-2"
      @click="connectWallet()"
      :disabled="isDisable || !ifDiamInstalled"
    >
      <img
        :src="getChainDetail().logoUrl"
        class="rounded"
        style="width: 20px"
        alt="Avatar"
      />
      Connect DIAM Wallet
    </button>
    <small
      style="color: indianred; text-decoration: underline"
      v-if="!ifDiamInstalled"
      ><a
        href="https://chromewebstore.google.com/detail/diam-wallet/oakkognifoojdbfjaccegangippipdmn?hl=en"
        target="_blank"
        >DIAM Wallet extention</a
      >
      not installed in your browser</small
    >
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import {
  getStellarCoinLogo,
  getStellarChainConfig,
} from '@hypersign-protocol/hypersign-kyc-chains-metadata/stellar/wallet/stellar-wallet-utils'
import { AUTH_PROVIDERS } from '../../../config'

export default {
  props: {
    isDisable: {
      type: Boolean,
      default: false,
    },
    ecosystem: {
      type: String,
      default: 'cosmos',
    },
    blockchain: {
      type: String,
      default: 'nibiru',
    },
    chainId: {
      type: String,
      default: 'nibiru-localnet-0',
    },
  },
  computed: {
    blockchainlabel() {
      return `${this.ecosystem}:${this.blockchain}:${this.chainId}`
    },
    selectedBlockchainLogo() {
      return getStellarCoinLogo(this.blockchainlabel)
    },
    ifDiamInstalled() {
      return !!window.diam
    },
  },
  methods: {
    ...mapMutations(['setCosmosConnection']),
    getChainDetail() {
      console.log(this.blockchainlabel)
      const config = getStellarChainConfig(this.blockchainlabel)

      return {
        chainName: config.chainName,
        chainId: config.chainId,
        logoUrl: config.stakeCurrency.coinImageUrl,
        tx_explorer: config.txExplorer.txUrl,
      }
    },
    async getSigningClient(chainId) {
      return (xdr) => {
        if (!window.diam) {
          throw new Error('DIAM Wallet not installed')
        }
        return window.diam.sign(xdr, true, chainId)
      }
    },
    async connectWallet() {
      if (!window.diam) {
        throw new Error('Please install the DIAM wallet extension')
      }

      const result = await window.diam.connect()
      if (result && result.status === 404) {
        throw new Error(result.message)
      }

      const walletAddress = result.walletAddress
        ? result.walletAddress
        : result.message[0].diamPublicKey

      if (!walletAddress) {
        throw new Error('No wallet address found')
      }

      if (walletAddress !== '') {
        const signingClient = await this.getSigningClient(this.chainId) // createClient(chainRPC, offlineSigner);
        const nonSigningClient = await this.getSigningClient(this.chainId)

        this.setCosmosConnection({
          signingClient,
          nonSigningClient,
          offlineSigner: null,
        })

        // this.setBlockchainUser({
        //     walletAddress: walletAddress,
        //     chainId: this.chainId,
        //     ecosystem: this.ecosystem,
        //     blockchain: this.blockchain
        // })

        this.$emit('authEvent', {
          provider: AUTH_PROVIDERS.DIAM,
          user: {
            walletAddress,
          },
          status: 'success',
        })
      }
    },
  },
}
</script>
