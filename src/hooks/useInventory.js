import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '../api/inventoryApi';
import { toast } from '../components/ui/toast/toastService';

export const useInventory = (filters = {}) => {
  const queryClient = useQueryClient();

  // History query log
  const historyQuery = useQuery({
    queryKey: ['inventory-history', filters],
    queryFn: () => inventoryApi.getInventoryHistory(filters),
  });

  // Adjust stock levels
  const adjustStockMutation = useMutation({
    mutationFn: inventoryApi.adjustStock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-history'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Stock level adjusted successfully.');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to adjust stock levels.');
    }
  });

  return {
    transactions: historyQuery.data?.data || [],
    pagination: historyQuery.data?.pagination || null,
    isLoading: historyQuery.isLoading,
    isError: historyQuery.isError,
    refetch: historyQuery.refetch,
    
    adjustStock: adjustStockMutation.mutate,
    isAdjusting: adjustStockMutation.isPending,
  };
};

export default useInventory;
