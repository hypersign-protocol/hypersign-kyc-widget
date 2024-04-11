<template>
    <div>
        <button type="button" class="btn btn-outline-dark btn-lg mb-2" style="width: 100%;" @click="connectWallet()">
            <i class="bi bi-currency-bitcoin"></i> Connect Keplr</button>
    </div>
</template>
<script>
import WidgetConfig from '../utils/widget.config' // '../../utils/widget.config'
import SupportedChains from '../utils/chains';
import { mapGetters, mapMutations } from "vuex";
import { getUserAddressFromOfflineSigner, createClient, createNonSigningClient } from '../utils/cosmos-wallet-utils'
import { AUTH_PROVIDERS } from '@/config';

export default {

    computed: {
        ...mapGetters(['getOnChainIssuerConfig']),
    },
    async created() {

        const params = this.$route.query;
        if (WidgetConfig.steps.onChainId) {
            if (!params.chainId || !params.contractAddress) {
                console.log(this.getOnChainIssuerConfig)
                if (this.getOnChainIssuerConfig.chainId == '' || this.getOnChainIssuerConfig.contractAddress == '') {
                    console.log('Error: 401')
                    this.error = true
                    this.toast('Incorrect configuration for onchainId', "error");
                    return;
                }
            }

            this.setOnChainIssuerConfig({
                chainId: params.chainId || this.getOnChainIssuerConfig.chainId,
                contractAddress: params.contractAddress || this.getOnChainIssuerConfig.contractAddress
            })

        }
    },


    methods: {
        ...mapMutations(['setOnChainIssuerConfig', 'setCosmosConnection']),
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
            // const chainCoinDenom = chainConfig["feeCurrencies"][0]["coinMinimalDenom"]

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
