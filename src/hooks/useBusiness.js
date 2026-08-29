import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { businessApi } from '../api/businessApi';
import { authApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/ui/toast/toastService';

export const useBusiness = () => {
  const queryClient = useQueryClient();
  const { login: updateAuthUser } = useAuth();

  // Fetch business query
  const businessQuery = useQuery({
    queryKey: ['business'],
    queryFn: () => businessApi.getBusiness(),
    select: (res) => res.data,
  });

  // Update business profile
  const updateMutation = useMutation({
    mutationFn: businessApi.updateBusiness,
    onSuccess: async (res) => {
      // Refresh authenticated session context to update completed profile flags
      try {
        const userRes = await authApi.getMe();
        const token = localStorage.getItem('token');
        updateAuthUser(userRes.data, token);
      } catch (err) {
        console.error('Failed to sync profile setup:', err.message);
      }

      queryClient.invalidateQueries({ queryKey: ['business'] });
      toast.success('Business settings updated successfully.');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update business profile.');
    }
  });

  // Logo upload
  const uploadLogoMutation = useMutation({
    mutationFn: businessApi.uploadLogo,
    onSuccess: async () => {
      try {
        const userRes = await authApi.getMe();
        const token = localStorage.getItem('token');
        updateAuthUser(userRes.data, token);
      } catch (err) {
        console.error('Failed to sync profile logo:', err.message);
      }

      queryClient.invalidateQueries({ queryKey: ['business'] });
      toast.success('Business logo uploaded successfully.');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to upload business logo.');
    }
  });

  return {
    business: businessQuery.data,
    isLoading: businessQuery.isLoading,
    isError: businessQuery.isError,
    refetch: businessQuery.refetch,
    updateBusiness: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    uploadLogo: uploadLogoMutation.mutate,
    isUploadingLogo: uploadLogoMutation.isPending,
  };
};

export default useBusiness;
