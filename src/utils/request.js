import axios from 'axios'
import {
  Message,
  MessageBox
} from 'element-ui'
import store from '../store'
import {
  getToken
} from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  withCredentials: false,
  baseURL: "/", // api 的 base_url
  timeout: 100000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['authorization'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
     config.headers['userId'] = '410dbf7986084d1c95442be9500cf1e8'

    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    /**
     * status为非1是抛错 可结合自己业务进行修改
     */
    const res = response.data
    if (res.status !== 1) {
      Message({
        message: res.msg,
        type: 'error',
        showClose: true,
        duration: 5 * 1000
      })
      // 401认证失败
      if (res.status === 401) {
        store.dispatch('FedLogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      }
      return response.data
      // return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      showClose: true,
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
