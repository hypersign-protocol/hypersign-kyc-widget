<template>
  <div class="instruction-step d-flex align-items-center">
    <!-- Avatar/Icon -->
    <div class="icon-wrapper">
      <v-avatar size="50" class="avatar-border">
        <img :src="logoUrl" alt="Step Icon" class="avatar-img" />
      </v-avatar>
    </div>

    <!-- Instruction Text -->
    <div class="flex-grow-1 text-left step-text pl-3 pr-2">
      {{ stepTitle }}
    </div>

    <!-- Square checkbox-style icon -->
    <div class="status-icon ml-1">
      <i v-if="isDone" class="bi bi-check-square-fill text-success" :style="iconStyle"></i>
      <i v-else class="bi bi-square text-muted" :style="iconStyle"></i>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    stepTitle: {
      type: String,
      default: 'Conduct a liveliness check to prove you are a human',
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
    iconStyle() {
      return {
        fontSize: '1.2rem',
      }
    },
  },
}
</script>

<style scoped>
.instruction-step {
  display: flex;
  align-items: center;
  margin-bottom: 8px; /* Reduced spacing between steps */
  padding: 6px 8px;
  border-radius: 8px;
  background-color: #fdfdfd;
}

.avatar-border {
  border: 1px solid #e0e0e0;
  background-color: #fff;
  padding: 2px;
}

.avatar-img {
  width: 90%;
  height: 90%;
  object-fit: contain;
}

.step-text {
  font-size: 14px;
  line-height: 1.2;
}

@media (min-width: 600px) {
  .step-text {
    font-size: 18px;
  }
}

@media (min-width: 960px) {
  .step-text {
    font-size: 20px;
  }
}

.status-icon i {
  transition: all 0.2s ease-in-out;
}
</style>
