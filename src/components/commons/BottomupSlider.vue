<template>
  <div class="slider-container">
    <h2 class="main-title">{{ mainTitle }}</h2>

    <div v-for="(slide, i) in slides" :key="i" class="slide-section">
      <div class="slide-header">
        <i :class="slide.icon" class="info-icon"></i>
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
.slider-container {
  max-width: 600px;
  margin: auto;
  padding: 0;
  text-align: center;
}

.main-title {
  font-size: 18px;
  font-weight: 600;
  color: #000000;
  margin: 0 0 24px 0;
  line-height: 1.3;
}

.slide-section {
  margin-bottom: 20px;
  text-align: left;
}

.slide-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.info-icon {
  font-size: 18px;
  color: #6c757d;
  flex-shrink: 0;
}

.slide-title {
  font-size: 14px;
  font-weight: 600;
  color: #333333;
  margin: 0;
  line-height: 1.3;
}

.slide-description {
  font-size: 13px;
  color: #666666;
  margin: 0 0 0 30px;
  line-height: 1.4;
}

/* Mobile Responsive */
@media (max-width: 450px) {
  .main-title {
    font-size: 16px;
  }

  .slide-title {
    font-size: 13px;
  }

  .slide-description {
    font-size: 12px;
  }

  .info-icon {
    font-size: 16px;
  }
}
</style>
