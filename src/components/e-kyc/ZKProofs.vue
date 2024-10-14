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

.proofCard {
    margin: auto;
    min-height: 150px;
    max-height: 250px;
    float: left;
    width: 80%;
    /* min-width: 250px */
}
</style>

<template>
    <div>
        <div class="container card-body min-h-36">
            <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></load-ing>
            <PageHeading :header="'Proof & OnChain ID'" :subHeader="'Get Proof and Mint Your Onchain ID'"
                :beta="true" />

            <div class="row col-md-12" style="max-height: 500px;  overflow-y: auto; overflow-x: hidden;">
                <div class="row widget-card mt-2 proofCard" v-for="hypersign_proof in hypersign_proofs"
                    v-bind:key="hypersign_proof.type" :style="`background-color: ${hypersign_proof.bgColor}`">
                    <div class="row" style="text-align: left;">
                        <div class="col-md-2 center">
                            <img :src="hypersign_proof.proof_type_image" class="img-fluid rounded-start" alt="..."
                                style="opacity: 0.7;">
                        </div>
                        <div class="col-md-9">
                            <div class="card-body">
                                <h5 class="card-title">{{ hypersign_proof.proof_type }}</h5>
                                <p class="card-text mt-2">{{ hypersign_proof.description }}</p>


                                <template v-if="!hypersign_proof.zkProof">
                                    <button class="btn btn-outline-dark" @click="getProof(hypersign_proof)">
                                        <i class="bi bi-shield-lock"></i>
                                        Get Proof Now
                                    </button>
                                </template>
                                <!-- <template v-else-if="!hypersign_proof.zkSBT">
                                    <button class="btn btn-outline-dark" @click="mint(hypersign_proof)">
                                        <i class="bi bi-hammer"></i>
                                        Mint Your SBT
                                    </button>
                                </template> -->
                            </div>
                        </div>
                        <div class="col-md-1" v-if="hypersign_proof.zkProof">
                            <i class="bi bi-check2-circle" style="font-size:xx-large"></i>
                        </div>
                    </div>
                </div>
            </div>



            <div class="container mt-3">
                <div class="d-grid gap-1 " style="width: 20%;margin: auto;">
                    <button class="btn btn-outline-dark" @click="nextStep()">
                        Next
                    </button>
                </div>
            </div>
            <div class="container" style="display: none;">

                <div class="row mt-2">
                    <div class="col-md-12 center">
                        <template v-if="showConnectWallet">
                            <button class="btn btn-outline-dark" @click="mint()">
                                <i class="bi bi-shield-lock"></i>
                                Generate Proof (s)
                            </button>
                        </template>

                        <ConnectWalletButton :ecosystem="this.getOnChainIssuerConfig.ecosystem"
                            :blockchain="this.getOnChainIssuerConfig.blockchain"
                            :chainId="this.getOnChainIssuerConfig.chainId" @authEvent="myEventListener"
                            v-if="!showConnectWallet" />
                    </div>
                </div>
            </div>

            <!-- Modal -->
            <b-modal id="bottom-modal" v-model="showModal" hide-footer centered title="Modal from Bottom"
                :no-fade="false" dialog-class="bottom-modal">
                <div class="modal-body">
                    <ConnectWalletButton :ecosystem="this.getOnChainIssuerConfig.ecosystem"
                        :blockchain="this.getOnChainIssuerConfig.blockchain"
                        :chainId="this.getOnChainIssuerConfig.chainId" @authEvent="myEventListener" />
                </div>
                <b-button variant="secondary" @click="showModal = false">Close</b-button>
            </b-modal>
        </div>


        <div class="footer">
            <MessageBox :msg="toastMessage" :type="toastType" :action="isToast ? 'show' : 'hide'" />
        </div>
    </div>
</template>

