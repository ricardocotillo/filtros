import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Gestor from './views/Gestor.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/gestor',
      name: 'about',
      component: Gestor
    }
  ]
})
