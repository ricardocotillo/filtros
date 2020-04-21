import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueFirestore from 'vue-firestore'
import {BootstrapVue, IconsPlugin} from 'bootstrap-vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSearchPlus, faSearch, faFastForward, faFastBackward, faArrowLeft, faArrowRight, faSearchMinus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faSearchPlus, faSearch, faFastForward, faFastBackward, faArrowLeft, faArrowRight, faSearchMinus)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(VueFirestore)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
