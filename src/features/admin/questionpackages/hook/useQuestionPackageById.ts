import { useQuery } from "@tanstack/react-query";
import { getQuestionPackageById } from "../service/api";
// useUserById.ts
export const useQuestionPackageById = (id: number | null) => {
  return useQuery({
    queryKey: ["question-packages", id],
    queryFn: () => getQuestionPackageById(id),
    enabled: !!id,
  });
};
