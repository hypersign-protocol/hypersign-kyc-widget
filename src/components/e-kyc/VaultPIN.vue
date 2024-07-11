<template>
    <div>
        <div class="card-body min-h-36">
            <load-ing :active.sync="isLoadingPage" :can-cancel="true" :is-full-page="fullPage"></load-ing>

            <PageHeading :header="'Vault Setup'" :subHeader="'Setup a PIN to secure your vault'" />
            <div class="center" v-if="ifNewUser">
                <RegisterPIN @proceedWithUnlockVaultAndSyncDataEvent="unlockVaultAndSyncData" />
            </div>

            <div v-else>
                <AskPIN @proceedWithUnlockVaultAndSyncDataEvent="unlockVaultAndSyncData" />
            </div>
        </div>
        <MessageBox :msg="toastMessage" :type="toastType" v-if="isToast" />
    </div>

</template>

<script type="text/javascript">
import AskPIN from '../commons/AskPIN.vue';
import RegisterPIN from '../commons/RegisterPIN.vue';
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';
import { generateMnemonicForWallet, generateMnemonicToHDSeed } from '../utils/hd-wallet'
import { HypersignDID } from 'hs-ssi-sdk';
import { STEP_NAMES } from '../../config';
import VaultConfig from '../../store/vault/config'
export default {
    name: STEP_NAMES.VaultPIN,
    computed: {
        ...mapState(['ifNewUser', 'steps']),
        ...mapGetters(['getWidgetConfigFromDb', 'getActiveStep', "getSteps", 'getVaultData'])
    },
    components: {
        AskPIN,
        RegisterPIN,
    },
    async created() {
        if (this.getWidgetConfigFromDb.faceRecog) {
            this.enableAstep(STEP_NAMES.LiveLiness)
        }

        if (this.getWidgetConfigFromDb.idOcr.enabled) {
            this.enableAstep(STEP_NAMES.IdDocs)
        }

        if (this.getWidgetConfigFromDb.onChainId.enabled) {
            this.enableAstep(STEP_NAMES.OnChainId)
        }
    },
    methods: {
        ...mapMutations(['nextStep', 'setVaultRaw', 'setAStep']),
        ...mapActions(["unlockVault", "lockVault", "syncUserData", "syncUserDataById", "retriveVaultKeys", "retriveVaultCredentials", 'addUpdateDocumentById']),
        enableAstep(stepName) {
            const stepToUpdate = this.steps.find(x => x.stepName === stepName)
            stepToUpdate.isEnabled = true;
            this.setAStep(stepToUpdate);
        },
        async unlockVaultAndSyncData(data) {
            try {
                if (data) {
                    this.isLoadingPage = true;

                    if (this.ifNewUser) {
                        this.generateMnemonic1()
                        await this.generateDID()
                        if (this.userVaultDataRaw) this.setVaultRaw(JSON.stringify(this.userVaultDataRaw))
                        await this.lockVault()
                        //// store keys in the vault
                        const payload = {
                            document: this.getVaultData,
                            namespace: VaultConfig.VAULT_KEY_NAMESPACE,
                            metadata: 'keys and dids for the vault'
                        }
                        await this.addUpdateDocumentById(payload)
                    } else {
                        //// retrive keys from vault 
                        await this.retriveVaultKeys()
                        //// retrive all credentials
                        await this.retriveVaultCredentials()
                    }

                    this.isLoadingPage = false
                    this.nextStep()
                } else {
                    this.isLoadingPage = false
                }

            } catch (e) {
                this.toast(e.message, 'error')
                this.isLoadingPage = false
            }
        },
        generateMnemonic1() {
            this.userVaultDataRaw.mnemonic = generateMnemonicForWallet()
        },
        async generateDID() {
            const seed = await generateMnemonicToHDSeed(this.userVaultDataRaw.mnemonic)
            const hypersignDID = new HypersignDID({ namespace: 'testnet' });
            const kp = await hypersignDID.generateKeys({ seed });


            const didDocument = await hypersignDID.generate({ publicKeyMultibase: kp.publicKeyMultibase });


            this.userVaultDataRaw.hypersign.did = didDocument.id;
            this.userVaultDataRaw.hypersign.didDoc = { ...didDocument }
            this.userVaultDataRaw.hypersign.keys = { ...kp }
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
    },
    data() {
        return {
            isLoadingPage: false,
            fullPage: true,
            toastMessage: "",
            toastType: "success",
            isToast: false,
            userVaultDataRaw: {
                "password": "",
                "mnemonic": "",
                "hypersign": {
                    "did": "",
                    "keys": {
                    },
                    "credentials": []
                }
            }
        }
    },
}
</script>

<style scoped></style>