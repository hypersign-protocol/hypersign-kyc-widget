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
                                <h5 class="card-title">{{
                                    hypersign_proof.proofType == "zkProofOfAge" ? hypersign_proof.proofType + ` >
                                    ${getCriteria(hypersign_proof)} ` : hypersign_proof.proofType }}</h5>
                                <p class="card-text mt-2">{{ hypersign_proof.description }}</p>
                                <p v-if="hypersign_proof.zkProof && hypersign_proof.zkSBT" class="card-text mt-6"> {{
                                    hypersign_proof.proofType+"SBT" }}
                                    Minted</p>

                                <template v-if="!hypersign_proof.zkProof && getWidgetConfigFromDb.zkProof.enabled">
                                    <button class="btn btn-outline-dark" @click="getProof(hypersign_proof)">
                                        <i class="bi bi-shield-lock"></i>
                                        Get Proof Now
                                    </button>
                                </template>
                                <template v-else-if="!hypersign_proof.zkSBT && getWidgetConfigFromDb.onChainId.enabled">
                                    <button class="btn btn-outline-dark" @click="mint(hypersign_proof)">
                                        <i class="bi bi-hammer"></i>
                                        Mint Your SBT
                                    </button>
                                </template>
                            </div>
                        </div>

                        <div class="col-md-1" v-if="isOnchainIdEnabled">
                            <div v-if="hypersign_proof.zkProof && hypersign_proof.zkSBT">
                                <i class="bi bi-check2-circle" style="font-size:xx-large"> </i>
                                <br />
                                <i class="bi bi-person-fill-check" style="font-size:xx-large"></i>

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
                <div class="d-grid gap-1 " style="width: 20%;margin: auto;"
                    v-if="!getWidgetConfigFromDb.onChainId.enabled && isAllZkProofVerified()">
                    <button class="btn btn-outline-dark" @click="nextStep(7)">
                        Next
                    </button>
                </div>
            </div>

            <div class="container mt-3">
                <div class="d-grid gap-1 " style="width: 20%;margin: auto;"
                    v-if="isAllZkProofVerified() && isAllZkProofSBTMinted() && getWidgetConfigFromDb.onChainId.enabled">
                    <button class="btn btn-outline-dark" @click="nextStep(7)">
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
import documentLoader from 'hs-ssi-sdk/build/libs/w3cache/v1'
import vaultConfig from '@/store/vault/config'
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
            const { hypersign } = JSON.parse(localStorage.getItem(vaultConfig.LOCAL_STATES.VAULT_DATA_RAW))
            const { credentials } = hypersign
            return credentials;
        },
        getTrustedIssuersCredentials() {
            return this.getVaultDataCredentials.filter(x => this.getTrustedIssuers.includes(x.issuer))
        },
        getTrustedIssuers() {
            const issuerDID = this.getWidgetConfigFromDb.issuerDID
            if (issuerDID) {
                return issuerDID.split(',')
            } else {
                return []
            }
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
        ...mapActions(["getNewSession", 'verifySbtMint', 'verifyZkProof', 'resolveIssuerId']),
        ...mapGetters(['getCredentialFromVault', 'getWidgetConfigFromDb']),
        getCriteria(proof) {
            const widgetConfig = this.getWidgetConfigFromDb
            const proofConfig = widgetConfig.zkProof.proofs.find(e => e.proofType === proof.proofType)
            return proofConfig.criteria

        },
        getVaultDataCredentialsMethod() {
            const { hypersign } = JSON.parse(localStorage.getItem(vaultConfig.LOCAL_STATES.VAULT_DATA_RAW))
            const { credentials } = hypersign
            return credentials;
        },
        getTrustedIssuersCredentialsMethod() {
            return this.getVaultDataCredentialsMethod().filter(x => this.getTrustedIssuers.includes(x.issuer))
        },

        isAllZkProofSBTMinted() {
            const result = this.hypersign_proofs.map(e => {


                if (e.zkSBT == false) {
                    return false
                }
                return true
            })
            if (result.includes(false)) {
                return false
            } else {
                return true
            }
        },
        isAllZkProofVerified() {
            const result = this.hypersign_proofs.map(e => {


                if (e.zkProof == false) {
                    return false
                }
                return true
            })
            if (result.includes(false)) {
                return false
            } else {
                return true
            }

        },




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

        async generatezkProof(credeital, proof_type, criteria) {

            switch (proof_type) {
                case ZK_PROOF_TYPES.zkProofOfAge: {
                    return this.generatezkProofOfAge(credeital, proof_type, criteria)
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
        async generatezkProofOfAge(credential, proof_type, criteria) {
            const verifyKey = `circuits/${proof_type}/${proof_type}_final.zkey`
            const wtns = `circuits/${proof_type}/${proof_type}_circuit.wasm`
            const issuerDidT = await this.resolveIssuerId({
                issuerDid: credential.issuer
            })
            const issuerDid = issuerDidT.didDocument
            const verificationMethod = issuerDid.verificationMethod.find(e => {
                if (e.id == credential.proof.verificationMethod) {
                    return e
                }
            })


            const publicKeyIssuerMultibase = verificationMethod.publicKeyMultibase
            const hexPublicKey = Buffer.from(multibase.decode(publicKeyIssuerMultibase), 'hex').toString('hex')


            const publicKeyIssuer = cryptoi3.PublicKey.newFromHex(hexPublicKey)


            const issuerSignatureBase64 = credential.proof.proofValue
            const issuerSignature = cryptoi3.Signature.newFromCompressed(multibase.decode(issuerSignatureBase64))
            delete credential.proof.proofValue







            let keyValuePair = [];
            const merklized = await MerkleTreeJSONLD.Merklizer.merklizeJSONLD(JSON.stringify(credential), {
                documentLoader: documentLoader
            })
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


            // eslint-disable-next-line no-undef
            const ageCriteria = BigInt(parseInt(criteria))

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

            if (publicSignals[0] !== "1") {
                throw new Error("Age criteria " + parseInt((new Date() - new Date(parseInt(dateOfBirth))) / (1000 * 60 * 60 * 24 * 30 * 12)) + " > " + ageCriteria + " not fulfilled")
            }
            return {
                proof, publicSignals, uncompressed_proof
            }
        },
        async generatezkProofOfDOB(credential, proof_type) {
            const verifyKey = `circuits/${proof_type}/${proof_type}_final.zkey`
            const wtns = `circuits/${proof_type}/${proof_type}_circuit.wasm`
            // resolve issuerDid
            const issuerDidT = await this.resolveIssuerId({
                issuerDid: credential.issuer
            })
            const issuerDid = issuerDidT.didDocument
            const verificationMethod = issuerDid.verificationMethod.find(e => {
                if (e.id == credential.proof.verificationMethod) {
                    return e
                }
            })


            const publicKeyIssuerMultibase = verificationMethod.publicKeyMultibase
            const hexPublicKey = Buffer.from(multibase.decode(publicKeyIssuerMultibase), 'hex').toString('hex')


            const publicKeyIssuer = cryptoi3.PublicKey.newFromHex(hexPublicKey)

            console.log(publicKeyIssuer);

            const issuerSignatureBase64 = credential.proof.proofValue
            const issuerSignature = cryptoi3.Signature.newFromCompressed(multibase.decode(issuerSignatureBase64))
            delete credential.proof.proofValue







            let keyValuePair = [];
            const merklized = await MerkleTreeJSONLD.Merklizer.merklizeJSONLD(JSON.stringify(credential), {
                documentLoader: documentLoader

            })
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
            const issuerDidT = await this.resolveIssuerId({
                issuerDid: credential.issuer
            })
            const issuerDid = issuerDidT.didDocument
            const verificationMethod = issuerDid.verificationMethod.find(e => {
                if (e.id == credential.proof.verificationMethod) {
                    return e
                }
            })


            const publicKeyIssuerMultibase = verificationMethod.publicKeyMultibase
            const hexPublicKey = Buffer.from(multibase.decode(publicKeyIssuerMultibase), 'hex').toString('hex')


            const publicKeyIssuer = cryptoi3.PublicKey.newFromHex(hexPublicKey)

            console.log(publicKeyIssuer);

            const issuerSignatureBase64 = credential.proof.proofValue
            const issuerSignature = cryptoi3.Signature.newFromCompressed(multibase.decode(issuerSignatureBase64))
            delete credential.proof.proofValue







            let keyValuePair = [];
            const merklized = await MerkleTreeJSONLD.Merklizer.merklizeJSONLD(JSON.stringify(credential),
                {
                    documentLoader: documentLoader

                })
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


            // Prepare the circuit inputs
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


            return {
                proof, publicSignals, uncompressed_proof
            }

        },
        async generatezkProofOfMembership(credential, proof_type) {




            const verifyKey = `circuits/${proof_type}/${proof_type}_final.zkey`
            const wtns = `circuits/${proof_type}/${proof_type}_circuit.wasm`




            const issuerDidT = await this.resolveIssuerId({
                issuerDid: credential.issuer
            })
            const issuerDid = issuerDidT.didDocument
            const verificationMethod = issuerDid.verificationMethod.find(e => {
                if (e.id == credential.proof.verificationMethod) {
                    return e
                }
            })


            const publicKeyIssuerMultibase = verificationMethod.publicKeyMultibase
            const hexPublicKey = Buffer.from(multibase.decode(publicKeyIssuerMultibase), 'hex').toString('hex')


            const publicKeyIssuer = cryptoi3.PublicKey.newFromHex(hexPublicKey)


            const issuerSignatureBase64 = credential.proof.proofValue
            const issuerSignature = cryptoi3.Signature.newFromCompressed(multibase.decode(issuerSignatureBase64))
            delete credential.proof.proofValue

            let keyValuePair = [];
            const merklized = await MerkleTreeJSONLD.Merklizer.merklizeJSONLD(JSON.stringify(credential),
                {
                    documentLoader: documentLoader

                })
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


            // Prepare the circuit inputs
            const issuer_pk = [
                publicKeyIssuer.p[0],
                publicKeyIssuer.p[1]
            ]

            const issuer_signature = [issuerSignature.R8[0],
            issuerSignature.R8[1],
            issuerSignature.S
            ]

            const enabled = 1n
            const posidon = cryptoi3.Poseidon.hashBytes


            const set = [
                posidon(new TextEncoder().encode('USA')),
                posidon(new TextEncoder().encode('RUS')),
                posidon(new TextEncoder().encode('AUS')),
                posidon(new TextEncoder().encode('CHN')),
                posidon(new TextEncoder().encode('IND'))
            ]



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



            return {
                proof, publicSignals, uncompressed_proof
            }

        },
        async generatezkProofOfPersonHood(credential, proof_type) {



            const verifyKey = `circuits/${proof_type}/${proof_type}_final.zkey`
            const wtns = `circuits/${proof_type}/${proof_type}_circuit.wasm`
            const issuerDidT = await this.resolveIssuerId({
                issuerDid: credential.issuer
            })
            const issuerDid = issuerDidT.didDocument
            const verificationMethod = issuerDid.verificationMethod.find(e => {
                if (e.id == credential.proof.verificationMethod) {
                    return e
                }
            })



            const publicKeyIssuerMultibase = verificationMethod.publicKeyMultibase
            const hexPublicKey = Buffer.from(multibase.decode(publicKeyIssuerMultibase), 'hex').toString('hex')

            const publicKeyIssuer = cryptoi3.PublicKey.newFromHex(hexPublicKey)


            const issuerSignatureBase64 = credential.proof.proofValue
            const issuerSignature = cryptoi3.Signature.newFromCompressed(multibase.decode(issuerSignatureBase64))

            delete credential.proof.proofValue

            let keyValuePair = [];
            const merklized = await MerkleTreeJSONLD.Merklizer.merklizeJSONLD(JSON.stringify(credential), {
                documentLoader: documentLoader

            })

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
                        console.log(index, e.value);

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
            console.log({
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
            });

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


            return {
                proof, publicSignals, uncompressed_proof
            }

        },
        async getProof(proof) {
            try {


                this.isLoading = true
                const widgetConfig = this.getWidgetConfigFromDb
                const trustedIssuer = widgetConfig.issuerDID
                let credentialType;
                let trustedIssuerList = []
                if (trustedIssuer) {
                    trustedIssuerList = trustedIssuer.split(',')
                }
                let criteria = null

                credentialType = proof.credentialType



                if (proof.proof_type === 'zk_proof_of_age') {
                    const proofConfig = widgetConfig.zkProof.proofs.find(e => e.proofType === proof.proofType)
                    criteria = proofConfig.criteria


                }

                const credential = this.$store.getters.getCredentialFromVault(
                    {
                        credentialType, trustedIssuerList, proofType: proof.proof_type
                    })



                // eslint-disable-next-line no-unreachable
                const zkProof = await this.generatezkProof(credential, proof.proofType, criteria)

                zkProof.proofType = proof.proofType
                const resp = await this.verifyZkProof(
                    zkProof
                )

                if (resp) {
                    this.hypersign_proofs.map(x => {
                        if (x.proof_type == proof.proof_type) {
                            x['zkProof'] = true
                        }
                    })
                }
                // eslint-disable-next-line no-unreachable
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



                this.isLoading = true
                console.log(this.getTrustedIssuersCredentialsMethod());

                const credential = this.getTrustedIssuersCredentialsMethod().find(y => y.type[1] == proof.proofType)



                console.log('Getting sbt for proof type ' + proof.proof_type)
                const zkProof = {
                    proof_type: proof.proof_type,
                    proof: credential?.credentialSubject?.proof,
                    public_signales: credential?.credentialSubject.publicSignals

                }

                this.isLoading = true
                const sbtTokenId = Math.floor(Math.random(100000) * 100000).toString(); // TODO: better random id
                // const sbtTokenUri = "ipfs://" + sbtTokenId; // TODO: remove hardcoding

                const smartContractMsg = constructKYCSBTMintMsg({
                    hypersign_proof:
                    {
                        credential_id: "235235",
                        zk_proof: zkProof
                    }
                }
                );
                // Perform the CreateTodo Smart Contract Execution
                // Note: This is a blockchain transaction
                const chainConfig = this.getChainConfig
                const chainCoinDenom = chainConfig["feeCurrencies"][0]["coinMinimalDenom"]
                const gasPriceAvg = chainConfig["gasPriceStep"]["average"]
                const fee = calculateFee(600_000, (gasPriceAvg + chainCoinDenom).toString())
                console.log(smartContractMsg);

                // throw new Error("hello")
                // eslint-disable-next-line no-unreachable
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
                console.log(e.message);

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
        this.isLoading = true
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
        this.isLoading = false

    },
    beforeDestroy() {
        this.disconnectWallet()
    }

}
</script>