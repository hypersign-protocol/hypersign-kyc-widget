<template>
  <div class="row">
    <div class="col-2 center align-items-center">
      <v-avatar style="padding: 1rem; font-size: large; font-weight: bolder; width: 50px; height: 50px; border: 1px solid lightgrey">
        <img :src="logoUrl" alt="Avatar" class="avatar" />
      </v-avatar>
      <!-- <div class="border rounded-circle bg-light text-white center" style="padding: 1rem; font-size: large; font-weight: bolder; width: 60px; height: 60px">
        <img :src="logoUrl" alt="Avatar" class="avatar" />
      </div> -->
    </div>
    <div class="col-8" style="text-align: left">
      <span class="app-font" style="font-weight: bold; word-wrap: break-word">
        {{ stepTitle }}
      </span>
    </div>
    <div class="col-2">
      <span>
        <i class="bi bi-check2-circle" style="font-size: xx-large" v-if="isDone"></i>
      </span>
    </div>
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
  width: 30px;
  height: 30px;
  /* border-radius: 50%; */
}
</style>
