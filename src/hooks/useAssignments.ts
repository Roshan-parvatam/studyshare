import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type Assignment = {
  _id: string;
  title: string;
  description?: string;
  subject?: string;
  dueDate?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
};

export const useAssignments = (params: { status?: string; page?: number; limit?: number } = {}) =>
  useQuery({
    queryKey: ["assignments", params],
    queryFn: async () => {
      const { data } = await api.get(`/assignments`, { params });
      return data.data as { items: Assignment[]; total: number; page: number; pages: number };
    },
  });

export const useCreateAssignment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Assignment>) => {
      const { data } = await api.post(`/assignments`, payload);
      return data.data as Assignment;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["assignments"] });
    },
  });
};

export const useUpdateAssignment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, update }: { id: string; update: Partial<Assignment> }) => {
      const { data } = await api.put(`/assignments/${id}`, update);
      return data.data as Assignment;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["assignments"] });
    },
  });
};

export const useDeleteAssignment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/assignments/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["assignments"] });
    },
  });
};
