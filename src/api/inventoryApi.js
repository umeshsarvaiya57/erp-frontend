import axiosClient from './axiosClient';

export const inventoryApi = {
  getInventoryHistory: (params) => axiosClient.get('/inventory/history', { params }),
  adjustStock: (data) => axiosClient.post('/inventory/adjust', data),
};

export default inventoryApi;
