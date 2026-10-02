import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboardApi';

export const useDashboard = () => {
  const dashboardQuery = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardApi.getStats(),
    select: (res) => res.data,
    refetchInterval: 30000, // Background real-time update every 30s
    staleTime: 5000,
    refetchOnWindowFocus: true,
  });

  return {
    stats: dashboardQuery.data,
    isLoading: dashboardQuery.isLoading,
    isFetching: dashboardQuery.isFetching,
    isError: dashboardQuery.isError,
    error: dashboardQuery.error,
    refetch: dashboardQuery.refetch,
    dataUpdatedAt: dashboardQuery.dataUpdatedAt,
  };
};

export default useDashboard;
