import Vue from 'vue'
import App from './App.vue'
// import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons'
import 'bootstrap-icons/font/bootstrap-icons.css'

import store from './store/store.js'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import './style/global.css'
import MessageBox from './components/commons/MessageBox.vue'
import NavBar from './components/commons/NavBar.vue'
import PageHeading from './components/commons/PageHeading.vue'
import PoweredBy from './components/commons/PoweredBy.vue'
import ConsentBox from './components/commons/ConsentBox.vue'
import InfoMessage from './components/commons/InfoMessage.vue'
import router from './router'
import { BootstrapVue } from 'bootstrap-vue'
Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.component('load-ing', Loading)
Vue.component('MessageBox', MessageBox)
Vue.component('NavBar', NavBar)
Vue.component('PageHeading', PageHeading)
Vue.component('PoweredBy', PoweredBy)
Vue.component('ConsentBox', ConsentBox)
Vue.component('InfoMessage', InfoMessage)

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
