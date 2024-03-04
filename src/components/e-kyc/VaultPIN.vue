<template>
    <div style="min-height: 850px">
        <div class="card-body" style="max-height:750px;">
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
export default {
    name: "VaultPin",
    computed: {
        ...mapState(['ifNewUser']),
    },
    components: {
        AskPIN,
        RegisterPIN,
    },
    methods: {
        ...mapMutations(['nextStep']),
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
                        await this.lockVault()
                        console.log('before calling syncUserData')
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
            isToast: false
        }
    },
}
</script>

<style scoped></style>