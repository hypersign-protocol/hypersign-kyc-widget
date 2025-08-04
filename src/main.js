import Vue from 'vue'
import App from './App.vue'
// import 'bootstrap'
// import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons'
import 'bootstrap-icons/font/bootstrap-icons.css'

import store from './store/store.js'
// import Loading from 'vue-loading-overlay'
// import 'vue-loading-overlay/dist/vue-loading.css'
import './style/global.css'
import MessageBox from './components/commons/MessageBox.vue'
import NavBar from './components/commons/NavBar.vue'
import PageHeading from './components/commons/PageHeading.vue'
import PoweredBy from './components/commons/PoweredBy.vue'
import ConsentBox from './components/commons/ConsentBox.vue'
import InfoMessage from './components/commons/InfoMessage.vue'
import StepNavigator from './components/commons/StepNavigator.vue'
import LoadIng from './components/commons/LoadIng.vue'
import FailureScreen from './components/commons/FailureScreen.vue'
import router from './router'
// import { BootstrapVue } from 'bootstrap-vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
Vue.config.productionTip = false
// Vue.use(BootstrapVue)
Vue.component('load-ing', LoadIng)
Vue.component('MessageBox', MessageBox)
Vue.component('NavBar', NavBar)
Vue.component('PageHeading', PageHeading)
Vue.component('PoweredBy', PoweredBy)
Vue.component('ConsentBox', ConsentBox)
Vue.component('InfoMessage', InfoMessage)
Vue.component('StepNavigator', StepNavigator)
Vue.component('FailureScreen', FailureScreen)
Vue.use(Vuetify)
new Vue({
  router,
  store,
  render: (h) => h(App),
  vuetify: new Vuetify({
    theme: {
      themes: {
        light: {
          colors: {
            primary: '#000000', // Black primary color
            secondary: '#FFFFFF', // White secondary color
            accent: '#666666', // Grey accent color
            background: '#FFFFFF', // Clean white background
            surface: '#FFFFFF', // White surface color
            error: '#D32F2F', // Error color
            info: '#1976D2', // Info color
            success: '#388E3C', // Success color
            warning: '#F57C00', // Warning color
            grey: {
              lighten1: '#F5F5F5',
              lighten2: '#EEEEEE',
              darken1: '#757575',
              darken2: '#424242',
            },
          },
        },
      },
    },
  }),
}).$mount('#app')
