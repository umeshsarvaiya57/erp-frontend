import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboardApi';

export const useDashboard = () => {
  const dashboardQuery = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardApi.getStats(),
    select: (res) => res.data,
  });

  return {
    stats: dashboardQuery.data,
    isLoading: dashboardQuery.isLoading,
    isError: dashboardQuery.isError,
    refetch: dashboardQuery.refetch,
  };
};

export default useDashboard;
