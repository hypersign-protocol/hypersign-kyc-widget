<template>
  <div>
    <v-btn type="button" class="btn btn-outline-dark btn-lg mb-2" @click="connectWallet()" :disabled="isDisable">
      <img src="../../../assets/keplr.jpeg" class="rounded" style="width: 20px" alt="Avatar" />
      Connect Keplr Wallet
    </v-btn>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import { getUserAddressFromOfflineSigner, getCosmosCoinLogo } from '@hypersign-protocol/hypersign-kyc-chains-metadata/cosmos/wallet/cosmos-wallet-utils'
import { createClient, createNonSigningClient } from '../../utils/cosmos-client'
export const AUTH_PROVIDERS = Object.freeze({
  GOOGLE: 'google',
  KEPLR: 'keplr',
  METAMASK: 'metamask',
})

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
    selectedBlockchainLogo() {
      return getCosmosCoinLogo(`${this.ecosystem}:${this.blockchain}:${this.chainId}`)
    },
  },
  methods: {
    ...mapMutations(['setOnChainIssuerConfig', 'setCosmosConnection']),

    async disconnect() {
      await window.keplr.disable()
    },
    async connectWallet() {
      const { ecosystem, blockchain } = { ecosystem: this.ecosystem, blockchain: this.blockchain }
      const { default: SupportedChains } = await import(`@hypersign-protocol/hypersign-kyc-chains-metadata/${ecosystem}/wallet/${blockchain}/${this.chainId}/chains`)

      if (!SupportedChains) {
        throw new Error('Ecosysem or blockchain is not supported')
      }

      const requestedChainId = this.chainId
      console.log(requestedChainId)
      const chainConfig = SupportedChains.find((x) => x.chainId === requestedChainId)
      if (!chainConfig) {
        throw new Error('Chain not supported for chainId requestedChainId ' + requestedChainId)
      }
      const chainId = chainConfig.chainId

      if (!window.getOfflineSigner || !window.keplr) {
        console.error('Please install keplr extension')
      } else {
        if (window.keplr.experimentalSuggestChain) {
          try {
            await window.keplr.experimentalSuggestChain(chainConfig)
          } catch {
            console.error('Failed to suggest the chain')
          }
        } else {
          console.error('Please use the recent version of keplr extension')
        }
      }

      await window.keplr.enable(chainId)
      const offlineSigner = window.getOfflineSigner(chainId)
      const userAddress = await getUserAddressFromOfflineSigner(offlineSigner)

      if (userAddress !== '') {
        const chainRPC = chainConfig.rpc
        const signingClient = await createClient(chainRPC, offlineSigner)
        const nonSigningClient = await createNonSigningClient(chainRPC)

        this.setCosmosConnection({
          signingClient,
          nonSigningClient,
          offlineSigner,
        })
        // this.setBlockchainUser({
        //     walletAddress: userAddress,
        //     chainId,
        //     ecosystem: this.ecosystem,
        //     blockchain: this.blockchain
        // })

        this.$emit('authEvent', {
          provider: AUTH_PROVIDERS.KEPLR,
          user: {
            walletAddress: userAddress,
          },
          status: 'success',
        })
      }
    },
  },
}
</script>
