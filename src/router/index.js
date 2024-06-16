import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login'

Vue.use(VueRouter)

// 浏览器访问时会访问的vue页面。
const routes = [
  {
    path: '/login',
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
    redirect:'/welcome',
    //放在children中，实现左侧导航栏保留跳转。
    children:[
      { path: '/welcome', name: 'welcome', component: () => import("../views/Welcome.vue") }, // 首页
      { path: '/attrManage', name: 'attrManage', component: () => import("../views/AttrManage.vue") }, 
      { path: '/categoryManage', name: 'CategoryManage', component: () => import("../views/CategoryManage.vue") }, 
      { path: '/partManage', name: 'partManage', component: () => import("../views/PartManage.vue") }, 
      { path: '/BOMManage', name: 'BOMManage', component: () => import("../views/BOMManage.vue") }, 
      { path: '/inheritManage', name: 'inheritManage', component: () => import("../views/InheritManage.vue") }
    ]
  },
  
]

const router = new VueRouter({
  routes
})

export default router
