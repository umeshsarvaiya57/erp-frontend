import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { useAuth as useAuthContext } from '../context/AuthContext';
import { toast } from '../components/ui/toast/toastService';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const authContext = useAuthContext();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      const { token, user } = response.data;
      authContext.login(user, token);
      toast.success('Welcome back! Login successful.');
    },
    onError: (err) => {
      toast.error(err.message || 'Login failed. Verify your credentials.');
    }
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      authContext.logout();
      queryClient.clear();
      toast.success('Logged out successfully.');
    },
    onError: () => {
      // Force user context clear on mutation error
      authContext.logout();
      queryClient.clear();
    }
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => {
      toast.success('Reset link generated. Check console logs for connection endpoint.');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to submit forgot password request.');
    }
  });

  const resetPasswordMutation = useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      toast.success('Password updated successfully. Please log in.');
    },
    onError: (err) => {
      toast.error(err.message || 'Password reset failed.');
    }
  });

  return {
    ...authContext,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
    forgotPassword: forgotPasswordMutation.mutate,
    isSendingReset: forgotPasswordMutation.isPending,
    resetPassword: resetPasswordMutation.mutate,
    isResetting: resetPasswordMutation.isPending,
  };
};

export default useAuth;
