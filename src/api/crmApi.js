import axiosClient from './axiosClient';

export const crmApi = {
  getLeads: (params) => axiosClient.get('/crm/leads', { params }),
  createLead: (data) => axiosClient.post('/crm/leads', data),
  updateLead: (id, data) => axiosClient.put(`/crm/leads/${id}`, data),
  getFollowUps: (leadId) => axiosClient.get(`/crm/leads/${leadId}/followups`),
  createFollowUp: (data) => axiosClient.post('/crm/followups', data),
  getTimeline: (params) => axiosClient.get('/crm/timeline', { params }),
};

export default crmApi;
