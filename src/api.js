import axios from 'axios'

const service = axios.create({
    baseURL: '/api',
    timeout: 10000
})

//response拦截器
service.interceptors.response.use(
    response => {
        const res = response.data;  //这句比较重要哈，接收了返回值之后只取其中的数据部分
        if (res.code == '100') {
            return res.info;
        }
    }
)
export default service