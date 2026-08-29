import axiosClient from './axiosClient';

export const employeeApi = {
  getEmployees: () => axiosClient.get('/employees'),
  createEmployee: (data) => axiosClient.post('/employees', data),
  updateEmployee: (id, data) => axiosClient.put(`/employees/${id}`, data),
};

export default employeeApi;
