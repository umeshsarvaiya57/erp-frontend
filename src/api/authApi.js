import axiosClient from './axiosClient';

export const authApi = {
  login: (credentials) => axiosClient.post('/auth/login', credentials),
  logout: () => axiosClient.post('/auth/logout'),
  forgotPassword: (email) => axiosClient.post('/auth/forgot-password', { email }),
  resetPassword: (data) => axiosClient.post('/auth/reset-password', data),
  getMe: () => axiosClient.get('/auth/me'),
};

export default authApi;
