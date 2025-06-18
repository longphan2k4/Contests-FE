import { useQuery } from "@tanstack/react-query";
import { getAllQuestionPackages } from "../service/api";
import { type QuestionPackageQuery } from "../types/questionpackages.shame";

export const useQuestionPackages = (filter: QuestionPackageQuery) => {
  return useQuery({
    queryKey: ["question-packages", filter],
    queryFn: () => getAllQuestionPackages(filter),
    placeholderData: prevData => prevData, // ✅ Giữ lại data cũ
  });
};
