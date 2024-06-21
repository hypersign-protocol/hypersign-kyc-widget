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
                            <label class="form-label">{{ connectedWalletAddress ? connectedWalletAddress :
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
                        <!-- <ConnectWalletButton @authEvent="myEventListener" v-if="showConnectWallet" style="width:50%" /> -->


                        <ConnectWalletButton :ecosystem="this.getOnChainIssuerConfig.ecosystem"
                            :blockchain="this.getOnChainIssuerConfig.blockchain"
                            :chainId="this.getOnChainIssuerConfig.chainId" @authEvent="myEventListener"
                            style="width:50%" v-if="showConnectWallet" />
                    </div>
                </div>
            </div>
        </div>
        <MessageBox :msg="toastMessage" :type="toastType" v-if="isToast" />
    </div>
</template>

<script>
import { mapMutations, mapActions, mapGetters, mapState } from "vuex";
import { smartContractExecuteRPC } from '../../blockchains-metadata/cosmos/contract/execute'
import { smartContractQueryRPC } from '../../blockchains-metadata/cosmos/contract/query'
import ConnectWalletButton from "../commons/authButtons/ConnectWalletButton.vue";
import NibiruChainJson from '../../blockchains-metadata/cosmos/wallet/nibi/chains'
import ComdexChainJson from '../../blockchains-metadata/cosmos/wallet/comdex/chains'
import { constructKYCSBTMintMsg, constructQuerySBTContractMetadata } from '../../blockchains-metadata/cosmos/contract/msg';
import { createNonSigningClient, getCosmosChainConfig } from '../../blockchains-metadata/cosmos/wallet/cosmos-wallet-utils'
import { STEP_NAMES } from "@/config";
export default {
    name: STEP_NAMES.OnChainId,
    components: {
        ConnectWalletButton
    },
    computed: {
        ...mapGetters(["getCavachAccessToken", "getRedirectUrl", 'getOnChainIssuerConfig']),
        ...mapState(['hasLivelinessDone', 'hasKycDone', 'cosmosConnection']),
        getChainConfig() {
            const { ecosystem, blockchain } = this.getOnChainIssuerConfig
            let SupportedChains;
            if (ecosystem === 'cosmos' && blockchain === 'comdex') {
                SupportedChains = ComdexChainJson
            } else if (ecosystem === 'cosmos' && blockchain === 'nibi') {
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
            if (this.cosmosConnection && Object.keys(this.cosmosConnection).length > 0 && this.connectedWalletAddress != '') {
                return false
            } else return true
        },
        blockchainLabel() {
            return `${this.getOnChainIssuerConfig.ecosystem}:${this.getOnChainIssuerConfig.blockchain}:${this.getOnChainIssuerConfig.chainId}`
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
            connectedWalletAddress: "",
            nft: {
                metadata: null,
            }
        };
    },
    methods: {
        ...mapMutations(["setCavachAccessToken", "setRedirectUrl", "nextStep", "setPresentationRequest", 'setTenantSubdomain', 'setSSIAccessToken']),
        ...mapActions(["getNewSession", "registerUser", 'verifySbtMint']),
        async myEventListener(data) {
            this.nft.metadata = await this.getContractMetadata(this.getOnChainIssuerConfig.sbtContractAddress)
            this.connectedWalletAddress = data.user.walletAddress
        },
        async getContractMetadata(activeSmartContractAddress) {
            let client = null;
            if (this.cosmosConnection.nonSigningClient) {
                client = this.cosmosConnection.nonSigningClient
            } else {
                if (!this.getOnChainIssuerConfig) {
                    throw new Error('Invalid configuration, please reload the widget and try again')
                }
                const chainConfig = getCosmosChainConfig(this.blockchainLabel)
                client = await createNonSigningClient(chainConfig['rpc']);
            }

            const queryMetadataMsg = constructQuerySBTContractMetadata()
            const queryMetadataMsgResult = await smartContractQueryRPC(client, activeSmartContractAddress, queryMetadataMsg);
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

                const smartContractMsg = constructKYCSBTMintMsg(
                    this.connectedWalletAddress,
                    sbtTokenId,
                    sbtTokenUri);

                // Perform the CreateTodo Smart Contract Execution
                // Note: This is a blockchain transaction
                const chainConfig = this.getChainConfig
                const chainCoinDenom = chainConfig["feeCurrencies"][0]["coinMinimalDenom"]
                const result = await smartContractExecuteRPC(
                    this.cosmosConnection.signingClient,
                    chainCoinDenom,
                    this.connectedWalletAddress,
                    this.getOnChainIssuerConfig.contractAddress,
                    smartContractMsg);

                if (result) {
                    this.toast('Successfully minted your identity')


                    // TODO: call server to udpate status
                    await this.verifySbtMint({
                        blockchainLabel: this.blockchainLabel,
                        sbtContractAddress: this.getOnChainIssuerConfig.contractAddress,
                        ownerWalletAddress: this.connectedWalletAddress,
                        tokenId: sbtTokenId,
                        transactionHash: result.transactionHash
                    });
                    this.isLoading = false
                    // Implement feature in caach server to capture user's miniing step
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
        this.nft.metadata = await this.getContractMetadata(this.getOnChainIssuerConfig.sbtContractAddress)
    }


}
</script>