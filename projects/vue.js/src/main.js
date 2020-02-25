import Vue from 'vue'
import App from './App.vue'

import { defineCustomElements } from 'stencil-firebase-db/dist/loader'

Vue.config.productionTip = false

Vue.config.ignoredElements = [/fbs-\w*/]

defineCustomElements(window)

new Vue({
  render: h => h(App)
}).$mount('#app')
