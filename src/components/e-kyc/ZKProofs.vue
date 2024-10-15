<style scoped>
.badge {
    padding: 5px;
    float: right;
    background-color: grey;
    border-radius: 43%;
    font-size: inherit;
    font-weight: bold;
    color: orange;
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

/* .modal-body {
    padding: 10px
} */



.popup {
    position: absolute;
    bottom: 0;
    /* Aligns the popup to the bottom of the parent */
    left: 50%;
    /* Aligns it horizontally */
    transform: translate(-50%);
    /* Adjust to center the div */
    width: 100%;
    height: 50%;
    padding: 20px;
    background-color: rgba(255, 255, 255, 0.987);
    border: 1px solid #0000005e;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    /* Adds a shadow for popup effect */
    z-index: 10;
    border-radius: 0px 0px 20px 20px;
    transition: bottom 0.1s ease;
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    /* Semi-transparent dark background */
    z-index: 5;

    /* Ensure the overlay is behind the popup but above other content */
}
</style>

<template>
    <div class="">
        <div class="container card-body min-h-36">
            <load-ing :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></load-ing>

            <PageHeading :header="'Proof & OnChain ID'" :subHeader="'Get Proof and Mint Your Onchain ID'"
                :beta="true" />
            <div class="container row  center mt-1" v-if="connectedWalletAddress">
                <div class="col-md-8  ">
                    <button class="btn btn-link" @click="disconnectWallet()"
                        style="text-decoration: underline; color:grey; cursor: pointer;" title="Disconnect Wallet">{{
                            connectedWalletAddress }} <i class="bi bi-box-arrow-right"></i></button>
                </div>
            </div>


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
                                <template v-else-if="!hypersign_proof.zkSBT">
                                    <button class="btn btn-outline-dark" @click="mint(hypersign_proof)">
                                        <i class="bi bi-hammer"></i>
                                        Mint Your SBT
                                    </button>
                                </template>
                            </div>
                        </div>

                        <div class="col-md-1" v-if="isOnchainIdEnabled">
                            <div v-if="hypersign_proof.zkProof && hypersign_proof.zkSBT">
                                <i class="bi bi-check2-circle" style="font-size:xx-large"></i>
                            </div>
                        </div>
                        <div class="col-md-1" v-else>
                            <div v-if="hypersign_proof.zkProof">
                                <i class="bi bi-check2-circle" style="font-size:xx-large"></i>
                            </div>
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
        </div>

        <div class="footer">
            <MessageBox :msg="toastMessage" :type="toastType" :action="isToast ? 'show' : 'hide'" />
        </div>

        <div class="overlay" v-if="showModal"></div>
        <div class="popup" v-if="showModal">
            <div class="row">
                <div class="col" style="text-align: end;">
                    <b-button variant="btn btn-secondary-outline" @click="showModal = false"><i class="bi bi-x-circle"
                            style="color:indianred"></i></b-button>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <ConnectWalletButton :ecosystem="this.getOnChainIssuerConfig.ecosystem"
                        :blockchain="this.getOnChainIssuerConfig.blockchain"
                        :chainId="this.getOnChainIssuerConfig.chainId" @authEvent="myEventListener" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapMutations, mapActions, mapGetters, mapState } from "vuex";
import { smartContractExecuteRPC } from '@hypersign-protocol/hypersign-kyc-chains-metadata/cosmos/contract/execute'
import { smartContractQueryRPC } from '@hypersign-protocol/hypersign-kyc-chains-metadata/cosmos/contract/query'
import ConnectWalletButton from "../commons/authButtons/ConnectWalletButton.vue";
import NibiruLocalNetChainJson from '@hypersign-protocol/hypersign-kyc-chains-metadata/cosmos/wallet/nibi/nibiru-localnet-0/chains'
import NibiruTestnetChainJson from '@hypersign-protocol/hypersign-kyc-chains-metadata/cosmos/wallet/nibi/nibiru-testnet-1/chains'
import OsmosisTestnetChainJson from '@hypersign-protocol/hypersign-kyc-chains-metadata/cosmos/wallet/osmo/osmo-test-5/chains'
import { constructKYCSBTMintMsg } from '@hypersign-protocol/hypersign-kyc-chains-metadata/cosmos/contract/msg';
import { constructQuerySBTContractMetadata } from '@hypersign-protocol/hypersign-kyc-chains-metadata/cosmos/contract/msg';
import { getCosmosChainConfig, HYPERSIGN_PROOF_TYPES } from '@hypersign-protocol/hypersign-kyc-chains-metadata/cosmos/wallet/cosmos-wallet-utils'
import { createNonSigningClient, calculateFee } from '../utils/cosmos-client'
import { STEP_NAMES, SUPPORTED_CREDENTIAL_TYPEE, ZK_PROOF_TYPES } from "@/config";
import MESSAGE from '../utils/lang/en';
import * as cryptoi3 from '@iden3/js-crypto'
import * as MerkleTreeJSONLD from '@iden3/js-jsonld-merklization'
import * as MerkleTree from '@iden3/js-merkletree'
import multibase from 'multibase'
import * as utils from '../../zkUtils/utils'

