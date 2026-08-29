import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supplierApi } from '../api/supplierApi';
import { toast } from '../components/ui/toast/toastService';

export const useSuppliers = (filters = {}) => {
  const queryClient = useQueryClient();

  const suppliersQuery = useQuery({
    queryKey: ['suppliers', filters],
    queryFn: () => supplierApi.getSuppliers(filters),
  });

  const createMutation = useMutation({
    mutationFn: supplierApi.createSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast.success('Supplier registered successfully.');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to register supplier.');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => supplierApi.updateSupplier(id, data),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['supplier', variables.id] });
      toast.success('Supplier updated successfully.');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update supplier.');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: supplierApi.deleteSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast.success('Supplier deleted successfully.');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete supplier.');
    }
  });

  return {
    suppliers: suppliersQuery.data?.data || [],
    pagination: suppliersQuery.data?.pagination || null,
    isLoading: suppliersQuery.isLoading,
    isError: suppliersQuery.isError,
    refetch: suppliersQuery.refetch,
    
    createSupplier: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateSupplier: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteSupplier: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
};

export const useSupplier = (id) => {
  const supplierQuery = useQuery({
    queryKey: ['supplier', id],
    queryFn: () => supplierApi.getSupplierById(id),
    enabled: !!id,
    select: (res) => res.data,
  });

  return {
    supplier: supplierQuery.data,
    isLoading: supplierQuery.isLoading,
    isError: supplierQuery.isError,
  };
};
export default useSuppliers;
