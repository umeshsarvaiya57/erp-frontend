import axiosClient from './axiosClient';

export const whatsappApi = {
  getStatus: () => axiosClient.get('/whatsapp/status'),
  initialize: () => axiosClient.post('/whatsapp/initialize'),
  logout: () => axiosClient.post('/whatsapp/logout'),
  toggleAutoSend: (enabled) => axiosClient.post('/whatsapp/auto-send', { enabled }),
  sendTestMessage: (data) => axiosClient.post('/whatsapp/test', data),
};

export default whatsappApi;
