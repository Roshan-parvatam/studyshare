import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

type RegisterInput = { name: string; email: string; university: string; password: string };
type LoginInput = { email: string; password: string };

type User = { _id: string; name: string; email: string; university: string };

export const useMe = () =>
  useQuery<{ user: User }, Error>({
    queryKey: ["me"],
    queryFn: async () => {
      const { data } = await api.get("/auth/me");
      return data.data as { user: User };
    },
    retry: false,
  });

export const useRegister = () => {
  const qc = useQueryClient();
  return useMutation<User, Error, RegisterInput>({
    mutationFn: async (payload: RegisterInput) => {
      const { data } = await api.post("/auth/register", payload);
      return data.data.user as User;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

export const useLogin = () => {
  const qc = useQueryClient();
  return useMutation<User, Error, LoginInput>({
    mutationFn: async (payload: LoginInput) => {
      const { data } = await api.post("/auth/login", payload);
      return data.data.user as User;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

export const useLogout = () => {
  const qc = useQueryClient();
  return useMutation<void, Error, void>({
    mutationFn: async () => {
      await api.post("/auth/logout");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["me"] });
    },
  });
};
