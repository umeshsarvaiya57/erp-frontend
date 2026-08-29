import axiosClient from './axiosClient';

export const salesApi = {
  getSales: (params) => axiosClient.get('/sales', { params }),
  getSaleById: (id) => axiosClient.get(`/sales/${id}`),
  createSale: (data) => axiosClient.post('/sales', data),
  cancelSale: (id) => axiosClient.post(`/sales/${id}/return`),
};

export default salesApi;
