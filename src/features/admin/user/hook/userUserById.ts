import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../service/api";
// useUserById.ts
export const useUserById = (id: number | null) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
};
