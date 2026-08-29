import axiosClient from './axiosClient';

export const brandApi = {
  getBrands: (params) => axiosClient.get('/categories/brands', { params }),
  createBrand: (data) => axiosClient.post('/categories/brands', data),
  updateBrand: (id, data) => axiosClient.put(`/categories/brands/${id}`, data),
  deleteBrand: (id) => axiosClient.delete(`/categories/brands/${id}`),
};

export default brandApi;
