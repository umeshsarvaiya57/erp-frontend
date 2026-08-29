import axiosClient from './axiosClient';

export const businessApi = {
  getBusiness: () => axiosClient.get('/business'),
  updateBusiness: (data) => axiosClient.put('/business', data),
  uploadLogo: (formData) => axiosClient.post('/business/logo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  
  // Super Admin Tenant Operations
  createBusiness: (data) => axiosClient.post('/admin/businesses', data),
  getAllBusinesses: (params) => axiosClient.get('/admin/businesses', { params }),
  updateBusinessStatus: (id, isActive) => axiosClient.put(`/admin/businesses/${id}/status`, { isActive }),
  getAdminDashboard: () => axiosClient.get('/admin/dashboard'),
  getAdminAuditLogs: (params) => axiosClient.get('/admin/audit-logs', { params })
};

export default businessApi;
