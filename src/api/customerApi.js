import axiosClient from './axiosClient';

export const customerApi = {
  getCustomers: (params) => axiosClient.get('/customers', { params }),
  getCustomerById: (id) => axiosClient.get(`/customers/${id}`),
  createCustomer: (data) => axiosClient.post('/customers', data),
  updateCustomer: (id, data) => axiosClient.put(`/customers/${id}`, data),
  deleteCustomer: (id) => axiosClient.delete(`/customers/${id}`),
};

export default customerApi;
