import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useDashboardStats = () =>
  useQuery({
    queryKey: ["dashboard","stats"],
    queryFn: async () => {
      const { data } = await api.get(`/dashboard/stats`);
      return data.data as any;
    },
  });

export const useDashboardActivity = () =>
  useQuery({
    queryKey: ["dashboard","activity"],
    queryFn: async () => {
      const { data } = await api.get(`/dashboard/activity`);
      return data.data as any[];
    },
  });
