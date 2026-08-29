import { useQuery } from '@tanstack/react-query';
import { reportApi } from '../api/reportApi';

export const useReports = () => {
  const financialQuery = useQuery({
    queryKey: ['reports-financial'],
    queryFn: () => reportApi.getFinancialReport(),
    select: (res) => res.data,
  });

  return {
    financialReport: financialQuery.data,
    isLoading: financialQuery.isLoading,
    isError: financialQuery.isError,
    refetch: financialQuery.refetch,
  };
};

export default useReports;
