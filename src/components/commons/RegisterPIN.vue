<template>
    <div class="center" style="width: 100%;">
        <div class="widget-card">
            <p style="text-align: left;">
                Enter 5 digits PIN:
                <PIN @pinTakenEvent="getPin" />
            </p>
            <p style="text-align: left;">
                Confirm PIN:
                <PIN @pinTakenEvent="getRenterPin" inputType="password" />
            </p>
            <p>
                <InfoMessage
                    message="This PIN safeguards your personal data vault. It's your exclusive key to access and control your vault's contents, ensuring only you have entry. Remember, losing this PIN means losing access to your data" />
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
            if (this.pin === this.reEnterPin) {
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