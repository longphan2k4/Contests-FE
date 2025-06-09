import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getUserById } from "../service/api";
import { type User } from "../types/user.shame";
export const useUserById = (id: number | null) => {
  return useQuery<User, Error>({
    queryKey: ["user", id],
    queryFn: () => getUserById(id!),
    enabled: id !== null,
    retry: false,
  });
};
