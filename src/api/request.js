import axios from 'axios'
import { useLoadingStore } from '../store/loading'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

//api 요청 시작할때 실행되는 코드
client.interceptors.request.use((config) => {
  useLoadingStore().startLoading()
  return config
  // const token = localStorage.getItem('token')
  // if (token) config.headers.Authorization = `Bearer ${token}`
  // return config
})

//api 응답이 왔을때 실행 되는 코드
client.interceptors.response.use(
  (res) => {
    useLoadingStore().endLoading()
    return res
  },
  (error) => {
    useLoadingStore().endLoading()
    return Promise.reject(error)
  },
)

export default client
