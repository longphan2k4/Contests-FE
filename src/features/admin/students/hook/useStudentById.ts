import { useQuery } from "@tanstack/react-query";
import { getStudentById } from "../service/api";
// useUserById.ts
export const useStudentById = (id: number | null) => {
  return useQuery({
    queryKey: ["student", id],
    queryFn: () => getStudentById(id),
    enabled: !!id,
  });
};
