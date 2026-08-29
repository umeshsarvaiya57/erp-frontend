import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { customerApi } from '../api/customerApi';
import { toast } from '../components/ui/toast/toastService';

export const useCustomers = (filters = {}) => {
  const queryClient = useQueryClient();

  const customersQuery = useQuery({
    queryKey: ['customers', filters],
    queryFn: () => customerApi.getCustomers(filters),
  });

  const createMutation = useMutation({
    mutationFn: customerApi.createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer registered successfully.');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to register customer.');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => customerApi.updateCustomer(id, data),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customer', variables.id] });
      toast.success('Customer updated successfully.');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update customer.');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: customerApi.deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer deleted successfully.');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete customer.');
    }
  });

  return {
    customers: customersQuery.data?.data || [],
    pagination: customersQuery.data?.pagination || null,
    isLoading: customersQuery.isLoading,
    isError: customersQuery.isError,
    refetch: customersQuery.refetch,
    
    createCustomer: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateCustomer: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteCustomer: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
};

export const useCustomer = (id) => {
  const customerQuery = useQuery({
    queryKey: ['customer', id],
    queryFn: () => customerApi.getCustomerById(id),
    enabled: !!id,
    select: (res) => res.data,
  });

  return {
    customer: customerQuery.data,
    isLoading: customerQuery.isLoading,
    isError: customerQuery.isError,
  };
};
export default useCustomers;
