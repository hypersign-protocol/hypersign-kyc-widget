<style scoped>
.badge {
    padding: 5px;
    float: right;
    background-color: grey;
    border-radius: 43%;
    font-size: inherit;
    font-weight: bold;
    color: white;
    width: auto;
    text-align: center;
    align-content: center;
    margin-left: 5px;
}
</style>

<template>
    <div>
        <div class="card-body min-h-36">
            <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></load-ing>
            <PageHeading :header="'On-Chain ID'" :subHeader="'Mint your onchain identity'" :beta="true" />

            <div class="widget-card mt-4" style="width: 80%;margin:auto;min-height:200px"
                :style="`background-color: ${hypersign_proof.bgColor}`">
                <div class=" credential-row">

                    <!-- <div class=" mb-3" style="max-width: 540px;"> -->
                    <div class="row g-3" style="text-align: left;">
                        <div class="col-md-4">
                            <img :src="hypersign_proof.proof_type_image" class="img-fluid rounded-start" alt="..."
                                style="opacity: 0.7;">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">ProofOfKYC</h5>
                                <p class="card-text mt-2">{{ hypersign_proof.description }}</p>
                                <!-- <p class="card-text">

                                </p> -->

                                <!-- <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p> -->

                                <p class="card-text">
                                    <span style="visibility: hidden;" class="badge rounded-pill bg-secondary ">TYPE: {{
                                        hypersign_proof.sbt_code
                                    }}</span>
                                    <!-- <span class="badge rounded-pill bg-secondary ">TYPE: {{
                                        hypersign_proof.sbt_code
                                    }}</span> -->
                                    <button id="walletAddressDisconnect"
                                        class="btn btn-light border  rounded-pill btn-sm"
                                        :style="`background-color: ${getChainConfig.txExplorer.themeColor}`" disabled>
                                        <img :src="getChainConfig.currencies[0].coinImageUrl" class="rounded-circle"
                                            style="width: 20px;" alt="Avatar" /> {{ getChainConfig.chainName }}
                                    </button>
                                </p>
                                <div class="card-text">
                                    <div class="input-group input-group-sm mb-1 " v-if="connectedWalletAddress">
                                        <input type="text" class="form-control " placeholder="Your Wallet Address"
                                            v-model="connectedWalletAddress" disabled>
                                        <span class="input-group-text btn btn-outline-secondary"
                                            @click="disconnectWallet()" id="basic-addon2"><i
                                                class="bi bi-box-arrow-in-right"></i></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- <div class="row card-footer bg-transparent border-success"><span
                            class="badge rounded-pill bg-secondary"> <img
                                :src="getChainConfig.currencies[0].coinImageUrl" class="rounded-circle"
                                style="width: 30px;" alt="Avatar" /> Secondary</span></div> -->
                    <!-- </div> -->








                    <!-- <div class="row mb-3 py-2">
                        <div class="col-md-12">
                            <h3>ProofOfKYC</h3>

                            <div class="btn-group border  rounded-pill" style="float: left;" role="group"
                                id="userProfile">
                                <button type="button" id="walletAddressDisconnect"
                                    class="btn btn-light border  rounded-circle" title="Disconnect"
                                    :style="`background-color: ${getChainConfig.txExplorer.themeColor}`">
                                    <img :src="getChainConfig.currencies[0].coinImageUrl" class="rounded-circle"
                                        style="width: 30px;" alt="Avatar" />
                                </button>
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
                    </div> -->


                </div>
            </div>
            <div class="container">

                <div class="row mt-2">
                    <div class="col-md-12 center">



                        <template v-if="!showConnectWallet">
                            <button class="btn btn-outline-dark" @click="mint()">
                                <i class="bi bi-hammer"></i>
                                <!-- <img :src="getChainConfig.currencies[0].coinImageUrl" class="rounded-circle"
                                    style="width: 30px;" alt="Avatar" /> -->
                                Mint Your SBT
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
import NibiruLocalNetChainJson from '../../blockchains-metadata/cosmos/wallet/nibi/nibiru-localnet-0/chains'
import NibiruTestnetChainJson from '../../blockchains-metadata/cosmos/wallet/nibi/nibiru-testnet-1/chains'
// import ComdexChainJson from '../../blockchains-metadata/cosmos/wallet/comdex/chains'
import { constructKYCSBTMintMsg, constructQuerySBTContractMetadata } from '../../blockchains-metadata/cosmos/contract/msg';
import { createNonSigningClient, getCosmosChainConfig, HYPERSIGN_PROOF_TYPES } from '../../blockchains-metadata/cosmos/wallet/cosmos-wallet-utils'
import { STEP_NAMES, SUPPORTED_CREDENTIAL_TYPEE } from "@/config";
import MESSAGE from '../utils/lang/en';

