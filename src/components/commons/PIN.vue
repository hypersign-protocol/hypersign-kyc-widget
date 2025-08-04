<template>
  <form class="row center">
    <div class="ma-auto position-relative" style="max-width: 500px">
      <!-- <OTPInput v-model="pin" :length="5" :type="inputType" :autofocus="true"></OTPInput> -->
      <v-otp-input :length="5" v-model="pin" @finish="done" :type="inputType" pattern="[0-9]*" inputmode="numeric" autofocus></v-otp-input>
    </div>
  </form>
</template>

<script>
export default {
  name: 'PIN',
  props: {
    inputType: {
      default: 'number',
      type: String,
    },
  },
  data() {
    return {
      pin: '',
    }
  },

  mounted() {
    // this.$refs.input1.focus()
  },

  methods: {
    done() {
      this.$emit('pinTakenEvent', this.pin)
    },
  },
}
</script>

<style scoped>
input {
  font-size: 20px;
  width: 50px;
  margin-right: 10px;
  text-align: center;
}

.info {
  font-size: 16px;
}

div {
  margin-top: 16px;
  font-size: 24px;
}
</style>
