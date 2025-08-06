<template>
  <v-overlay v-model="localActive" :value="localActive" :absolute="!isFullPage" :opacity="0.8" :z-index="zIndex" :class="{ 'full-screen': isFullPage }" @click="handleCancel">
    <v-card class="loading-card d-flex flex-column align-center justify-center pa-4" elevation="8" color="white">
      <v-progress-circular :size="48" :width="4" color="#000000" indeterminate></v-progress-circular>
      <div class="mt-4 text-subtitle-1 loading-text">Please wait...</div>
    </v-card>
  </v-overlay>
</template>

<script>
export default {
  name: 'LoadIng',
  props: {
    active: {
      type: Boolean,
      required: true,
    },
    canCancel: {
      type: Boolean,
      default: false,
    },
    isFullPage: {
      type: Boolean,
      default: true,
    },
    zIndex: {
      type: Number,
      default: 9999,
    },
  },
  computed: {
    localActive: {
      get() {
        return this.active
      },
      set(val) {
        this.$emit('update:active', val)
      },
    },
  },
  methods: {
    handleCancel() {
      if (this.canCancel) {
        this.localActive = false
      }
    },
  },
}
</script>

<style scoped>
.full-screen {
  position: fixed !important;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.loading-card {
  border-radius: 16px;
  min-width: 140px;
  max-width: 280px;
  width: 90%;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 24px;
}

.loading-text {
  color: #333333;
  font-weight: 500;
  text-align: center;
}

/* Mobile-first responsive design */
@media (max-width: 450px) {
  .loading-card {
    min-width: 140px;
    max-width: 280px;
    width: 90%;
    padding: 20px;
    margin: 16px;
  }

  .loading-text {
    font-size: 14px;
  }
}

@media (min-width: 451px) {
  .loading-card {
    min-width: 160px;
    max-width: 320px;
    width: 80%;
  }
}
</style>
