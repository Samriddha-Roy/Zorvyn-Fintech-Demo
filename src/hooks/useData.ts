import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Transaction, Summary, MonthlyBreakdown, User } from '@/types';

export interface PaginatedTransactions {
  data: Transaction[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Fetch Summary
export const useSummary = () => {
  return useQuery<Summary>({
    queryKey: ['summary'],
    queryFn: async () => {
      const { data } = await api.get('/users/me/summary');
      return data;
    },
    staleTime: 60 * 1000,
  });
};

// Fetch Transactions
export const useTransactions = (params?: { category?: string; type?: string; page?: number; limit?: number; search?: string; startDate?: string; endDate?: string }) => {
  return useQuery<PaginatedTransactions>({
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

// Admin: Fetch all users
export const useUsers = () => {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await api.get('/users');
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

// --- [NEW] Update Transaction Hook ---
export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...dto }: Partial<Transaction> & { id: string }) => {
      const { data } = await api.put(`/transactions/${id}`, dto);
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
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      await api.patch(`/users/${id}/role`, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
