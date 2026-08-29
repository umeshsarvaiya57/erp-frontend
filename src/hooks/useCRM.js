import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { crmApi } from '../api/crmApi';
import { toast } from '../components/ui/toast/toastService';

export const useCRM = (filters = {}) => {
  const queryClient = useQueryClient();

  const leadsQuery = useQuery({
    queryKey: ['leads', filters],
    queryFn: () => crmApi.getLeads(filters),
  });

  const timelineQuery = useQuery({
    queryKey: ['crm-timeline', filters],
    queryFn: () => crmApi.getTimeline(filters),
  });

  const createLeadMutation = useMutation({
    mutationFn: crmApi.createLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['crm-timeline'] });
      toast.success('Lead registered successfully.');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to create lead.');
    }
  });

  const updateLeadMutation = useMutation({
    mutationFn: ({ id, data }) => crmApi.updateLead(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['crm-timeline'] });
      toast.success('Lead updated successfully.');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update lead.');
    }
  });

  const createFollowUpMutation = useMutation({
    mutationFn: crmApi.createFollowUp,
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['followups', variables.leadId] });
      queryClient.invalidateQueries({ queryKey: ['crm-timeline'] });
      toast.success('Follow-up scheduled successfully.');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to schedule follow-up.');
    }
  });

  return {
    leads: leadsQuery.data?.data || [],
    pagination: leadsQuery.data?.pagination || null,
    isLoadingLeads: leadsQuery.isLoading,
    
    timeline: timelineQuery.data?.data || [],
    timelinePagination: timelineQuery.data?.pagination || null,
    isLoadingTimeline: timelineQuery.isLoading,
    
    createLead: createLeadMutation.mutate,
    isCreatingLead: createLeadMutation.isPending,
    
    updateLead: updateLeadMutation.mutate,
    isUpdatingLead: updateLeadMutation.isPending,
    
    createFollowUp: createFollowUpMutation.mutate,
    isCreatingFollowUp: createFollowUpMutation.isPending,
  };
};

export const useFollowUps = (leadId) => {
  const followupsQuery = useQuery({
    queryKey: ['followups', leadId],
    queryFn: () => crmApi.getFollowUps(leadId),
    enabled: !!leadId,
    select: (res) => res.data,
  });

  return {
    followups: followupsQuery.data || [],
    isLoading: followupsQuery.isLoading,
  };
};
export default useCRM;
