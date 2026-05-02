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
      removeToken();
      window.location.href = ROUTES.LOGIN;
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default axiosClient;