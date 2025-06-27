import { useQuery } from "@tanstack/react-query";
import { getMediaById } from "../service/api";
// useUserById.ts
export const useMediaById = (id: number | null) => {
  return useQuery({
    queryKey: ["media", id],
    queryFn: () => getMediaById(id),
    enabled: !!id,
  });
};
