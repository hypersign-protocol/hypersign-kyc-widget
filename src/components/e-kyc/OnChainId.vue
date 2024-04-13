<template>
    <div>
        <div class="card-body min-h-36">
            <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></load-ing>
            <PageHeading :header="'On-Chain ID'" :subHeader="'Mint your onchain identity'" />

            <div class="widget-card mt-4" style="width: 90%;margin:auto;">
                <div class=" credential-row">
                    <div class="row mb-3 py-2">
                        <div class="col-md-12">
                            <div class="btn-group border border-dark rounded-pill" style="float: left;" role="group"
                                id="userProfile">
                                <button type="button" id="walletAddressDisconnect"
                                    class="btn btn-light border border-dark rounded-circle" title="Disconnect"
                                    :style="`background-color: ${getChainConfig.txExplorer.themeColor}`">
                                    <img :src="getChainConfig.currencies[0].coinImageUrl" height="30"></button>
                                <button type="button" class="btn btn-light " style="width:200px; text-align: left;"
                                    id="userWalletAddressIp" disabled>
                                    <h5>{{ getChainConfig.chainName }}</h5>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-3" style="text-align: left;">
                            <strong>Network Id</strong>
                        </div>
                        <div class="col-md-9" style="text-align: left;">
                            <label class="form-label"> {{ getChainConfig.chainId }}</label>
                        </div>
                    </div>

                    <!-- <div class="row">
                    <div class="col-md-3" style="text-align: left;">
                        <strong>Token Id</strong>
                    </div>
                    <div class="col-md-9" style="text-align: left;">
                        <label class="form-label">{{ nft.tokenId }}</label>
                    </div>
                </div> -->

                    <div class="row">
                        <div class="col-md-3" style="text-align: left;">
                            <strong>Token Name</strong>
                        </div>
                        <div class="col-md-9" style="text-align: left;">
                            <label class="form-label">{{ nft.metadata?.name ? nft.metadata.name : "-" }}</label>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-3" style="text-align: left;">
                            <strong>Token Symbol</strong>
                        </div>
                        <div class="col-md-9" style="text-align: left;">
                            <label class="form-label">{{ nft.metadata?.symbol ? nft.metadata.symbol : '-' }}</label>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-3" style="text-align: left;">
                            <strong>Author</strong>
                        </div>
                        <div class="col-md-9" style="text-align: left; word-break: break-all;">
                            <label class="form-label">{{ cosmosConnection.userAddress ? cosmosConnection.userAddress :
                                '-'
                                }}</label>
                        </div>
                    </div>


                </div>
            </div>
            <div class="container">
                <div class="row mt-2">
                    <div class="col-md-12 center">
                        <template v-if="!showConnectWallet">
                            <button class="btn btn-outline-dark" @click="mint()">
                                <i class="bi bi-hammer"></i> Mint
                            </button>
                        </template>
                        <ConnectWalletButton @authEvent="myEventListener" v-if="showConnectWallet" style="width:50%" />
                    </div>
                </div>
            </div>
        </div>
        <MessageBox :msg="toastMessage" :type="toastType" v-if="isToast" />
    </div>
</template>

<script>
import { mapMutations, mapActions, mapGetters, mapState } from "vuex";
import { constructSBTMintMsg, constructQuerySBTContractMetadata, smartContractExecuteRPC, smartContractQueryRPC } from '../../blockchains-metadata/cosmos/smartContract'
import ConnectWalletButton from "../commons/authButtons/ConnectWalletButton.vue";
import NibiruChainJson from '../../blockchains-metadata/cosmos/nibiru/chains'
import ComdexChainJson from '../../blockchains-metadata/cosmos/comdex/chains'
export default {
    name: 'OnChainId',
    components: {
        ConnectWalletButton
    },
    computed: {
        ...mapGetters(["getCavachAccessToken", "getRedirectUrl", "getPresentationRequest", 'getOnChainIssuerConfig']),
        ...mapState(['hasLivelinessDone', 'hasKycDone', 'cosmosConnection']),
        getChainConfig() {
            const { ecosystem, blockchain } = this.getOnChainIssuerConfig
            let SupportedChains;
            if (ecosystem === 'cosmos' && blockchain === 'comdex') {
                SupportedChains = ComdexChainJson
            } else if (ecosystem === 'cosmos' && blockchain === 'nibiru') {
                SupportedChains = NibiruChainJson
            }

            if (!SupportedChains) {
                throw new Error('Ecosysem or blockchain is not supported')
            }
            const requestedChainId = this.getOnChainIssuerConfig.chainId
            const chainConfig = SupportedChains.find(x => x.chainId == requestedChainId);

            if (!chainConfig) {
                throw new Error('Chain not supported for chainId requestedChainId ' + requestedChainId)
            }
            return chainConfig
        },
        showConnectWallet() {
            if (this.cosmosConnection && Object.keys(this.cosmosConnection).length > 0) {
                return false
            } else return true
        }
    },
    data() {
        return {
            isLoading: false,
            fullPage: true,
            toastMessage: "",
            toastType: "success",
            isToast: false,
            error: false,


            nft: {
                metadata: null,
            }
        };
    },
    methods: {
        ...mapMutations(["setCavachAccessToken", "setRedirectUrl", "nextStep", "setPresentationRequest", 'setTenantSubdomain', 'setSSIAccessToken']),
        ...mapActions(["getNewSession", "registerUser"]),
        async myEventListener(data) {
            console.log('Inside myEventListener')
            console.log(data)
            this.nft.metadata = await this.getContractMetadata(this.getOnChainIssuerConfig.contractAddress)
        },
        async getContractMetadata(activeSmartContractAddress) {
            const queryMetadataMsg = constructQuerySBTContractMetadata()
            const queryMetadataMsgResult = await smartContractQueryRPC(
                this.cosmosConnection.signingClient,
                activeSmartContractAddress, queryMetadataMsg);

            return queryMetadataMsgResult
        },
        toast(msg, type = "success") {
            this.isToast = true;
            this.toastMessage = msg;
            this.toastType = type;

            setTimeout(() => {
                this.isToast = false;
                this.toastMessage = "";
            }, 2000);
        },

        async mint() {
            try {
                this.isLoading = true
                const sbtTokenId = Math.floor(Math.random(100000) * 100000).toString(); // TODO: better random id
                const sbtTokenUri = "ipfs://" + sbtTokenId; // TODO: remove hardcoding

                console.log(this.cosmosConnection.userAddress,
                    sbtTokenId,
                    sbtTokenUri)
                const smartContractMsg = constructSBTMintMsg(
                    this.cosmosConnection.userAddress,
                    sbtTokenId,
                    sbtTokenUri);

                // Perform the CreateTodo Smart Contract Execution
                // Note: This is a blockchain transaction
                const chainConfig = this.getChainConfig
                const chainCoinDenom = chainConfig["feeCurrencies"][0]["coinMinimalDenom"]
                const result = await smartContractExecuteRPC(
                    this.cosmosConnection.signingClient,
                    chainCoinDenom,
                    this.cosmosConnection.userAddress,
                    this.getOnChainIssuerConfig.contractAddress,
                    smartContractMsg);

                if (result) {
                    console.log(result)
                    this.toast('Successfully minted your identity')
                    this.isLoading = false

                    // TODO: call server to udpate status
                    this.nextStep();

                }

            } catch (e) {
                console.error(e.message)
                this.toast(e.message, 'error')
                this.isLoading = false
            }
        }


    },
    async mounted() {
        this.nft.metadata = await this.getContractMetadata(this.getOnChainIssuerConfig.contractAddress)
    }


}
</script>