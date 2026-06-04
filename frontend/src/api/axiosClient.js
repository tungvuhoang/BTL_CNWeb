import axios from "axios";
import { getToken, removeToken } from "../utils/token";
import { ROUTES } from "../utils/constants";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
  timeout: 60000,
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const currentPath = window.location.pathname;

    if (status === 401) {
      removeToken();

      const isAuthPage =
        currentPath === ROUTES.LOGIN ||
        currentPath === ROUTES.REGISTER ||
        currentPath === "/forgot-password" ||
        currentPath.startsWith("/reset-password");

      if (!isAuthPage) {
        window.location.href = ROUTES.LOGIN;
      }
    }

    return Promise.reject(error.response?.data || error);
  }
);

export default axiosClient;