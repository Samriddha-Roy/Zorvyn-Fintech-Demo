import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Transaction, Summary, MonthlyBreakdown } from '@/types';

// Fetch Summary
export const useSummary = () => {
  return useQuery<Summary>({
    queryKey: ['summary'],
    queryFn: async () => {
      const { data } = await api.get('/users/me/summary');
      return data;
    },
    // Keep data fresh for 1 minute
    staleTime: 60 * 1000,
  });
};

// Fetch Transactions
export const useTransactions = (params?: { category?: string; type?: string }) => {
  return useQuery<Transaction[]>({
    queryKey: ['transactions', params],
    queryFn: async () => {
      const { data } = await api.get('/transactions', { params });
      return data;
    },
  });
};

// Fetch Monthly Breakdown
export const useAnalytics = () => {
  return useQuery<MonthlyBreakdown[]>({
    queryKey: ['analytics'],
    queryFn: async () => {
      const { data } = await api.get('/transactions/monthly-breakdown');
      return data;
    },
  });
};

// Mutations
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: any) => {
      const { data } = await api.post('/transactions', dto);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/transactions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
    },
  });
};
