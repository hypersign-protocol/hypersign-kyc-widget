<template>
  <div class="list-group-item d-flex justify-content-between align-items-center p-3">
    <div class="border rounded-circle bg-light text-white center" style="padding: 1rem; font-size: large; font-weight: bolder; width: 60px; height: 60px">
      <!-- {{ stepNumber }} -->
      <img :src="logoUrl" alt="Avatar" class="avatar" />
    </div>
    <span style="font-size: medium; font-weight: bold; text-align: left; padding: 5px">
      {{ stepTitle }}
    </span>
    <span>
      <i class="bi bi-check2-circle" style="font-size: xx-large" v-if="isDone"></i>
      <i class="bi bi-chevron-compact-right" v-else></i>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    stepNumber: {
      type: String,
      default: '0',
    },
    stepTitle: {
      type: String,
      default: 'Conduct a liveliess check to prove you are a human',
    },
    isDone: {
      type: Boolean,
      default: false,
    },
    logo: {
      type: String,
      default: 'consent.png',
    },
  },
  computed: {
    logoUrl() {
      return require('@/assets/' + this.logo)
    },
  },
}
</script>

<style scoped>
.avatar {
  /* vertical-align: middle; */
  width: 40px;
  height: 40px;
  /* border-radius: 50%; */
}
</style>
