import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type Note = {
  _id: string;
  title: string;
  content?: string;
  subject?: string;
  isPublic: boolean;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
};

export const useNotes = (page = 1, limit = 10) =>
  useQuery({
    queryKey: ["notes", { page, limit }],
    queryFn: async () => {
      const { data } = await api.get(`/notes`, { params: { page, limit } });
      return data.data as { items: Note[]; total: number; page: number; pages: number };
    },
  });

export const useSharedNotes = () =>
  useQuery({
    queryKey: ["notes","shared"],
    queryFn: async () => {
      const { data } = await api.get(`/notes/shared`);
      return data.data as Note[];
    },
  });

export const useCreateNote = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Note>) => {
      const { data } = await api.post(`/notes`, payload);
      return data.data as Note;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};

export const useUpdateNote = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, update }: { id: string; update: Partial<Note> }) => {
      const { data } = await api.put(`/notes/${id}`, update);
      return data.data as Note;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};

export const useDeleteNote = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/notes/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};