export default {
    name: STEP_NAMES.OnChainId,
    components: {
        ConnectWalletButton
    },
    computed: {
        ...mapGetters(["getCavachAccessToken", "getVaultDataCredentials", "getRedirectUrl", 'getOnChainIssuerConfig']),
        ...mapState(['hasLivelinessDone', 'hasKycDone', 'cosmosConnection']),
        getChainConfig() {
            const { ecosystem, blockchain, chainId } = this.getOnChainIssuerConfig
            let SupportedChains;

            if (ecosystem === 'cosmos' && blockchain === 'nibi' && chainId === 'nibiru-localnet-0') {
                SupportedChains = NibiruLocalNetChainJson
            } else if (ecosystem === 'cosmos' && blockchain === 'nibi' && chainId === 'nibiru-testnet-1') {
                SupportedChains = NibiruTestnetChainJson
            }

            if (!SupportedChains) {
                throw new Error(MESSAGE.WALLET.ECO_SYSTEM_NOT_SUPPORTED)
            }
            const requestedChainId = this.getOnChainIssuerConfig.chainId
            const chainConfig = SupportedChains.find(x => x.chainId == requestedChainId);

            if (!chainConfig) {
                throw new Error(MESSAGE.WALLET.CHAIN_NOT_SUPPORTED + requestedChainId)
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
            },
            hypersign_proof: {
                "credential_id": "",
                "data": "",
                proof_type: "proof_of_k_y_c",
                description: "Proves that user has finished his/her KYC",
                bgColor: "#CCE5FF",
                sbt_code: "T2",
                proof_type_image: "https://cdn-icons-png.flaticon.com/128/17442/17442784.png"
            }
        };
    },
    methods: {
        ...mapMutations(["setCavachAccessToken", "setRedirectUrl", "nextStep", "setPresentationRequest", 'setTenantSubdomain', 'setSSIAccessToken']),
        ...mapActions(["getNewSession", 'verifySbtMint']),
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
                    throw new Error(MESSAGE.ON_CHAIN.INVALID_CONFIG_ERR)
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
            }, 5000);
        },


        // queryVaultDataCredentials(credentialType, trustedIssuer) {
        queryVaultDataCredentials() {
            console.log(1)
            if (!this.getVaultDataCredentials && this.getVaultDataCredentials.length <= 0) {
                return undefined
            }

            // const t = this.getVaultDataCredentials.filter(x => x.issuer == trustedIssuer)
            // if (!t && t.length <= 0) {
            //     return undefined
            // }

            const credeital = this.getVaultDataCredentials.find(credential => {
                if (credential.type.includes(SUPPORTED_CREDENTIAL_TYPEE.PassportCredential)) {
                    return credential
                }

                if (credential.type.includes(SUPPORTED_CREDENTIAL_TYPEE.GovernmentIdCredential)) {
                    return credential
                }
            });

            console.log(2)

            console.log(credeital)

            if (credeital) {
                return credeital
            } else {
                return undefined
            }
        },

        async mint() {
            try {
                this.isLoading = true
                const sbtTokenId = Math.floor(Math.random(100000) * 100000).toString(); // TODO: better random id
                // const sbtTokenUri = "ipfs://" + sbtTokenId; // TODO: remove hardcoding

                const smartContractMsg = constructKYCSBTMintMsg({ hypersign_proof: this.hypersign_proof });

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
                    this.toast(MESSAGE.ON_CHAIN.IDENTITY_SUCCESS)

                    // TODO: call server to udpate status
                    await this.verifySbtMint({
                        blockchainLabel: this.blockchainLabel,
                        sbtContractAddress: this.getOnChainIssuerConfig.contractAddress,
                        ownerWalletAddress: this.connectedWalletAddress,
                        tokenId: sbtTokenId, // TODO what is this token ID.
                        transactionHash: result.transactionHash
                    });
                    this.isLoading = false
                    // Implement feature in caach server to capture user's miniing step
                    setTimeout(() => {
                        this.nextStep();
                    }, 2000)


                }

            } catch (e) {
                this.toast(e.message, 'error')
                this.isLoading = false
            }
        },

        async disconnectWallet() {
            this.connectedWalletAddress = ""
            await window.keplr.disable()
        }

    },
    async mounted() {
        this.nft.metadata = await this.getContractMetadata(this.getOnChainIssuerConfig.sbtContractAddress)
        const getKycCredential = this.queryVaultDataCredentials()
        if (getKycCredential) {
            console.log(getKycCredential)
            console.log(getKycCredential.type)
        }
        const ProofType = HYPERSIGN_PROOF_TYPES.ProofOfKYC;
        this.hypersign_proof =
        {
            "credential_id": "",
            "data": "",
            "description": ProofType.description,
            "proof_type_image": ProofType.image,
            "sbt_code": ProofType.sbtCode,
            "proof_type": ProofType.type
        }
    }

}
</script>