<template>
    <div>
        <button type="button" class="btn btn-outline-dark btn-lg mb-2" style="width: 100%;" @click="connectWallet()"
            :disabled="isDisable">
            <img :src="selectedBlockchainLogo" width="20" height="20"> Connect Keplr</button>
    </div>
</template>
<script>
import { mapMutations, mapGetters } from "vuex";
import { getUserAddressFromOfflineSigner, createClient, createNonSigningClient } from '../../../blockchains-metadata/cosmos/wallet/cosmos-wallet-utils'
import { getCosmosCoinLogo } from '../../../blockchains-metadata/cosmos/wallet/cosmos-wallet-utils'
export const AUTH_PROVIDERS = Object.freeze({
    GOOGLE: 'google',
    KEPLR: 'keplr',
    METAMASK: 'metamask',
})

export default {
    props: {
        isDisable: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        ...mapGetters(['getOnChainIssuerConfig']),

        selectedBlockchainLogo() {
            return getCosmosCoinLogo(`${this.getOnChainIssuerConfig.ecosystem}:${this.getOnChainIssuerConfig.blockchain}:${this.getOnChainIssuerConfig.chainId}`)
        }
    },
    methods: {
        ...mapMutations(['setOnChainIssuerConfig', 'setCosmosConnection']),

        async connectWallet() {
            const { ecosystem, blockchain } = this.getOnChainIssuerConfig
            const { default: SupportedChains } = await import(`../../../blockchains-metadata/${ecosystem}/wallet/${blockchain}/chains`)

            if (!SupportedChains) {
                throw new Error('Ecosysem or blockchain is not supported')
            }

            const requestedChainId = this.getOnChainIssuerConfig.chainId
            const chainConfig = SupportedChains.find(x => x.chainId == requestedChainId);
            if (!chainConfig) {
                throw new Error('Chain not supported for chainId requestedChainId ' + requestedChainId)
            }

            const chainId = chainConfig["chainId"];

            if (!window.getOfflineSigner || !window.keplr) {
                console.error("Please install keplr extension");
            } else {
                if (window.keplr.experimentalSuggestChain) {
                    try {
                        await window.keplr.experimentalSuggestChain(
                            chainConfig
                        );
                    } catch {
                        console.error("Failed to suggest the chain");
                    }
                } else {
                    console.error("Please use the recent version of keplr extension");
                }
            }

            await window.keplr.enable(chainId);
            const offlineSigner = window.getOfflineSigner(chainId)
            const userAddress = await getUserAddressFromOfflineSigner(offlineSigner);

            if (userAddress != "") {
                const chainRPC = chainConfig["rpc"]
                const signingClient = await createClient(chainRPC, offlineSigner);
                const nonSigningClient = await createNonSigningClient(chainRPC);

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
                        walletAddress: userAddress
                    },
                    status: 'success'
                })
            }

        }
    }

}


</script>
