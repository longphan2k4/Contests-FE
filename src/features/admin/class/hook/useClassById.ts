import { useQuery } from "@tanstack/react-query";
import { getClassById } from "../service/api";
// useclassById.ts
export const useClassById = (id: number | null) => {
  return useQuery({
    queryKey: ["class", id],
    queryFn: () => getClassById(id),
    enabled: !!id,
  });
};