<script>
import { mapMutations, mapActions, mapGetters, mapState } from "vuex";
// import { smartContractExecuteRPC } from '@hypersign-protocol/hypersign-kyc-chains-metadata/cosmos/contract/execute'
import { smartContractQueryRPC } from '@hypersign-protocol/hypersign-kyc-chains-metadata/cosmos/contract/query'
import ConnectWalletButton from "../commons/authButtons/ConnectWalletButton.vue";
import NibiruLocalNetChainJson from '@hypersign-protocol/hypersign-kyc-chains-metadata/cosmos/wallet/nibi/nibiru-localnet-0/chains'
import NibiruTestnetChainJson from '@hypersign-protocol/hypersign-kyc-chains-metadata/cosmos/wallet/nibi/nibiru-testnet-1/chains'
// import ComdexChainJson from '@hypersign-protocol/hypersign-kyc-chains-metadata/cosmos/wallet/comdex/chains'
// import { constructKYCSBTMintMsg } from '@hypersign-protocol/hypersign-kyc-chains-metadata/cosmos/contract/msg';
import { constructQuerySBTContractMetadata } from '@hypersign-protocol/hypersign-kyc-chains-metadata/cosmos/contract/msg';
import { getCosmosChainConfig, HYPERSIGN_PROOF_TYPES } from '@hypersign-protocol/hypersign-kyc-chains-metadata/cosmos/wallet/cosmos-wallet-utils'
import { createNonSigningClient } from '../utils/cosmos-client'
import { STEP_NAMES, SUPPORTED_CREDENTIAL_TYPEE } from "@/config";
import MESSAGE from '../utils/lang/en';

