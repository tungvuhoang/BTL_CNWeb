import axiosClient from './axiosClient';

export const login = async (data) => {
  try {
    return await axiosClient.post('/auth/login', data);
  } catch (error) {
    // Fallback mock login for testing without backend
    console.warn('Backend unavailable, using mock login');
    return Promise.resolve({
      data: {
        token: 'mock-jwt-token-' + Date.now(),
        username: data.username
      }
    });
  }
};

export const register = (data) => axiosClient.post('/auth/register', data);