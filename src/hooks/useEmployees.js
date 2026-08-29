import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { employeeApi } from '../api/employeeApi';
import { toast } from '../components/ui/toast/toastService';

export const useEmployees = () => {
  const queryClient = useQueryClient();

  const employeesQuery = useQuery({
    queryKey: ['employees'],
    queryFn: () => employeeApi.getEmployees(),
    select: (res) => res.data,
  });

  const createMutation = useMutation({
    mutationFn: employeeApi.createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employee registered successfully.');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to register employee.');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => employeeApi.updateEmployee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employee settings updated successfully.');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update employee.');
    }
  });

  return {
    employees: employeesQuery.data || [],
    isLoading: employeesQuery.isLoading,
    isError: employeesQuery.isError,
    
    createEmployee: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateEmployee: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
};

export default useEmployees;
