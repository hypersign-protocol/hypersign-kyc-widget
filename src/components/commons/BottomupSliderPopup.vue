<template>
  <v-dialog v-model="internalShowSlider" max-width="600" @input="emitShowSlider">
    <v-card>
      <BottomupSlider :mainTitle="'Understand Your Vault'" :slides="introSlides" />
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red darken-1" text @click="internalShowSlider = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
  },
}
</script>
