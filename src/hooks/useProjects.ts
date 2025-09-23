import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type Project = {
  _id: string;
  name: string;
  description?: string;
  members: Array<{ _id: string; name?: string; email?: string } | string>;
  createdBy: string | { _id: string; name?: string };
  status: 'active' | 'completed' | 'archived';
  dueDate?: string;
};

export const useProjects = (status?: string) =>
  useQuery({
    queryKey: ["projects", { status }],
    queryFn: async () => {
      const { data } = await api.get(`/projects`, { params: { status } });
      return data.data as { items?: Project[] } | Project[];
    },
    select: (res) => (Array.isArray(res) ? res : (res as any).items ?? []),
  });

export const useCreateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { name: string; description?: string; members?: string[]; dueDate?: string }) => {
      const { data } = await api.post(`/projects`, payload);
      return data.data as Project;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["projects"] }),
  });
};

export const useUpdateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, update }: { id: string; update: Partial<Project> }) => {
      const { data } = await api.put(`/projects/${id}`, update);
      return data.data as Project;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["projects"] }),
  });
};

export const useDeleteProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/projects/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["projects"] }),
  });
};

export const useAddProjectMember = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, userId }: { id: string; userId: string }) => {
      const { data } = await api.post(`/projects/${id}/members`, { userId });
      return data.data as Project;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["projects"] }),
  });
};

export const useRemoveProjectMember = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, userId }: { id: string; userId: string }) => {
      const { data } = await api.delete(`/projects/${id}/members/${userId}`);
      return data.data as Project;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["projects"] }),
  });
};
