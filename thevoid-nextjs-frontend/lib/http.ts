import axios, { AxiosResponse } from 'axios';
import { Result } from '@/types/result'

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response: AxiosResponse<Result>) => {
    const res = response.data;
    // 如果业务状态码不是 200，可以在这里直接弹窗提醒
    if (res.code !== 200) {
      console.error(`[API Error]: ${res.message}`);
    }
    return response;
  },
  (error) => {
    // 处理 401 登录过期、500 服务器错误等
    return Promise.reject(error);
  }
);

export default http;