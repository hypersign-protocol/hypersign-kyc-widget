<template>
    <div class="center">
        <div class="widget-card">
            <p style="text-align: left;">
                Enter 5 digit PIN:
                <PIN @pinTakenEvent="getPin" />
            </p>
            <p style="text-align: left;">
                Confirm PIN:
                <PIN @pinTakenEvent="getRenterPin" inputType="password" />
            </p>
            <p>
                <InfoMessage
                    message="This PIN is to secure your data vault. The ensures that you do not trust any one with your data, not event us. The PIN is used to access your encrypted data vault. Make sure you do not loose it." />
            </p>
            <p>
                <button class="btn btn-outline-dark" @click="submit()">
                    <i class="bi bi-safe"></i> Save
                </button>
            </p>
        </div>
    </div>
</template>

<script type="text/javascript">
import PIN from '../commons/PIN.vue'
import { mapMutations, mapActions } from 'vuex';

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
        ...mapActions(["unlockVault"]),
        async submit() {
            // try {
            //     const result = await this.unlockVault()
            //     if (result) {
            //         this.nextStep()
            //     }
            // } catch (e) {
            //     console.error(e)
            // }

            if (this.pin === this.reEnterPin) {
                // this.reEnterPin = 'Vishwas1@' // TODO remove this later
                this.setVaultPin(this.reEnterPin)
                this.$emit('proceedWithUnlockVaultAndSyncDataEvent', true)
            } else {
                alert('Pins did not match')
            }
        },
        getPin(data) {
            console.log('Pin ' + data)
            this.pin = data;
        },
        getRenterPin(data) {
            console.log('Re enter Pin ' + data)
            this.reEnterPin = data;


        }
    }
}


</script>

<style scoped></style>