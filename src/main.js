import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI, {Message} from 'element-ui'
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

axios.interceptors.request.use(config => {
  config.headers['token'] = localStorage.getItem('token')
  return config
}, error => {
  return Promise.reject(error)
}),
axios.interceptors.response.use(
    response => {
        // 正常响应处理
        console.log(response);
        const res = response;
        console.log(res.data.state);
        // 根据业务逻辑，这里假设res.data.state为false时token失效
        if (res.data.state === false) {
            // 这里使用Vue Router的push方法跳转到登录页面
            // 确保在跳转前清空localStorage中的token或其他相关状态
            localStorage.removeItem('token');
            router.push('/login');
            location.reload();
        }
        return res;
    },
    error => {
        // 异常响应处理
        console.log('err' + error); // 调试用
        const { response } = error;
        if (response) {
            // 这里根据实际的业务逻辑判断token是否失效
            // 假设后端返回的状态码或数据结构表明token失效
            if (response.status === 401 || response.data && response.data.state === 'token expired') {
                // 清空localStorage中的token
                localStorage.removeItem('token');
                // 跳转到登录页面
                router.push('/login');
            }
            // 显示错误消息，这里假设ElementUI的Message组件已经全局可用
            Message({
                message: response.data.message || 'Error',
                type: 'error',
                duration: 5 * 1000
            });
        } else {
            // 网络错误或其他未捕获的错误
            Message({
                message: error.message,
                type: 'error',
                duration: 5 * 1000
            });
        }
        return Promise.reject(error);
    }
);