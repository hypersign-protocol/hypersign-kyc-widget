<template>
    <div style="min-height: 850px">
        <div class="card-body" style="max-height:750px;min-height: 850px">
            <load-ing :active.sync="isLoadingPage" :can-cancel="true" :is-full-page="fullPage"></load-ing>

            <PageHeading :header="'Vault Setup'" :subHeader="'Setup a PIN to secure your vault'" />
            <div class="center" v-if="ifNewUser">
                <RegisterPIN @proceedWithUnlockVaultAndSyncDataEvent="unlockVaultAndSyncData" />
            </div>

            <div class="center" v-else>
                <AskPIN @proceedWithUnlockVaultAndSyncDataEvent="unlockVaultAndSyncData" />
            </div>
        </div>
        <MessageBox :msg="toastMessage" :type="toastType" v-if="isToast" />
    </div>

</template>

<script type="text/javascript">
import AskPIN from '../commons/AskPIN.vue';
import RegisterPIN from '../commons/RegisterPIN.vue';
import { mapState, mapActions, mapMutations } from 'vuex';
import { generateMnemonicForWallet, generateMnemonicToHDSeed } from '../utils/hd-wallet'
import { HypersignDID } from 'hs-ssi-sdk';
export default {
    name: "VaultPin",
    computed: {
        ...mapState(['ifNewUser']),
    },
    components: {
        AskPIN,
        RegisterPIN,
    },
    async created() {
        // this.generateMnemonic1()
        // await this.generateDID()

    },
    methods: {
        ...mapMutations(['nextStep', 'setVaultRaw']),
        ...mapActions(["unlockVault", "lockVault", "syncUserData", "syncUserDataById"]),
        async unlockVaultAndSyncData(data) {
            try {
                if (data) {
                    console.log('Inside unlockVaultAndSyncData handler')
                    console.log('before calling unlocakVault')
                    this.isLoadingPage = true;
                    if (!this.ifNewUser) {
                        await this.syncUserDataById()
                    }
                    const res = await this.unlockVault();
                    if (!res) {
                        console.log('before calling lockVault')
                        const res = await this.lockVault()
                        console.log('before calling syncUserData')
                        if (!res && this.ifNewUser) {
                            // create a wallet                            
                            // create a did
                            // setup raw data
                            const rawData = {
                                here: "something"
                            }
                            // store 
                            this.setVaultRaw(rawData)
                        }
                        this.syncUserData()
                    }
                    console.log('after calling syncUserData')
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
            console.log(this.userVaultDataRaw.mnemonic)
        },
        async generateDID() {
            const seed = await generateMnemonicToHDSeed(this.userVaultDataRaw.mnemonic)
            console.log(seed)
            const hypersignDID = new HypersignDID({ namespace: 'testnet' });
            const kp = await hypersignDID.generateKeys({ seed });
            console.log({ ...kp })

            const didDocument = await hypersignDID.generate({ publicKeyMultibase: kp.publicKeyMultibase });
            console.log({ ...didDocument })

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
            }, 2000);
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
                        "type": "Ed25519VerificationKey2020",
                        "publicKeyMultibase": "z6Mks8UYRXiEcAfcYKSgbQHQJHGGfTr9oqPh6BbT6murJpMc",
                        "privateKeyMultibase": "zrv2WFSMYeiS6oAFrcx5VwxHQZJvb1XC2Pq4AHZVrJSiZT4KfTzGCmaSJcrFsJRXwEbDEBSL8NicrQVPpQGPeYBnamU"
                    },
                    "credentials": [],
                    "credentialsTemp": [],
                    "requestingAppInfo": "",
                    "thridPartyAuths": [],
                    "dids": {
                        "did:hid:testnet:z6Mks8UYRXiEcAfcYKSgbQHQJHGGfTr9oqPh6BbT6murJpMc": {
                            "didDoc": {},
                            "hdPathIndex": 0,
                            "status": "private",
                            "keys": {
                                "type": "Ed25519VerificationKey2020",
                                "publicKeyMultibase": "z6Mks8UYRXiEcAfcYKSgbQHQJHGGfTr9oqPh6BbT6murJpMc",
                                "privateKeyMultibase": "zrv2WFSMYeiS6oAFrcx5VwxHQZJvb1XC2Pq4AHZVrJSiZT4KfTzGCmaSJcrFsJRXwEbDEBSL8NicrQVPpQGPeYBnamU"
                            }
                        }
                    },
                    "didDoc": {

                    }
                }
            }
        }
    },
}
</script>

<style scoped></style>