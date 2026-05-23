import axiosClient from "./axiosClient";

export const register = (data) => {
  return axiosClient.post("/auth/register", data);
};

export const login = (data) => {
  return axiosClient.post("/auth/login", data);
};

export const authApi = {
  register,
  login,
};

export const changePassword = (data) => {
  return axiosClient.put('/auth/change-password', data);
};

export const getMyProfile = () => {
  return axiosClient.get('/auth/me');
};

export const updateMyProfile = (data) => {
  return axiosClient.put('/auth/me', data);
};

export const forgotPassword = (data) => {
  return axiosClient.post('/auth/forgot-password', data);
};

export const resetPassword = (data) => {
  return axiosClient.post('/auth/reset-password', data);
};

export default authApi;