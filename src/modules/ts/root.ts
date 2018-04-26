import Vue from 'vue'
import App from './vue-component/app.vue'

const root = new Vue({
  el: '#app',
  render: h => h(App)
})
