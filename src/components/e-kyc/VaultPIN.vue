<template>
    <div class="card-body" style="max-height:750px;">
        <PageHeading :header="'Vault Setup'" :subHeader="'Setup a PIN to secure your vault'" />
        <div class="center" v-if="ifNewUser">

            <RegisterPIN />
        </div>

        <div class="center" v-else>
            <AskPIN />
        </div>

    </div>
</template>

<script type="text/javascript">
import AskPIN from '../commons/AskPIN.vue';
import RegisterPIN from '../commons/RegisterPIN.vue';
import { mapState } from 'vuex';
export default {
    name: "VaultPin",
    computed: {
        ...mapState(['ifNewUser']),
    },
    components: {
        AskPIN,
        RegisterPIN,
    },
}
</script>

<style scoped></style>