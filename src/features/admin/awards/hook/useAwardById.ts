import { useQuery } from "@tanstack/react-query";
import { getAwardById } from "../service/api";
// useUserById.ts
export const useAwardById = (id: number | null) => {
  return useQuery({
    queryKey: ["awards", id],
    queryFn: () => getAwardById(id),
    enabled: !!id,
  });
};
