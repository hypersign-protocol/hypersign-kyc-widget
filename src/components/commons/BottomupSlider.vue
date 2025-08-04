<template>
  <div class="bootup-slider-container">
    <h2 class="main-title">{{ mainTitle }}</h2>

    <div v-for="(slide, i) in slides" :key="i" class="slide-section">
      <div class="slide-header">
        <i :class="slide.icon" class="info-icon mr-2"></i>
        <h3 class="slide-title">{{ slide.title }}</h3>
      </div>
      <p class="slide-description">{{ slide.description }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BottomupSlider',
  props: {
    slides: {
      type: Array,
      required: true,
      default: () => [],
    },
    mainTitle: {
      type: String,
      default: 'Information',
    },
  },
}
</script>

<style scoped>
.bootup-slider-container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  text-align: center;
}

.main-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 24px;
}

.slide-section {
  margin-bottom: 24px;
}

.slide-header {
  display: flex;
  align-items: center;
  /* justify-content: center; */
  text-align: left;
  gap: 10px;
}

.slide-title {
  font-size: 18px;
  margin: 0;
}

.slide-description {
  font-size: 14px;
  color: #555;
  margin-top: 8px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
}

.info-icon {
  font-size: 1.5rem;
  color: #007bff;
}
</style>
