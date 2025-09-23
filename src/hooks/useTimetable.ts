import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type TimetableEntry = {
  _id: string;
  subject: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  startTime: string;
  endTime: string;
  location?: string;
  color?: string;
};

export const useTimetableEntries = () =>
  useQuery({
    queryKey: ["timetable"],
    queryFn: async () => {
      const { data } = await api.get(`/timetable`);
      return data.data as TimetableEntry[];
    },
  });

export const useCreateTimetableEntry = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<TimetableEntry, "_id">) => {
      const { data } = await api.post(`/timetable`, payload);
      return data.data as TimetableEntry;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["timetable"] });
    },
  });
};

export const useUpdateTimetableEntry = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, update }: { id: string; update: Partial<TimetableEntry> }) => {
      const { data } = await api.put(`/timetable/${id}`, update);
      return data.data as TimetableEntry;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["timetable"] });
    },
  });
};

export const useDeleteTimetableEntry = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/timetable/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["timetable"] });
    },
  });
};
