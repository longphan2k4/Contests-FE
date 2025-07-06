import { useQuery } from "@tanstack/react-query";
import { getClassVideoById } from "../service/api";
// useClassVideoById.ts
export const useClassVideoById = (id: number | null) => {
  return useQuery({
    queryKey: ["class-videossss", id],
    queryFn: () => getClassVideoById(id),
    enabled: !!id, // Ensure the query runs only if id is valid
  });
};