export default {
    name: STEP_NAMES.ZkProofs,
    components: {
        ConnectWalletButton
    },
    computed: {
        ...mapGetters(["getCavachAccessToken", "getVaultDataRaw", "getVaultDataCredentials", "getRedirectUrl", 'getOnChainIssuerConfig', "getWidgetConfigFromDb"]),
        ...mapState(['hasLivelinessDone', 'hasKycDone', 'cosmosConnection']),
        // vault
        getVaultDataCredentials() {
            const { hypersign } = this.getVaultDataRaw
            const { credentials } = hypersign
            return credentials;
        },
        getTrustedIssuers() {
            const issuerDID = this.getWidgetConfigFromDb.issuerDID
            if (issuerDID) {
                return issuerDID.split(',')
            } else {
                return []
            }
        },
        getTrustedIssuersCredentials() {
            return this.getVaultDataCredentials.filter(x => this.getTrustedIssuers.includes(x.issuer))
        },
        // checkIfZkProofOfPersonhoodPresent() {
        //     return this.getTrustedIssuersCredentials.find(x => x.type[1] == 'zkProofOfPersonHood') ? true : false
        // },
        // checkIfZkProofOfKycPresent() {
        //     return this.getTrustedIssuersCredentials.find(x => x.type[1] == 'zkProofOfKyc') ? true : false
        // },
        ///////

        getChainConfig() {
            const { ecosystem, blockchain, chainId } = this.getOnChainIssuerConfig
            let SupportedChains;

            if (ecosystem === 'cosmos' && blockchain === 'nibi' && chainId === 'nibiru-localnet-0') {
                SupportedChains = NibiruLocalNetChainJson
            } else if (ecosystem === 'cosmos' && blockchain === 'nibi' && chainId === 'nibiru-testnet-1') {
                SupportedChains = NibiruTestnetChainJson
            } else if (ecosystem === 'cosmos' && blockchain === 'osmo' && chainId === 'osmo-test-5') {
                SupportedChains = OsmosisTestnetChainJson
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
            if (this.getWidgetConfigFromDb.idOcr.enabled) {
                return true
            } else return false
        },
        isOnchainIdEnabled() {
            if (this.getWidgetConfigFromDb.onChainId.enabled) {
                return true
            } else return false
        },
        isLivelinessEnabled() {
            if (this.getWidgetConfigFromDb.faceRecog.enabled) {
                return true
            } else return false
        },

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
        ...mapActions(['verifyZkProof']),

        async myEventListener(data) {
            this.nft.metadata = await this.getContractMetadata(this.getOnChainIssuerConfig.sbtContractAddress)
            this.connectedWalletAddress = data.user.walletAddress
            this.showModal = false
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
            if (!this.getVaultDataCredentials && this.getVaultDataCredentials.length <= 0) {
                return undefined
            }

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

        async generatezkProof(credeital, proof_type) {

            switch (proof_type) {
                case ZK_PROOF_TYPES.zkProofOfAge: {
                    return this.generatezkProofOfAge(credeital, proof_type)
                }

                case ZK_PROOF_TYPES.zkProofOfDOB: {
                    return this.generatezkProofOfDOB(credeital, proof_type)
                }

                case ZK_PROOF_TYPES.zkProofKYC: {
                    return this.generatezkProofKYC(credeital, proof_type)
                }

                case ZK_PROOF_TYPES.zkProofOfMembership: {
                    return this.generatezkProofOfMembership(credeital, proof_type)
                }

                case ZK_PROOF_TYPES.zkProofOfPersonHood: {
                    return this.generatezkProofOfPersonHood(credeital, proof_type)
                }

                default:
                    throw new Error("Invalid ProofType " + proof_type)
            }

        },
        async generatezkProofOfAge(credential, proof_type) {
            const verifyKey = `circuits/${proof_type}/${proof_type}_final.zkey`
            const wtns = `circuits/${proof_type}/${proof_type}_circuit.wasm`
            // resolve issuerDid
            const issuerDid = {
                "context": [
                    "https://www.w3.org/ns/did/v1",
                    "https://raw.githubusercontent.com/hypersign-protocol/hypersign-contexts/main/BabyJubJubKey2021.jsonld"
                ],
                "id": "did:hid:testnet:zAzbwBjvy5hZg5HZLZVVzK6Lc6BJPiWP1YqeUecYBiN6",
                "controller": [
                    "did:hid:testnet:zAzbwBjvy5hZg5HZLZVVzK6Lc6BJPiWP1YqeUecYBiN6"
                ],
                "alsoKnownAs": [],
                "verificationMethod": [
                    {
                        "id": "did:hid:testnet:zAzbwBjvy5hZg5HZLZVVzK6Lc6BJPiWP1YqeUecYBiN6#key-1",
                        "type": "BabyJubJubKey2021",
                        "controller": "did:hid:testnet:zAzbwBjvy5hZg5HZLZVVzK6Lc6BJPiWP1YqeUecYBiN6",
                        "publicKeyMultibase": "zAzbwBjvy5hZg5HZLZVVzK6Lc6BJPiWP1YqeUecYBiN6",
                        "blockchainAccountId": ""
                    }
                ],
                "authentication": [
                    "did:hid:testnet:zAzbwBjvy5hZg5HZLZVVzK6Lc6BJPiWP1YqeUecYBiN6#key-1"
                ],
                "assertionMethod": [
                    "did:hid:testnet:zAzbwBjvy5hZg5HZLZVVzK6Lc6BJPiWP1YqeUecYBiN6#key-1"
                ],
                "keyAgreement": [],
                "capabilityInvocation": [],
                "capabilityDelegation": [],
                "service": []
            }
            const publicKeyIssuerMultibase = issuerDid.verificationMethod[0].publicKeyMultibase
            const hexPublicKey = Buffer.from(multibase.decode(publicKeyIssuerMultibase), 'hex').toString('hex')


            const publicKeyIssuer = cryptoi3.PublicKey.newFromHex(hexPublicKey)

            console.log(publicKeyIssuer);

            const issuerSignatureBase64 = credential.proof.proofValue
            const issuerSignature = cryptoi3.Signature.newFromCompressed(multibase.decode(issuerSignatureBase64))
            delete credential.proof

            console.log(issuerSignature);






            let keyValuePair = [];
            const merklized = await MerkleTreeJSONLD.Merklizer.merklizeJSONLD(JSON.stringify(credential))
            merklized.entries.forEach((e, index) => {

                if (e.key.parts.length == 1 && e.key.parts[0].includes('credentialSubject')) {
                    keyValuePair.push({

                        key: index, value: e.value,
                        name: 'holderDid'

                    })
                }
                e.key.parts.find(k => {

                    if (typeof k == 'string' && k.includes('issuer')) {
                        keyValuePair.push({

                            key: index, value: e.value,
                            name: 'issuerDid'


                        })
                    }

                    if (typeof k == 'string' && k.includes('dateOfBirth')) {
                        keyValuePair.push({

                            key: index, value: e.value,
                            name: 'dateOfBirth'


                        })
                    }

                    if (k == 0) {
                        keyValuePair.push({

                            key: index, value: e.value,
                            name: 'credentialType'

                        })

                    }

                })
            })


            const credentialRoot = (await merklized.mt.root()).bigInt()

            console.log(credentialRoot);

            // Prepare the circuit inputs
            const issuer_pk = [
                publicKeyIssuer.p[0],
                publicKeyIssuer.p[1]
            ]
            console.log(issuer_pk);

            const issuer_signature = [issuerSignature.R8[0],
            issuerSignature.R8[1],
            issuerSignature.S
            ]
            console.log(issuer_signature);

            const enabled = 1n
            console.log(enabled);


            let issuer_siblings;
            let issuer_oldKey;
            let issuer_oldValue;
            let issuer_isOld0;
            let issuer_key;
            let issuer_fnc;
            let issuerId;


            let user_siblings;
            let user_oldKey;
            let user_oldValue;
            let user_isOld0;
            let user_key;
            let user_fnc;
            let userId;


            let type_siblings;
            let type_oldKey;
            let type_oldValue;
            let type_isOld0;
            let type_key;
            let type_fnc;
            let type;


            let dateOfBirth;

            let dob_siblings;
            let dob_oldKey;
            let dob_oldValue;
            let dob_isOld0;
            let dob_key;
            let dob_fnc;


            // eslint-disable-next-line no-undef
            const currentTimestamp = BigInt(new Date().valueOf())

            const nullifier = 1235235n

            const circomProofs = []
            // Generate Circuit compatible proofs and prepate the circuit input 
            for (let index = 0; index < keyValuePair.length; index++) {
                const element = keyValuePair[index];

                // eslint-disable-next-line no-undef
                const proof = await merklized.mt.generateCircomVerifierProof(BigInt(element.key), MerkleTree.ZERO_HASH)
                if (element.name == 'issuerDid') {
                    //  prepare issuer proof input 
                    issuer_siblings = proof.siblings.map(e => e.bigInt())
                    issuer_oldKey = proof.oldKey.bigInt()
                    issuer_oldValue = proof.oldValue.bigInt()
                    issuer_isOld0 = proof.isOld0 == true ? 1 : 0
                    issuer_key = proof.key.bigInt()
                    issuer_fnc = proof.fnc
                    issuerId = proof.value.bigInt()

                }

                if (element.name == 'holderDid') {
                    //  prepare holder proof input 

                    user_siblings = proof.siblings.map(e => e.bigInt())
                    user_oldKey = proof.oldKey.bigInt()
                    user_oldValue = proof.oldValue.bigInt()
                    user_isOld0 = proof.isOld0 == true ? 1 : 0
                    user_key = proof.key.bigInt()
                    user_fnc = proof.fnc
                    userId = proof.value.bigInt()

                }



                if (element.name == 'credentialType') {
                    //  prepare credentialType proof 

                    type_siblings = proof.siblings.map(e => e.bigInt())
                    type_oldKey = proof.oldKey.bigInt()
                    type_oldValue = proof.oldValue.bigInt()
                    type_isOld0 = proof.isOld0 == true ? 1 : 0
                    type_key = proof.key.bigInt()
                    type_fnc = proof.fnc
                    type = proof.value.bigInt()

                }


                if (element.name == 'dateOfBirth') {
                    //  prepare date of birth Input
                    dob_siblings = proof.siblings.map(e => e.bigInt())
                    dob_oldKey = proof.oldKey.bigInt()
                    dob_oldValue = proof.oldValue.bigInt()
                    dob_isOld0 = proof.isOld0 == true ? 1 : 0
                    dob_key = proof.key.bigInt()
                    dob_fnc = proof.fnc
                    dateOfBirth = proof.value.bigInt()


                }
                circomProofs.push({
                    type: element.key,
                    // eslint-disable-next-line no-undef
                    value: (await merklized.mt.get(BigInt(element.key))).value,
                    proof: proof,
                    name: element.name
                })

            }


            const ageCriteria = 18n

            const {
                proof, publicSignals, uncompressed_proof
            } = await utils.groth16FullProve({
                issuer_pk, issuer_signature,
                credentialRoot,
                issuerId,
                userId,
                type,
                enabled,
                ageCriteria,
                issuer_siblings,
                issuer_oldKey,
                issuer_oldValue,
                issuer_isOld0,
                issuer_key, issuer_fnc,
                user_siblings,
                user_oldKey, user_oldValue,
                user_isOld0,
                user_key, user_fnc,
                type_siblings,
                type_oldKey, type_oldValue,
                type_isOld0,
                type_key, type_fnc,
                dateOfBirth,
                dob_siblings,
                dob_oldKey, dob_oldValue,
                dob_isOld0,
                dob_key,
                dob_fnc,
                currentTimestamp, nullifier
            }
                , wtns, verifyKey)


            console.log(
                {
                    proof, publicSignals, uncompressed_proof,
                }
            );
            return {
                proof, publicSignals, uncompressed_proof
            }
        },
        async generatezkProofOfDOB(credential, proof_type) {
            const verifyKey = `circuits/${proof_type}/${proof_type}_final.zkey`
            const wtns = `circuits/${proof_type}/${proof_type}_circuit.wasm`
            // resolve issuerDid
            const issuerDid = {
                "context": [
                    "https://www.w3.org/ns/did/v1",
                    "https://raw.githubusercontent.com/hypersign-protocol/hypersign-contexts/main/BabyJubJubKey2021.jsonld"
                ],
                "id": "did:hid:testnet:zAzbwBjvy5hZg5HZLZVVzK6Lc6BJPiWP1YqeUecYBiN6",
                "controller": [
                    "did:hid:testnet:zAzbwBjvy5hZg5HZLZVVzK6Lc6BJPiWP1YqeUecYBiN6"
                ],
                "alsoKnownAs": [],
                "verificationMethod": [
                    {
                        "id": "did:hid:testnet:zAzbwBjvy5hZg5HZLZVVzK6Lc6BJPiWP1YqeUecYBiN6#key-1",
                        "type": "BabyJubJubKey2021",
                        "controller": "did:hid:testnet:zAzbwBjvy5hZg5HZLZVVzK6Lc6BJPiWP1YqeUecYBiN6",
                        "publicKeyMultibase": "zAzbwBjvy5hZg5HZLZVVzK6Lc6BJPiWP1YqeUecYBiN6",
                        "blockchainAccountId": ""
                    }
                ],
                "authentication": [
                    "did:hid:testnet:zAzbwBjvy5hZg5HZLZVVzK6Lc6BJPiWP1YqeUecYBiN6#key-1"
                ],
                "assertionMethod": [
                    "did:hid:testnet:zAzbwBjvy5hZg5HZLZVVzK6Lc6BJPiWP1YqeUecYBiN6#key-1"
                ],
                "keyAgreement": [],
                "capabilityInvocation": [],
                "capabilityDelegation": [],
                "service": []
            }
            const publicKeyIssuerMultibase = issuerDid.verificationMethod[0].publicKeyMultibase
            const hexPublicKey = Buffer.from(multibase.decode(publicKeyIssuerMultibase), 'hex').toString('hex')


            const publicKeyIssuer = cryptoi3.PublicKey.newFromHex(hexPublicKey)

            console.log(publicKeyIssuer);

            const issuerSignatureBase64 = credential.proof.proofValue
            const issuerSignature = cryptoi3.Signature.newFromCompressed(multibase.decode(issuerSignatureBase64))
            delete credential.proof

            console.log(issuerSignature);






            let keyValuePair = [];
            const merklized = await MerkleTreeJSONLD.Merklizer.merklizeJSONLD(JSON.stringify(credential))
            merklized.entries.forEach((e, index) => {

                if (e.key.parts.length == 1 && e.key.parts[0].includes('credentialSubject')) {
                    keyValuePair.push({

                        key: index, value: e.value,
                        name: 'holderDid'

                    })
                }
                e.key.parts.find(k => {

                    if (typeof k == 'string' && k.includes('issuer')) {
                        keyValuePair.push({

                            key: index, value: e.value,
                            name: 'issuerDid'


                        })
                    }

                    if (typeof k == 'string' && k.includes('dateOfBirth')) {
                        keyValuePair.push({

                            key: index, value: e.value,
                            name: 'dateOfBirth'


                        })
                    }

                    if (k == 0) {
                        keyValuePair.push({

                            key: index, value: e.value,
                            name: 'credentialType'

                        })

                    }

                })
            })


            const credentialRoot = (await merklized.mt.root()).bigInt()

            console.log(credentialRoot);

            // Prepare the circuit inputs
            const issuer_pk = [
                publicKeyIssuer.p[0],
                publicKeyIssuer.p[1]
            ]
            console.log(issuer_pk);

            const issuer_signature = [issuerSignature.R8[0],
            issuerSignature.R8[1],
            issuerSignature.S
            ]
            console.log(issuer_signature);

            const enabled = 1n
            console.log(enabled);





            let issuer_siblings;
            let issuer_oldKey;
            let issuer_oldValue;
            let issuer_isOld0;
            let issuer_key;
            let issuer_fnc;
            let issuerId;


            let user_siblings;
            let user_oldKey;
            let user_oldValue;
            let user_isOld0;
            let user_key;
            let user_fnc;
            let userId;


            let type_siblings;
            let type_oldKey;
            let type_oldValue;
            let type_isOld0;
            let type_key;
            let type_fnc;
            let type;


            let dateOfBirth;

            let dob_siblings;
            let dob_oldKey;
            let dob_oldValue;
            let dob_isOld0;
            let dob_key;
            let dob_fnc;




            const circomProofs = []

            for (let index = 0; index < keyValuePair.length; index++) {
                const element = keyValuePair[index];
                // eslint-disable-next-line no-undef
                const proof = await merklized.mt.generateCircomVerifierProof(BigInt(element.key), MerkleTree.ZERO_HASH)
                if (element.name == 'issuerDid') {

                    issuer_siblings = proof.siblings.map(e => e.bigInt())
                    issuer_oldKey = proof.oldKey.bigInt()
                    issuer_oldValue = proof.oldValue.bigInt()
                    issuer_isOld0 = proof.isOld0 == true ? 1 : 0
                    issuer_key = proof.key.bigInt()
                    issuer_fnc = proof.fnc
                    issuerId = proof.value.bigInt()

                }

                if (element.name == 'holderDid') {
                    user_siblings = proof.siblings.map(e => e.bigInt())
                    user_oldKey = proof.oldKey.bigInt()
                    user_oldValue = proof.oldValue.bigInt()
                    user_isOld0 = proof.isOld0 == true ? 1 : 0
                    user_key = proof.key.bigInt()
                    user_fnc = proof.fnc
                    userId = proof.value.bigInt()

                }



                if (element.name == 'credentialType') {
                    type_siblings = proof.siblings.map(e => e.bigInt())
                    type_oldKey = proof.oldKey.bigInt()
                    type_oldValue = proof.oldValue.bigInt()
                    type_isOld0 = proof.isOld0 == true ? 1 : 0
                    type_key = proof.key.bigInt()
                    type_fnc = proof.fnc
                    type = proof.value.bigInt()

                }


                if (element.name == 'dateOfBirth') {
                    dob_siblings = proof.siblings.map(e => e.bigInt())
                    dob_oldKey = proof.oldKey.bigInt()
                    dob_oldValue = proof.oldValue.bigInt()
                    dob_isOld0 = proof.isOld0 == true ? 1 : 0
                    dob_key = proof.key.bigInt()
                    dob_fnc = proof.fnc
                    dateOfBirth = proof.value.bigInt()


                }
                circomProofs.push({
                    type: element.key,
                    // eslint-disable-next-line no-undef
                    value: (await merklized.mt.get(BigInt(element.key))).value,
                    proof: proof,
                    name: element.name
                })

            }






            const {
                proof, publicSignals, uncompressed_proof
            } = await utils.groth16FullProve({
                issuer_pk, issuer_signature,
                credentialRoot,
                issuerId,
                userId,
                type,
                enabled,
                issuer_siblings,
                issuer_oldKey,
                issuer_oldValue,
                issuer_isOld0,
                issuer_key, issuer_fnc,
                user_siblings,
                user_oldKey, user_oldValue,
                user_isOld0,
                user_key, user_fnc,
                type_siblings,
                type_oldKey, type_oldValue,
                type_isOld0,
                type_key, type_fnc,
                dateOfBirth,
                dob_siblings,
                dob_oldKey, dob_oldValue,
                dob_isOld0,
                dob_key,
                dob_fnc,
            }
                , wtns, verifyKey)


            console.log(
                {
                    proof, publicSignals, uncompressed_proof,
                }
            );
            return {
                proof, publicSignals, uncompressed_proof
            }

        },
        async generatezkProofKYC(credential, proof_type) {
            const verifyKey = `circuits/${proof_type}/${proof_type}_final.zkey`
            const wtns = `circuits/${proof_type}/${proof_type}_circuit.wasm`
            // resolve issuerDid
            const issuerDid = {
                "context": [
                    "https://www.w3.org/ns/did/v1",
                    "https://raw.githubusercontent.com/hypersign-protocol/hypersign-contexts/main/BabyJubJubKey2021.jsonld"
                ],
                "id": "did:hid:testnet:zAzbwBjvy5hZg5HZLZVVzK6Lc6BJPiWP1YqeUecYBiN6",
                "controller": [
                    "did:hid:testnet:zAzbwBjvy5hZg5HZLZVVzK6Lc6BJPiWP1YqeUecYBiN6"
                ],
                "alsoKnownAs": [],
                "verificationMethod": [
                    {
                        "id": "did:hid:testnet:zAzbwBjvy5hZg5HZLZVVzK6Lc6BJPiWP1YqeUecYBiN6#key-1",
                        "type": "BabyJubJubKey2021",
                        "controller": "did:hid:testnet:zAzbwBjvy5hZg5HZLZVVzK6Lc6BJPiWP1YqeUecYBiN6",
                        "publicKeyMultibase": "zAzbwBjvy5hZg5HZLZVVzK6Lc6BJPiWP1YqeUecYBiN6",
                        "blockchainAccountId": ""
                    }
                ],
                "authentication": [
                    "did:hid:testnet:zAzbwBjvy5hZg5HZLZVVzK6Lc6BJPiWP1YqeUecYBiN6#key-1"
                ],
                "assertionMethod": [
                    "did:hid:testnet:zAzbwBjvy5hZg5HZLZVVzK6Lc6BJPiWP1YqeUecYBiN6#key-1"
                ],
                "keyAgreement": [],
                "capabilityInvocation": [],
                "capabilityDelegation": [],
                "service": []
            }
            const publicKeyIssuerMultibase = issuerDid.verificationMethod[0].publicKeyMultibase
            const hexPublicKey = Buffer.from(multibase.decode(publicKeyIssuerMultibase), 'hex').toString('hex')


            const publicKeyIssuer = cryptoi3.PublicKey.newFromHex(hexPublicKey)

            console.log(publicKeyIssuer);

            const issuerSignatureBase64 = credential.proof.proofValue
            const issuerSignature = cryptoi3.Signature.newFromCompressed(multibase.decode(issuerSignatureBase64))
            delete credential.proof

            console.log(issuerSignature);






            let keyValuePair = [];
            const merklized = await MerkleTreeJSONLD.Merklizer.merklizeJSONLD(JSON.stringify(credential))
            merklized.entries.forEach((e, index) => {

                if (e.key.parts.length == 1 && e.key.parts[0].includes('credentialSubject')) {
                    keyValuePair.push({

                        key: index, value: e.value,
                        name: 'holderDid'

                    })
                }
                e.key.parts.find(k => {

                    if (typeof k == 'string' && k.includes('issuer')) {
                        keyValuePair.push({

                            key: index, value: e.value,
                            name: 'issuerDid'


                        })
                    }

                    if (typeof k == 'string' && k.includes('dateOfBirth')) {
                        keyValuePair.push({

                            key: index, value: e.value,
                            name: 'dateOfBirth'


                        })
                    }

                    if (k == 0) {
                        keyValuePair.push({

                            key: index, value: e.value,
                            name: 'credentialType'

                        })

                    }

                })
            })


            const credentialRoot = (await merklized.mt.root()).bigInt()

            console.log(credentialRoot);

            // Prepare the circuit inputs
            const issuer_pk = [
                publicKeyIssuer.p[0],
                publicKeyIssuer.p[1]
            ]
            console.log(issuer_pk);

            const issuer_signature = [issuerSignature.R8[0],
            issuerSignature.R8[1],
            issuerSignature.S
            ]
            console.log(issuer_signature);

            const enabled = 1n
            console.log(enabled);



            let issuer_siblings;
            let issuer_oldKey;
            let issuer_oldValue;
            let issuer_isOld0;
            let issuer_key;
            let issuer_fnc;
            let issuerId;


            let user_siblings;
            let user_oldKey;
            let user_oldValue;
            let user_isOld0;
            let user_key;
            let user_fnc;
            let userId;


            let type_siblings;
            let type_oldKey;
            let type_oldValue;
            let type_isOld0;
            let type_key;
            let type_fnc;
            let type;

            const circomProofs = []

            for (let index = 0; index < keyValuePair.length; index++) {
                const element = keyValuePair[index];

                // eslint-disable-next-line no-undef
                const proof = await merklized.mt.generateCircomVerifierProof(BigInt(element.key), MerkleTree.ZERO_HASH)
                if (element.name == 'issuerDid') {
                    issuer_siblings = proof.siblings.map(e => e.bigInt())
                    issuer_oldKey = proof.oldKey.bigInt()
                    issuer_oldValue = proof.oldValue.bigInt()
                    issuer_isOld0 = proof.isOld0 == true ? 1 : 0
                    issuer_key = proof.key.bigInt()
                    issuer_fnc = proof.fnc
                    issuerId = proof.value.bigInt()

                }

                if (element.name == 'holderDid') {
                    user_siblings = proof.siblings.map(e => e.bigInt())
                    user_oldKey = proof.oldKey.bigInt()
                    user_oldValue = proof.oldValue.bigInt()
                    user_isOld0 = proof.isOld0 == true ? 1 : 0
                    user_key = proof.key.bigInt()
                    user_fnc = proof.fnc
                    userId = proof.value.bigInt()

                }



                if (element.name == 'credentialType') {
                    type_siblings = proof.siblings.map(e => e.bigInt())
                    type_oldKey = proof.oldKey.bigInt()
                    type_oldValue = proof.oldValue.bigInt()
                    type_isOld0 = proof.isOld0 == true ? 1 : 0
                    type_key = proof.key.bigInt()
                    type_fnc = proof.fnc
                    type = proof.value.bigInt()

                }
                circomProofs.push({
                    type: element.key,

                    // eslint-disable-next-line no-undef
                    value: (await merklized.mt.get(BigInt(element.key))).value,
                    proof: proof,
                    name: element.name
                })

            }


            const {
                proof, publicSignals, uncompressed_proof
            } = await utils.groth16FullProve({
                issuer_pk, issuer_signature,
                credentialRoot,
                issuerId,
                userId,
                type,
                enabled,
                issuer_siblings,
                issuer_oldKey,
                issuer_oldValue,
                issuer_isOld0,
                issuer_key, issuer_fnc,
                user_siblings,
                user_oldKey, user_oldValue,
                user_isOld0,
                user_key, user_fnc,
                type_siblings,
                type_oldKey, type_oldValue,
                type_isOld0,
                type_key, type_fnc
            }
                , wtns, verifyKey)


            console.log(
                {
                    proof, publicSignals, uncompressed_proof,
                }
            );
            return {
                proof, publicSignals, uncompressed_proof
            }

        },
        async generatezkProofOfMembership(credential, proof_type) {




            const verifyKey = `circuits/${proof_type}/${proof_type}_final.zkey`
            const wtns = `circuits/${proof_type}/${proof_type}_circuit.wasm`




            // resolve issuerDid
            const issuerDid = {
                "context": [
                    "https://www.w3.org/ns/did/v1",
                    "https://raw.githubusercontent.com/hypersign-protocol/hypersign-contexts/main/BabyJubJubKey2021.jsonld"
                ],
                "id": "did:hid:testnet:zAzbwBjvy5hZg5HZLZVVzK6Lc6BJPiWP1YqeUecYBiN6",
                "controller": [
                    "did:hid:testnet:zAzbwBjvy5hZg5HZLZVVzK6Lc6BJPiWP1YqeUecYBiN6"
                ],
                "alsoKnownAs": [],
                "verificationMethod": [
                    {
                        "id": "did:hid:testnet:zAzbwBjvy5hZg5HZLZVVzK6Lc6BJPiWP1YqeUecYBiN6#key-1",
                        "type": "BabyJubJubKey2021",
                        "controller": "did:hid:testnet:zAzbwBjvy5hZg5HZLZVVzK6Lc6BJPiWP1YqeUecYBiN6",
                        "publicKeyMultibase": "zAzbwBjvy5hZg5HZLZVVzK6Lc6BJPiWP1YqeUecYBiN6",
                        "blockchainAccountId": ""
                    }
                ],
                "authentication": [
                    "did:hid:testnet:zAzbwBjvy5hZg5HZLZVVzK6Lc6BJPiWP1YqeUecYBiN6#key-1"
                ],
                "assertionMethod": [
                    "did:hid:testnet:zAzbwBjvy5hZg5HZLZVVzK6Lc6BJPiWP1YqeUecYBiN6#key-1"
                ],
                "keyAgreement": [],
                "capabilityInvocation": [],
                "capabilityDelegation": [],
                "service": []
            }
            const publicKeyIssuerMultibase = issuerDid.verificationMethod[0].publicKeyMultibase
            const hexPublicKey = Buffer.from(multibase.decode(publicKeyIssuerMultibase), 'hex').toString('hex')


            const publicKeyIssuer = cryptoi3.PublicKey.newFromHex(hexPublicKey)

            console.log(publicKeyIssuer);

            const issuerSignatureBase64 = credential.proof.proofValue
            const issuerSignature = cryptoi3.Signature.newFromCompressed(multibase.decode(issuerSignatureBase64))
            delete credential.proof

            console.log(issuerSignature);






            let keyValuePair = [];
            const merklized = await MerkleTreeJSONLD.Merklizer.merklizeJSONLD(JSON.stringify(credential))
            merklized.entries.forEach((e, index) => {

                if (e.key.parts.length == 1 && e.key.parts[0].includes('credentialSubject')) {
                    keyValuePair.push({

                        key: index, value: e.value,
                        name: 'holderDid'

                    })
                }
                e.key.parts.find(k => {



                    if (typeof k == 'string' && k.includes('issuer')) {
                        keyValuePair.push({

                            key: index, value: e.value,
                            name: 'issuerDid'


                        })
                    }

                    if (typeof k == 'string' && k.includes('issuingStateCode')) {
                        keyValuePair.push({

                            key: index, value: e.value,
                            name: 'issuingStateCode'


                        })
                    }


                    // if (typeof k == 'string' && k.length == 1 && k.includes('credentialSubject')) {
                    //     keyValuePair.push({

                    //         key: e.key, value: e.value

                    //     })
                    // }


                    if (k == 0) {
                        keyValuePair.push({

                            key: index, value: e.value,
                            name: 'credentialType'

                        })

                    }

                })
            })
            const credentialRoot = (await merklized.mt.root()).bigInt()

            console.log(credentialRoot);

            // Prepare the circuit inputs
            const issuer_pk = [
                publicKeyIssuer.p[0],
                publicKeyIssuer.p[1]
            ]
            console.log(issuer_pk);

            const issuer_signature = [issuerSignature.R8[0],
            issuerSignature.R8[1],
            issuerSignature.S
            ]
            console.log(issuer_signature);

            const enabled = 1n
            console.log(enabled);
            const posidon = cryptoi3.Poseidon.hashBytes


            const set = [
                posidon(new TextEncoder().encode('USA')),
                posidon(new TextEncoder().encode('RUS')),
                posidon(new TextEncoder().encode('AUS')),
                posidon(new TextEncoder().encode('CHN')),
                posidon(new TextEncoder().encode('IND'))
            ]

            console.log(set);


            let issuingStateCode;
            let issuer_siblings;
            let issuer_oldKey;
            let issuer_oldValue;
            let issuer_isOld0;
            let issuer_key;
            let issuer_fnc;
            let issuerId;


            let user_siblings;
            let user_oldKey;
            let user_oldValue;
            let user_isOld0;
            let user_key;
            let user_fnc;
            let userId;


            let type_siblings;
            let type_oldKey;
            let type_oldValue;
            let type_isOld0;
            let type_key;
            let type_fnc;
            let type;




            let issueStateCode_siblings;
            let issueStateCode_oldKey;
            let issueStateCode_oldValue;
            let issueStateCode_isOld0;
            let issueStateCode_key;
            let issueStateCode_fnc;




            const circomProofs = []

            for (let index = 0; index < keyValuePair.length; index++) {
                const element = keyValuePair[index];

                // eslint-disable-next-line no-undef
                const proof = await merklized.mt.generateCircomVerifierProof(BigInt(element.key), MerkleTree.ZERO_HASH)
                if (element.name == 'issuerDid') {

                    issuer_siblings = proof.siblings.map(e => e.bigInt())
                    issuer_oldKey = proof.oldKey.bigInt()
                    issuer_oldValue = proof.oldValue.bigInt()
                    issuer_isOld0 = proof.isOld0 == true ? 1 : 0
                    issuer_key = proof.key.bigInt()
                    issuer_fnc = proof.fnc
                    issuerId = proof.value.bigInt()

                }

                if (element.name == 'holderDid') {
                    user_siblings = proof.siblings.map(e => e.bigInt())
                    user_oldKey = proof.oldKey.bigInt()
                    user_oldValue = proof.oldValue.bigInt()
                    user_isOld0 = proof.isOld0 == true ? 1 : 0
                    user_key = proof.key.bigInt()
                    user_fnc = proof.fnc
                    userId = proof.value.bigInt()

                }



                if (element.name == 'credentialType') {
                    type_siblings = proof.siblings.map(e => e.bigInt())
                    type_oldKey = proof.oldKey.bigInt()
                    type_oldValue = proof.oldValue.bigInt()
                    type_isOld0 = proof.isOld0 == true ? 1 : 0
                    type_key = proof.key.bigInt()
                    type_fnc = proof.fnc
                    type = proof.value.bigInt()

                }


                if (element.name == 'issuingStateCode') {
                    issueStateCode_siblings = proof.siblings.map(e => e.bigInt())
                    issueStateCode_oldKey = proof.oldKey.bigInt()
                    issueStateCode_oldValue = proof.oldValue.bigInt()
                    issueStateCode_isOld0 = proof.isOld0 == true ? 1 : 0
                    issueStateCode_key = proof.key.bigInt()
                    issueStateCode_fnc = proof.fnc
                    issuingStateCode = proof.value.bigInt()




                }
                circomProofs.push({
                    type: element.key,
                    // eslint-disable-next-line no-undef
                    value: (await merklized.mt.get(BigInt(element.key))).value,
                    proof: proof,
                    name: element.name
                })

            }





            const {
                proof, publicSignals, uncompressed_proof
            } = await utils.groth16FullProve({
                issuer_pk, issuer_signature,
                credentialRoot,
                issuerId,
                userId,
                set,
                type,
                enabled,
                issuer_siblings,
                issuer_oldKey,
                issuer_oldValue,
                issuer_isOld0,
                issuer_key, issuer_fnc,
                user_siblings,
                user_oldKey, user_oldValue,
                user_isOld0,
                user_key, user_fnc,
                type_siblings,
                type_oldKey, type_oldValue,
                type_isOld0,
                type_key, type_fnc,
                issuingStateCode,
                issueStateCode_siblings,
                issueStateCode_oldKey, issueStateCode_oldValue,
                issueStateCode_isOld0,
                issueStateCode_key,
                issueStateCode_fnc,
            }
                , wtns, verifyKey)


            console.log(
                {
                    proof, publicSignals, uncompressed_proof,
                }
            );
            return {
                proof, publicSignals, uncompressed_proof
            }

        },
        async generatezkProofOfPersonHood(credential, proof_type) {
            const verifyKey = `circuits/${proof_type}/${proof_type}_final.zkey`
            const wtns = `circuits/${proof_type}/${proof_type}_circuit.wasm`

            // resolve issuerDid
            const issuerDid = {
                "context": [
                    "https://www.w3.org/ns/did/v1",
                    "https://raw.githubusercontent.com/hypersign-protocol/hypersign-contexts/main/BabyJubJubKey2021.jsonld"
                ],
                "id": "did:hid:testnet:zAzbwBjvy5hZg5HZLZVVzK6Lc6BJPiWP1YqeUecYBiN6",
                "controller": [
                    "did:hid:testnet:zAzbwBjvy5hZg5HZLZVVzK6Lc6BJPiWP1YqeUecYBiN6"
                ],
                "alsoKnownAs": [],
                "verificationMethod": [
                    {
                        "id": "did:hid:testnet:zAzbwBjvy5hZg5HZLZVVzK6Lc6BJPiWP1YqeUecYBiN6#key-1",
                        "type": "BabyJubJubKey2021",
                        "controller": "did:hid:testnet:zAzbwBjvy5hZg5HZLZVVzK6Lc6BJPiWP1YqeUecYBiN6",
                        "publicKeyMultibase": "zAzbwBjvy5hZg5HZLZVVzK6Lc6BJPiWP1YqeUecYBiN6",
                        "blockchainAccountId": ""
                    }
                ],
                "authentication": [
                    "did:hid:testnet:zAzbwBjvy5hZg5HZLZVVzK6Lc6BJPiWP1YqeUecYBiN6#key-1"
                ],
                "assertionMethod": [
                    "did:hid:testnet:zAzbwBjvy5hZg5HZLZVVzK6Lc6BJPiWP1YqeUecYBiN6#key-1"
                ],
                "keyAgreement": [],
                "capabilityInvocation": [],
                "capabilityDelegation": [],
                "service": []
            }
            const publicKeyIssuerMultibase = issuerDid.verificationMethod[0].publicKeyMultibase
            const hexPublicKey = Buffer.from(multibase.decode(publicKeyIssuerMultibase), 'hex').toString('hex')

            const publicKeyIssuer = cryptoi3.PublicKey.newFromHex(hexPublicKey)

            console.log(publicKeyIssuer);

            const issuerSignatureBase64 = credential.proof.proofValue
            const issuerSignature = cryptoi3.Signature.newFromCompressed(multibase.decode(issuerSignatureBase64))
            delete credential.proof

            console.log(issuerSignature);

            let keyValuePair = [];
            const merklized = await MerkleTreeJSONLD.Merklizer.merklizeJSONLD(JSON.stringify(credential))

            merklized.entries.forEach((e, index) => {
                if (e.key.parts.length == 1 && e.key.parts[0].includes('credentialSubject')) {
                    keyValuePair.push({

                        key: index, value: e.value,
                        name: 'holderDid'

                    })
                }
                e.key.parts.find(k => {



                    if (typeof k == 'string' && k.includes('issuer')) {
                        keyValuePair.push({

                            key: index, value: e.value,
                            name: 'issuerDid'


                        })
                    }


                    // if (typeof k == 'string' && k.length == 1 && k.includes('credentialSubject')) {
                    //     keyValuePair.push({

                    //         key: e.key, value: e.value

                    //     })
                    // }


                    if (k == 0) {
                        keyValuePair.push({

                            key: index, value: e.value,
                            name: 'credentialType'

                        })

                    }

                })
            })
            const credentialRoot = (await merklized.mt.root()).bigInt()
            const issuer_pk = [
                publicKeyIssuer.p[0],
                publicKeyIssuer.p[1]
            ]
            const issuer_signature = [issuerSignature.R8[0],
            issuerSignature.R8[1],
            issuerSignature.S
            ]
            const enabled = 1n

            let issuer_siblings;
            let issuer_oldKey;
            let issuer_oldValue;
            let issuer_isOld0;
            let issuer_key;
            let issuer_fnc;
            let issuerId;

            let user_siblings;
            let user_oldKey;
            let user_oldValue;
            let user_isOld0;
            let user_key;
            let user_fnc;
            let userId;

            let type_siblings;
            let type_oldKey;
            let type_oldValue;
            let type_isOld0;
            let type_key;
            let type_fnc;
            let type;

            const circomProofs = []

            for (let index = 0; index < keyValuePair.length; index++) {
                const element = keyValuePair[index];

                // eslint-disable-next-line no-undef
                const proof = await merklized.mt.generateCircomVerifierProof(BigInt(element.key), MerkleTree.ZERO_HASH)
                if (element.name == 'issuerDid') {
                    issuer_siblings = proof.siblings.map(e => e.bigInt())
                    issuer_oldKey = proof.oldKey.bigInt()
                    issuer_oldValue = proof.oldValue.bigInt()
                    issuer_isOld0 = proof.isOld0 == true ? 1 : 0
                    issuer_key = proof.key.bigInt()
                    issuer_fnc = proof.fnc
                    issuerId = proof.value.bigInt()

                }

                if (element.name == 'holderDid') {
                    user_siblings = proof.siblings.map(e => e.bigInt())
                    user_oldKey = proof.oldKey.bigInt()
                    user_oldValue = proof.oldValue.bigInt()
                    user_isOld0 = proof.isOld0 == true ? 1 : 0
                    user_key = proof.key.bigInt()
                    user_fnc = proof.fnc
                    userId = proof.value.bigInt()

                }

                if (element.name == 'credentialType') {
                    type_siblings = proof.siblings.map(e => e.bigInt())
                    type_oldKey = proof.oldKey.bigInt()
                    type_oldValue = proof.oldValue.bigInt()
                    type_isOld0 = proof.isOld0 == true ? 1 : 0
                    type_key = proof.key.bigInt()
                    type_fnc = proof.fnc
                    type = proof.value.bigInt()

                }

                circomProofs.push({
                    type: element.key,
                    // eslint-disable-next-line no-undef
                    value: (await merklized.mt.get(BigInt(element.key))).value,
                    proof: proof,
                    name: element.name
                })

            }

            const {
                proof, publicSignals, uncompressed_proof
            } = await utils.groth16FullProve({
                issuer_pk, issuer_signature,
                credentialRoot,
                issuerId,
                userId,
                type,
                enabled,
                issuer_siblings,
                issuer_oldKey,
                issuer_oldValue,
                issuer_isOld0,
                issuer_key, issuer_fnc,
                user_siblings,
                user_oldKey, user_oldValue,
                user_isOld0,
                user_key, user_fnc,
                type_siblings,
                type_oldKey, type_oldValue,
                type_isOld0,
                type_key, type_fnc
            }
                , wtns, verifyKey)

            console.log(
                {
                    proof, publicSignals, uncompressed_proof,
                }
            );
            return {
                proof, publicSignals, uncompressed_proof
            }

        },
        async getProof(proof) {
            try {


                this.isLoading = true
                // 
                console.log('Getting proof for proof type ' + proof.proof_type)
                // TODO: get the required credential from edv

                // const credentialType = proof.credentialType;
                // const trustedIssuer = this.getWidgetConfigFromDb.issuerDID

                // let trustedIssuerList = []
                // if (trustedIssuer) {
                //     trustedIssuerList = trustedIssuer.split(',')
                // }
                // console.log(
                //     {
                //         credentialType, trustedIssuerList
                //     }
                // );

                // const credential = await this.getCredentialFromVault(credentialType, trustedIssuer)
                // console.log(credential);
                const credential = {
                    "@context": [
                        "https://www.w3.org/2018/credentials/v1",
                        "https://schema.org",
                        "https://w3id.org/security/suites/ed25519-2020/v1"
                    ],
                    "id": "vc:hid:testnet:z6MkiHmq1umDVQZ4NfkLAVtGR4Adzd1VFgsF6nWkaqSK5WBr",
                    "type": [
                        "VerifiableCredential",
                        "PassportCredential"
                    ],
                    "issuer": "did:hid:testnet:zAzbwBjvy5hZg5HZLZVVzK6Lc6BJPiWP1YqeUecYBiN6",
                    "issuanceDate": "2024-09-16T06:37:22Z",
                    "expirationDate": "2024-09-16T06:37:22Z",
                    "credentialSubject": {
                        "@explicit": true,
                        "docModel": "INDIA - PASSPORT (2016)",
                        "overallRating": 100,
                        "face": "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",
                        "surname": "BHUSHAN",
                        "givenNames": "VISHWAS ANAND",
                        "documentNumber": "P9320571",
                        "sex": "M",
                        "nationality": "आारतीय",
                        "dateOfBirth": 753408000000,
                        "placeOfBirth": "BIHAR, BIHAR",
                        "issuingStateCode": "IND",
                        "dateOfExpiry": 1804204800000,
                        "dateOfIssue": 1488758400000,
                        "placeOfIssue": "KOLKATA",
                        "id": "did:hid:testnet:zFJVDvB6P3LwHRd4QmKYBz23xxSWViPb24XHDiYiAyZs2"
                    },
                    "credentialStatus": {
                        "id": "https://api.prajna.hypersign.id/hypersign-protocol/hidnode/ssi/credential/vc:hid:testnet:z6MkiHmq1umDVQZ4NfkLAVtGR4Adzd1VFgsF6nWkaqSK5WBr",
                        "type": "HypersignCredentialStatus2023"
                    },
                    "proof": {
                        "type": "BJJSignature2021",
                        "created": "2024-09-16T06:39:03Z",
                        "verificationMethod": "did:hid:testnet:zAzbwBjvy5hZg5HZLZVVzK6Lc6BJPiWP1YqeUecYBiN6#key-1",
                        "proofPurpose": "assertionMethod",
                        "proofValue": "z2DqLTvAvQ2LBeDT9Uk2CH5u4pz3YXVawC7CEuitPEfEP5PZdgi1ZHdCo5z7qbrsXZRpS4ZEUpCLH4pjDqRjvPDL8"
                    }
                }

                /// TODO: actual logic to generate proof
                console.log('Before calling this.generatezkProof for type ' + proof.proofType);
                const zkProof = await this.generatezkProof(credential, proof.proofType /*proof.proof_type */)
                console.log(zkProof);
                console.log('After calling this.generatezkProof()')

                zkProof.proofType = proof.proofType
                console.log('Before calling this.verifyZkProof()')
                const resp = await this.verifyZkProof(
                    zkProof
                )
                console.log(resp);

                /// TODO: call verify proof API 
                if (resp) {
                    this.hypersign_proofs.map(x => {
                        if (x.proof_type == proof.proof_type) {
                            x['zkProof'] = true
                        }
                    })
                }
                this.isLoading = false
            } catch (e) {
                this.toast(e.message, 'error')
            } finally {
                this.isLoading = false
            }
        },

        showWalletModal() {
            this.showModal = true
            // this.$root.$emit("bv::toggle::collapse", "sidebar-right");
        },

        async mint(proof) {
            try {
                if (!this.isOnchainIdEnabled) {
                    this.toast("OnChain ID minting is not enabled")
                    return
                }

                if (this.showConnectWallet) {
                    this.showWalletModal()
                    return;
                }
                console.log('Getting sbt for proof type ' + proof.proof_type)

                // return;

                this.isLoading = true
                const sbtTokenId = Math.floor(Math.random(100000) * 100000).toString(); // TODO: better random id
                // const sbtTokenUri = "ipfs://" + sbtTokenId; // TODO: remove hardcoding

                const smartContractMsg = constructKYCSBTMintMsg({ hypersign_proof: proof });
                // Perform the CreateTodo Smart Contract Execution
                // Note: This is a blockchain transaction
                const chainConfig = this.getChainConfig
                const chainCoinDenom = chainConfig["feeCurrencies"][0]["coinMinimalDenom"]
                const gasPriceAvg = chainConfig["gasPriceStep"]["average"]
                const fee = calculateFee(500_000, (gasPriceAvg + chainCoinDenom).toString())

                const result = await smartContractExecuteRPC(
                    this.cosmosConnection.signingClient,
                    chainCoinDenom,
                    this.connectedWalletAddress,
                    this.getOnChainIssuerConfig.contractAddress,
                    smartContractMsg, fee);

                if (result) {
                    this.toast(MESSAGE.ON_CHAIN.IDENTITY_SUCCESS)

                    // TODO: call server to udpate status
                    await this.verifySbtMint({
                        blockchainLabel: this.blockchainLabel,
                        sbtContractAddress: this.getOnChainIssuerConfig.contractAddress,
                        ownerWalletAddress: this.connectedWalletAddress,
                        tokenId: sbtTokenId, // TODO what is this token ID.
                        transactionHash: result.transactionHash,
                        proofType: proof.proofType

                    });
                    this.isLoading = false
                    // Implement feature in caach server to capture user's miniing step
                    this.hypersign_proofs.map(x => {
                        if (x.proof_type == proof.proof_type) {
                            x['zkSBT'] = true
                        }
                    })
                    // this.nextStep();
                }

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
        this.nft.metadata = await this.getContractMetadata(this.getOnChainIssuerConfig.sbtContractAddress)
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
            console.log({
                proofType: x.proofType,
                credential: this.getTrustedIssuersCredentials.find(y => y.type[1] == x.proofType)
            })
            if (hypersignProof) {
                this.hypersign_proofs.push({
                    "credential_id": "",
                    "data": "",
                    "description": hypersignProof.description,
                    "proof_type_image": hypersignProof.image,
                    "sbt_code": hypersignProof.sbtCode,
                    "bgColor": hypersignProof.bgColor,
                    "proof_type": hypersignProof.type, //  x.proofType, TODO: need to change this in smart contracts,
                    "proofType": x.proofType,
                    "credentialType": hypersignProof.credentialType,
                    "zkProof": (this.getTrustedIssuersCredentials.find(y => y.type[1] == x.proofType) ? true : false),
                    "zkSBT": (this.getTrustedIssuersCredentials.find(y => y.type[1] == (x.proofType + 'SbtCredential')) ? true : false),
                })

                // this.showModal = true
            } else {
                console.error('Invalid proof of type, x.proofType = ' + x.proofType)
            }
        })
    },
    beforeDestroy() {
        this.disconnectWallet()
    }

}
</script>