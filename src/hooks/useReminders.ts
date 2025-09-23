import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type Reminder = {
  _id: string;
  title: string;
  description?: string;
  reminderDate: string;
  isCompleted: boolean;
};

export const useReminders = (page = 1, limit = 20) =>
  useQuery({
    queryKey: ["reminders", { page, limit }],
    queryFn: async () => {
      const { data } = await api.get(`/reminders`, { params: { page, limit } });
      return data.data as { items: Reminder[]; total: number; page: number; pages: number };
    },
  });

export const useCreateReminder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { title: string; description?: string; reminderDate: string }) => {
      const { data } = await api.post(`/reminders`, payload);
      return data.data as Reminder;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reminders"] });
    },
  });
};

export const useUpdateReminder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, update }: { id: string; update: Partial<Reminder> }) => {
      const { data } = await api.put(`/reminders/${id}`, update);
      return data.data as Reminder;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reminders"] });
    },
  });
};

export const useDeleteReminder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/reminders/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reminders"] });
    },
  });
};
