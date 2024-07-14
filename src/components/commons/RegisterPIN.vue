<template>
    <div>
        <div class="container widget-card">
            <div class="row mb-2">
                Enter 5 digits PIN:
                <PIN @pinTakenEvent="getPin" inputType="password" />
            </div>

            <div class="row mb-2">
                Confirm PIN:
                <PIN @pinTakenEvent="getRenterPin" inputType="password" />
            </div>

            <div class="row mb-1">
                <InfoMessage :message="warningMessage" />
            </div>
        </div>
        <div class="container">
            <div class="row center mt-3">
                <button class="btn btn-outline-dark" @click="submit()" style="width:50%">
                    <i class="bi bi-safe"></i> Unlock Vault
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
            reEnterPin: "",
            warningMessage: "The PIN secures your data vault, ensuring that no one else, including us, can access your data. You own your data! The PIN is needed to access your encrypted data vault, so don't lose it."
        }
    },
    methods: {
        ...mapMutations(['nextStep', "setVaultPin"]),
        async submit() {
            if (this.pin === this.reEnterPin) {
                if (confirm(this.warningMessage)) {
                    this.setVaultPin(this.reEnterPin)
                    this.$emit('proceedWithUnlockVaultAndSyncDataEvent', true)
                }
            } else {
                alert('Pins did not match')
            }
        },


        getPin(data) {
            this.pin = data;
        },
        getRenterPin(data) {
            this.reEnterPin = data;
        }
    }
}


</script>

<style scoped></style>