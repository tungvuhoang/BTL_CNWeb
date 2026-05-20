import { LOCAL_STORAGE_KEYS } from './constants';

export const getToken = () => localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
export const setToken = (token) => localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, token);
export const removeToken = () => localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
export const isAuthenticated = () => !!getToken();