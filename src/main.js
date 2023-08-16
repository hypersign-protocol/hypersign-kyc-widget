import Vue from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap-icons/font/bootstrap-icons';
import 'bootstrap-icons/font/bootstrap-icons.css'
import store from './store/store.js'
import Loading from 'vue-loading-overlay'
import "vue-loading-overlay/dist/vue-loading.css";
Vue.config.productionTip = false

Vue.component('load-ing', Loading)
new Vue({
  store,
  render: h => h(App)
}).$mount('#app')

