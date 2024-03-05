<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
// import MainPage from "./components/MainPage.vue";
import { encrypt, decrypt } from './components/utils/symmetricCrypto';
export default {
  name: "App",
  components: {
    // MainPage,
  },
  methods: {
  },
  async created() {
    const message = JSON.stringify({
      hello: "world",
    })

    const pin = "Vishwas1@gmail"
    const encryptedMessage = await encrypt(message, pin)
    const decryptMessage = await decrypt(encryptedMessage, pin)
    console.log({
      encryptedMessage,
      decryptMessage
    })
  },

};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
}
</style>