export default {
    name: STEP_NAMES.ZkProofs,
    components: {
        ConnectWalletButton
    },
    computed: {
        ...mapGetters(["getCavachAccessToken", "getVaultDataCredentials", "getRedirectUrl", 'getOnChainIssuerConfig', "getWidgetConfigFromDb"]),
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
            } else {
                return true
            }
        },
        blockchainLabel() {
            return `${this.getOnChainIssuerConfig.ecosystem}:${this.getOnChainIssuerConfig.blockchain}:${this.getOnChainIssuerConfig.chainId}`
        },
        isNextEnabled() {
            let result;
            this.hypersign_proofs.forEach(x => {

                result = result && x['zkProof']
                console.log({
                    result,
                    isProofDone: x['zkProof']
                })
            })
            return result;
        },
        isIDDocEnabled() {
            if (this.getWidgetConfigFromDb.onChainId.enabled) {
                return true
            } else return false
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
            hypersign_proofs: [], // request
            showModal: false,
            credentials: []
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


        togglePopup() {
            this.showPopup = !this.showPopup;
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



            if (credeital) {
                return credeital
            } else {
                return undefined
            }
        },


        // async generatezkProof(credential, proof_type) {
        //     const verifyKey = await import(`../lib/${proof_type}/verify_key.json`)
        //     console.log({ verifyKey, credential })

        // },

        async getProof(proof) {
            this.isLoading = true
            // 

            console.log('Getting proof for proof type ' + proof.proof_type)
            // TODO: get the required credential from edv

            // const credentialType = proof.credentialType;
            // const trustedIssuer = this.getWidgetConfigFromDb.issuerDID
            // let trustedIssuerList = []
            // if (issuerDID) {
            //     trustedIssuerList = issuerDID.split(',')
            // }
            // const credential = {}; // getCredentialFromWallet(credentialType, trustedIssuer)

            /// TODO: actual logic to generate proof

            // const proof = await generatezkProof(credential, proof.proof_type )

            /// TODO: call verify proof API 

            this.hypersign_proofs.map(x => {
                if (x.proof_type == proof.proof_type) {
                    x['zkProof'] = true
                }
            })

            this.isLoading = false
        },

        showWalletModal() {
            this.showModal = true
        },

        async mint(proof) {
            try {
                if (this.showConnectWallet) {
                    this.showWalletModal()
                }
                console.log('Getting sbt for proof type ' + proof.proof_type)

                this.hypersign_proofs.map(x => {
                    if (x.proof_type == proof.proof_type) {
                        x['zkSBT'] = true
                    }
                })

                return;

                // this.isLoading = true
                // const sbtTokenId = Math.floor(Math.random(100000) * 100000).toString(); // TODO: better random id
                // // const sbtTokenUri = "ipfs://" + sbtTokenId; // TODO: remove hardcoding

                // const smartContractMsg = constructKYCSBTMintMsg({ hypersign_proof: this.hypersign_proofs[0] });
                // // Perform the CreateTodo Smart Contract Execution
                // // Note: This is a blockchain transaction
                // const chainConfig = this.getChainConfig
                // const chainCoinDenom = chainConfig["feeCurrencies"][0]["coinMinimalDenom"]
                // const result = await smartContractExecuteRPC(
                //     this.cosmosConnection.signingClient,
                //     chainCoinDenom,
                //     this.connectedWalletAddress,
                //     this.getOnChainIssuerConfig.contractAddress,
                //     smartContractMsg);

                // if (result) {
                //     this.toast(MESSAGE.ON_CHAIN.IDENTITY_SUCCESS)

                //     // TODO: call server to udpate status
                //     await this.verifySbtMint({
                //         blockchainLabel: this.blockchainLabel,
                //         sbtContractAddress: this.getOnChainIssuerConfig.contractAddress,
                //         ownerWalletAddress: this.connectedWalletAddress,
                //         tokenId: sbtTokenId, // TODO what is this token ID.
                //         transactionHash: result.transactionHash
                //     });
                //     this.isLoading = false
                //     // Implement feature in caach server to capture user's miniing step
                //     this.nextStep();
                // }

            } catch (e) {
                this.toast(e.message, 'error')
                this.isLoading = false
            }
        },

        async disconnectWallet() {
            this.connectedWalletAddress = ""
            await window.keplr.disable()
        },


        camelToSnake(str) {
            return str.replace(/([A-Z])/g, '_$1').toLowerCase();
        }
    },
    async mounted() {
        // this.nft.metadata = await this.getContractMetadata(this.getOnChainIssuerConfig.sbtContractAddress)
        // const getKycCredential = this.queryVaultDataCredentials()
        // if (getKycCredential) {
        //     console.log(getKycCredential)
        //     console.log(getKycCredential.type)
        // }

        const requestedProofs = this.getWidgetConfigFromDb.zkProof.proofs
        if (requestedProofs.length <= 0) {
            return;
        }

        requestedProofs.forEach(x => {
            const hypersignProof = HYPERSIGN_PROOF_TYPES[x.proofType]
            if (hypersignProof) {
                this.hypersign_proofs.push({
                    "credential_id": "",
                    "data": "",
                    "description": hypersignProof.description,
                    "proof_type_image": hypersignProof.image,
                    "sbt_code": hypersignProof.sbtCode,
                    "bgColor": hypersignProof.bgColor,
                    "proof_type": x.proofType,
                    "credentialType": hypersignProof.credentialType[0]
                })
            } else {
                console.log('Invalid proof of type , x.proofType ' + x.proofType)
            }
        })
        //
        // this.hypersign_proofs.push({
        //     "credential_id": "",
        //     "data": "",
        //     "description": HYPERSIGN_PROOF_TYPES.ProofOfKYC.description,
        //     "proof_type_image": HYPERSIGN_PROOF_TYPES.ProofOfKYC.image,
        //     "sbt_code": HYPERSIGN_PROOF_TYPES.ProofOfKYC.sbtCode,
        //     "proof_type": HYPERSIGN_PROOF_TYPES.ProofOfKYC.type,
        //     bgColor: HYPERSIGN_PROOF_TYPES.ProofOfKYC.bgColor
        // })

        // this.hypersign_proofs.push({
        //     "credential_id": "",
        //     "data": "",
        //     "description": HYPERSIGN_PROOF_TYPES.ProofOfPersonhood.description,
        //     "proof_type_image": HYPERSIGN_PROOF_TYPES.ProofOfPersonhood.image,
        //     "sbt_code": HYPERSIGN_PROOF_TYPES.ProofOfPersonhood.sbtCode,
        //     "proof_type": HYPERSIGN_PROOF_TYPES.ProofOfPersonhood.type,
        //     bgColor: HYPERSIGN_PROOF_TYPES.ProofOfPersonhood.bgColor
        // })


    }

}
</script>