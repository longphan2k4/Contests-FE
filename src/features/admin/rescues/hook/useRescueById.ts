import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getRescueById } from "../service/api";
// useUserById.ts
export const useRescueById = (id: number | null) => {
  return useQuery({
    queryKey: ["rescue", id],
    queryFn: () => getRescueById(id),
    enabled: !!id,
  });
};
