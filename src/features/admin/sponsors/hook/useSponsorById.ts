import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getSponsorById } from "../service/api";
// useUserById.ts
export const useSponsorById = (id: number | null) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getSponsorById(id),
    enabled: !!id,
  });
};
