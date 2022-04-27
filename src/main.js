import Vue from 'vue'

import App from './App'

import NavBar from './component/NavBar.vue'

Vue.component('NavBar', NavBar)

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App
})

app.$mount()
