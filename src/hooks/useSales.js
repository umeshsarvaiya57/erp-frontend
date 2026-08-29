import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { salesApi } from '../api/salesApi';
import { toast } from '../components/ui/toast/toastService';

export const useSales = (filters = {}) => {
  const queryClient = useQueryClient();

  const salesQuery = useQuery({
    queryKey: ['sales', filters],
    queryFn: () => salesApi.getSales(filters),
  });

  const createSaleMutation = useMutation({
    mutationFn: salesApi.createSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['reports-financial'] });
      toast.success('Sale invoice created successfully.');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to create sale invoice.');
    }
  });

  const cancelSaleMutation = useMutation({
    mutationFn: salesApi.cancelSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['reports-financial'] });
      toast.success('Invoice cancelled and stock restored successfully.');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to cancel invoice.');
    }
  });

  return {
    sales: salesQuery.data?.data || [],
    pagination: salesQuery.data?.pagination || null,
    isLoading: salesQuery.isLoading,
    isError: salesQuery.isError,
    refetch: salesQuery.refetch,
    
    createSale: createSaleMutation.mutate,
    isCreating: createSaleMutation.isPending,
    cancelSale: cancelSaleMutation.mutate,
    isCancelling: cancelSaleMutation.isPending,
  };
};

export const useSale = (id) => {
  const saleQuery = useQuery({
    queryKey: ['sale', id],
    queryFn: () => salesApi.getSaleById(id),
    enabled: !!id,
    select: (res) => res.data,
  });

  return {
    sale: saleQuery.data,
    isLoading: saleQuery.isLoading,
    isError: saleQuery.isError,
  };
};
export default useSales;
