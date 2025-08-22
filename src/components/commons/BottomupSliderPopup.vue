<template>
  <div v-if="internalShowSlider" class="popup-overlay" @click="closePopup">
    <div class="popup-container" @click.stop>
      <div class="popup-content">
        <BottomupSlider :mainTitle="'Understand Your Vault'" :slides="introSlides" />
        <div class="popup-actions">
          <button class="btn-primary" @click="closePopup">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BottomupSlider from './BottomupSlider.vue'

export default {
  name: 'BottomUpSliderPopup',
  components: {
    BottomupSlider,
  },
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    introSlides: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      internalShowSlider: this.modelValue,
    }
  },
  watch: {
    modelValue(val) {
      this.internalShowSlider = val
    },
    internalShowSlider(val) {
      this.$emit('update:modelValue', val)
    },
  },
  methods: {
    emitShowSlider(val) {
      this.$emit('update:modelValue', this.internalShowSlider)
    },
    closePopup() {
      this.internalShowSlider = false
    },
  },
}
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.popup-container {
  background-color: #ffffff;
  border-radius: 8px;
  max-width: 370px;
  width: 90%;
  max-height: 90%;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.popup-content {
  padding: 24px;
}

.popup-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e9ecef;
}

.btn-primary {
  padding: 8px 16px;
  background-color: #000000;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
}

.btn-primary:hover {
  background-color: #333333;
}

.btn-primary:active {
  transform: translateY(1px);
}

/* Mobile Responsive */
@media (max-width: 450px) {
  .popup-container {
    width: 95%;
    max-height: 95%;
  }

  .popup-content {
    padding: 16px;
  }

  .btn-primary {
    padding: 6px 12px;
    font-size: 13px;
    height: 32px;
  }
}
</style>
