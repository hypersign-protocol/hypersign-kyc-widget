<template>
    <div class="center" style="width: 100%;">
        <div class="widget-card">
            <p style="text-align: left;">
                Enter 5 digits PIN:
                <PIN @pinTakenEvent="getPin" inputType="password" />
            </p>
            <p>
                <InfoMessage
                    message="This PIN is to secure your data vault. The ensures that you do not trust any one with your data, not event us. The PIN is used to access your encrypted data vault. Make sure you do not loose it." />
            </p>
            <p>
                <button class="btn btn-outline-dark" @click="submit()">
                    <i class="bi bi-unlock"></i> Unlock Vault
                </button>
            </p>
        </div>
    </div>
</template>

<script type="text/javascript">
import PIN from '../commons/PIN.vue'
import { mapMutations } from 'vuex';

export default {
    name: "VaultPin",
    components: {
        PIN
    },
    data() {
        return {
            pin: "",
            reEnterPin: ""
        }
    },
    methods: {
        ...mapMutations(['nextStep', "setVaultPin"]),
        async submit() {
            this.setVaultPin(this.pin)
            this.$emit('proceedWithUnlockVaultAndSyncDataEvent', true)
        },
        getPin(data) {
            console.log('Pin ' + data)
            this.pin = data;
        },
    }
}


</script>

<style scoped></style>