import { useQuery } from "@tanstack/react-query";
import { getQuestionPackageById } from "../service/api";
import { type QuestionPackage } from "../types/questionpackages.shame"; // Đổi lại cho đúng kiểu dữ liệu nếu cần

export const useQuestionPackageById = (id: number | null) => {
  return useQuery<QuestionPackage, Error>({
    queryKey: ["question-package", id],
    queryFn: () => getQuestionPackageById(id!),
    enabled: id !== null,
    retry: false,
  });
};