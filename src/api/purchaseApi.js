import axiosClient from './axiosClient';

export const purchaseApi = {
  getPurchases: (params) => axiosClient.get('/purchases', { params }),
  getPurchaseById: (id) => axiosClient.get(`/purchases/${id}`),
  createPurchase: (data) => axiosClient.post('/purchases', data),
};

export default purchaseApi;
