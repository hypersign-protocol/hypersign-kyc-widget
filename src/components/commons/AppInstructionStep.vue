<template>
    <div class="row">
        <div class="col-2 center  align-items-center">
            <div class="border rounded-circle bg-secondary text-white"
                style="padding: 1rem; font-size: large; font-weight: bolder;width: 60px; height: 60px;">
                {{ stepNumber }}
            </div>

        </div>
        <div class="col-8" style="text-align: left;">
            <span style="font-size: larger;font-weight: bold;word-wrap: break-word;">
                {{ stepTitle }}
            </span>
        </div>
        <div class="col-2">
            <span>
                <i class="bi bi-check2-circle" style="font-size:xx-large" v-if="isDone"></i>
            </span>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        stepNumber: {
            type: Number,
            default: 0
        },
        stepTitle: {
            type: String,
            default: 'Conduct a liveliess check to prove you are a human'
        },
        isDone: {
            type: Boolean,
            default: false
        }
    }
}


</script>