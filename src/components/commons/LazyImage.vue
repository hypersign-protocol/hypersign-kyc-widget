<template>
  <div class="lazy-image-container" :class="{ loaded: isLoaded }">
    <img v-if="isLoaded" :src="src" :alt="alt" :class="imageClass" @load="onImageLoad" @error="onImageError" />
    <div v-else class="image-placeholder" :class="placeholderClass">
      <div class="loading-spinner"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LazyImage',
  props: {
    src: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      default: '',
    },
    imageClass: {
      type: String,
      default: '',
    },
    placeholderClass: {
      type: String,
      default: '',
    },
    threshold: {
      type: Number,
      default: 0.1,
    },
  },
  data() {
    return {
      isLoaded: false,
      observer: null,
    }
  },
  mounted() {
    this.setupIntersectionObserver()
  },
  beforeDestroy() {
    if (this.observer) {
      this.observer.disconnect()
    }
  },
  methods: {
    setupIntersectionObserver() {
      if ('IntersectionObserver' in window) {
        this.observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                this.loadImage()
                this.observer.unobserve(entry.target)
              }
            })
          },
          {
            threshold: this.threshold,
            rootMargin: '50px',
          }
        )
        this.observer.observe(this.$el)
      } else {
        // Fallback for older browsers
        this.loadImage()
      }
    },
    loadImage() {
      const img = new Image()
      img.onload = () => {
        this.isLoaded = true
      }
      img.onerror = () => {
        this.onImageError()
      }
      img.src = this.src
    },
    onImageLoad() {
      this.$emit('load')
    },
    onImageError() {
      this.$emit('error')
    },
  },
}
</script>

<style scoped>
.lazy-image-container {
  position: relative;
  overflow: hidden;
}

.image-placeholder {
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100px;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #e0e0e0;
  border-top: 2px solid #000000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

img {
  width: 100%;
  height: auto;
  transition: opacity 0.3s ease;
}

.lazy-image-container:not(.loaded) img {
  opacity: 0;
}

.lazy-image-container.loaded img {
  opacity: 1;
}
</style>
