import axiosClient from './axiosClient';

export const reportApi = {
  getFinancialReport: () => axiosClient.get('/reports/financial'),
};

export default reportApi;
