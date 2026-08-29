import axiosClient from './axiosClient';

export const supplierApi = {
  getSuppliers: (params) => axiosClient.get('/suppliers', { params }),
  getSupplierById: (id) => axiosClient.get(`/suppliers/${id}`),
  createSupplier: (data) => axiosClient.post('/suppliers', data),
  updateSupplier: (id, data) => axiosClient.put(`/suppliers/${id}`, data),
  deleteSupplier: (id) => axiosClient.delete(`/suppliers/${id}`),
};

export default supplierApi;
