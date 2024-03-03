<template>
    <div class="card-body" style="max-height:750px;">
        <PageHeading :header="'Vault Setup'" :subHeader="'Setup a PIN to secure your vault'" />
        <div class="center">
            <div class="widget-card">
                <p style="text-align: left;">
                    Enter 5 digit PIN:
                    <PIN />
                </p>
                <p style="text-align: left;">
                    Confirm PIN:
                    <PIN inputType="password" />
                </p>
                <p>
                    <InfoMessage
                        message="This PIN is to secure your data vault. The ensures that you do not trust any one with your data, not event us. The PIN is used to access your encrypted data vault. Make sure you do not loose it." />
                </p>
                <p>
                    <button class="btn btn-outline-dark" @click="submit()">
                        Save
                    </button>
                </p>
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
    methods: {
        ...mapMutations(['nextStep']),
        submit() {
            this.nextStep()
        }
    }
}


</script>

<style scoped></style>