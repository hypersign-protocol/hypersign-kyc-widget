<template>
    <div>
        <div class="container widget-card">
            <div class="row">
                Enter 5 digits PIN:
                <PIN @pinTakenEvent="getPin" inputType="password" />
            </div>
            <div class="row">
                <InfoMessage
                    message="This PIN is to secure your data vault. The ensures that you do not trust any one with your data, not event us. The PIN is used to access your encrypted data vault. Make sure you do not loose it." />
            </div>
        </div>
        <div class="container">
            <div class="row center mt-3">
                <button class="btn btn-outline-dark" @click="submit()" style="width:50%">
                    <i class="bi bi-unlock"></i> Unlock Vault
                </button>
            </div>
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