import axios from 'axios';
import { getToken, removeToken } from '../utils/token';
import { ROUTES } from '../utils/constants';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('API returned 401 Unauthorized:', error.config?.url);
      // Tạm thời tắt auto-redirect để bạn có thể test UI và WebSocket
      // removeToken();
      // if (error.config && !error.config.url.includes('/auth/login')) {
      //   window.location.href = ROUTES.LOGIN;
      // }
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default axiosClient;