<template>
    <span>
        {{ getActiveStep.name }} ({{ getActiveStep.id }} / {{ steps.length - 2 }})
    </span>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
    computed: {
        ...mapState(["steps",]),
        ...mapGetters(["getActiveStep"])
    }
}
</script>