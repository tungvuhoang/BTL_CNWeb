import axiosClient from './axiosClient';

const authApi = {
  // Đăng ký theo @PostMapping("/register")
  register: (data) => {
    const url = '/auth/register';
    return axiosClient.post(url, data);
  },

  // Đăng nhập theo @PostMapping("/login")
  login: (data) => {
    const url = '/auth/login';
    return axiosClient.post(url, data);
  }
};

export default authApi;