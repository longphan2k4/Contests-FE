import { useQuery } from "@tanstack/react-query";
import { getClassVideoById } from "../service/api";
// useClassVideoById.ts
export const useClassVideoById = (id: number | null) => {
  return useQuery({
    queryKey: ["class-video", id],
    queryFn: () => getClassVideoById(id),
    enabled: !!id,
  });
};
