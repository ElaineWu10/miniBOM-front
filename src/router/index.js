import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login'

Vue.use(VueRouter)

// 浏览器访问时会访问的vue页面。
const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: "/home",
    name: 'Home',
    component: () => import("../views/Home.vue"),
    children:[
      { path: '/home', name: 'home', component: () => import("../views/Home.vue") }, // 首页
      { path: '/user', name: 'user', component: () => import("../views/Home.vue") }, // 用户管理
      { path: '/mall', name: 'mall', component: () => import("../views/Home.vue") }, // 商品管理
      { path: '/page1', name: 'page1', component: () => import("../views/Home.vue") }, // 页面1
      { path: '/page2', name: 'page2', component: () => import("../views/Home.vue") }, // 页面2
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
