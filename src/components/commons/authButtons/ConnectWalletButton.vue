<template>
    <div>
        <button type="button" class="btn btn-outline-dark btn-lg mb-2" style="width: 100%;" @click="connectWallet()"
            :disabled="isDisable">
            <i class="bi bi-currency-bitcoin"></i> Connect Keplr</button>
    </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import { getUserAddressFromOfflineSigner, createClient, createNonSigningClient } from '../../../blockchains-metadata/cosmos/cosmos-wallet-utils'
import { AUTH_PROVIDERS } from '@/config';
export default {
    props: {
        isDisable: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        ...mapGetters(['getOnChainIssuerConfig']),
    },

    methods: {
        ...mapMutations(['setOnChainIssuerConfig', 'setCosmosConnection']),
        async connectWallet() {
            const { ecosystem, blockchain } = this.getOnChainIssuerConfig
            const { default: SupportedChains } = await import(`../../../blockchains-metadata/${ecosystem}/${blockchain}/chains`)

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
            console.log("User Address: ", userAddress)

            if (userAddress != "") {
                const chainRPC = chainConfig["rpc"]
                const signingClient = await createClient(chainRPC, offlineSigner);
                const nonSigningClient = await createNonSigningClient(chainRPC);

                console.log('Storing all essential objects in store')
                this.setCosmosConnection({
                    signingClient,
                    nonSigningClient,
                    offlineSigner,
                    userAddress,
                    chainId,
                })

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
