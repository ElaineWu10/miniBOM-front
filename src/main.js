import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store/index'
import axios from 'axios'

//引入ElementUI
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.$axios=axios
axios.defaults.baseURL= 'http://localhost:8080/feign'  

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
