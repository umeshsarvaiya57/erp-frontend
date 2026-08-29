import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { purchaseApi } from '../api/purchaseApi';
import { toast } from '../components/ui/toast/toastService';

export const usePurchases = (filters = {}) => {
  const queryClient = useQueryClient();

  const purchasesQuery = useQuery({
    queryKey: ['purchases', filters],
    queryFn: () => purchaseApi.getPurchases(filters),
  });

  const createPurchaseMutation = useMutation({
    mutationFn: purchaseApi.createPurchase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['reports-financial'] });
      toast.success('Purchase order created successfully.');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to create purchase order.');
    }
  });

  return {
    purchases: purchasesQuery.data?.data || [],
    pagination: purchasesQuery.data?.pagination || null,
    isLoading: purchasesQuery.isLoading,
    isError: purchasesQuery.isError,
    refetch: purchasesQuery.refetch,
    
    createPurchase: createPurchaseMutation.mutate,
    isCreating: createPurchaseMutation.isPending,
  };
};

export const usePurchase = (id) => {
  const purchaseQuery = useQuery({
    queryKey: ['purchase', id],
    queryFn: () => purchaseApi.getPurchaseById(id),
    enabled: !!id,
    select: (res) => res.data,
  });

  return {
    purchase: purchaseQuery.data,
    isLoading: purchaseQuery.isLoading,
    isError: purchaseQuery.isError,
  };
};
export default usePurchases;
