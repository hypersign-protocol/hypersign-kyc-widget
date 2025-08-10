<template>
  <div class="pin-container">
    <div class="pin-inputs">
      <input v-for="(digit, index) in 5" :key="index" :ref="`input${index}`" v-model="pinDigits[index]" type="password" maxlength="1" class="pin-input" :class="{ active: activeIndex === index }" @input="handleInput($event, index)" @keydown="handleKeydown($event, index)" @focus="activeIndex = index" @blur="activeIndex = null" inputmode="numeric" pattern="[0-9]*" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'PIN',
  props: {
    inputType: {
      type: String,
      default: 'text',
    },
  },
  data() {
    return {
      pinDigits: ['', '', '', '', ''],
      activeIndex: null,
    }
  },
  methods: {
    handleInput(event, index) {
      const value = event.target.value

      // Only allow numbers
      if (!/^\d*$/.test(value)) {
        event.target.value = ''
        return
      }

      // Update the digit
      this.pinDigits[index] = value

      // Move to next input if value entered
      if (value && index < 4) {
        this.$nextTick(() => {
          this.$refs[`input${index + 1}`][0].focus()
        })
      }

      // Check if all digits are filled
      this.checkComplete()
    },

    handleKeydown(event, index) {
      // Handle backspace
      if (event.key === 'Backspace') {
        if (this.pinDigits[index] === '' && index > 0) {
          // Move to previous input if current is empty
          this.$nextTick(() => {
            this.$refs[`input${index - 1}`][0].focus()
          })
        } else {
          // Clear current input
          this.pinDigits[index] = ''
        }
      }
    },

    checkComplete() {
      const pin = this.pinDigits.join('')
      if (pin.length === 5) {
        this.$emit('pinTakenEvent', pin)
      }
    },

    // Method to clear all inputs
    clear() {
      this.pinDigits = ['', '', '', '', '']
      this.activeIndex = null
      this.$nextTick(() => {
        this.$refs.input0[0].focus()
      })
    },

    // Method to set a specific PIN
    setPin(pin) {
      if (pin && pin.length === 5) {
        this.pinDigits = pin.split('')
      }
    },
  },
}
</script>

<style scoped>
.pin-inputs {
  display: flex;
  gap: 8px;
  justify-content: center;
  width: 100%;
  max-width: 400px;
}

.pin-input {
  width: 60px;
  height: 60px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  text-align: center;
  font-size: 24px;
  font-weight: 500;
  background-color: #ffffff;
  color: #333333;
  transition: all 0.2s ease;
  outline: none;
  padding: 0;
  margin: 0;
}

.pin-input:focus {
  border-color: #000000;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
}

.pin-input:hover {
  border-color: #666666;
}

.pin-input.active {
  border-color: #000000;
  background-color: #f8f9fa;
}

/* Mobile responsive */
@media (max-width: 375px) {
  .pin-input {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }

  .pin-inputs {
    gap: 6px;
  }
}

@media (min-width: 376px) {
  .pin-input {
    width: 60px;
    height: 60px;
    font-size: 24px;
  }

  .pin-inputs {
    gap: 8px;
  }
}
</style>
