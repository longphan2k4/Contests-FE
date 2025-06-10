import { useQuery } from "@tanstack/react-query";
import { getAllQuestionPackages } from "../service/api";
import type { Filter } from "../components/QuestionPackagesList";

export const useQuestionPackages = (filter: Filter) => {
  return useQuery({
    queryKey: ["question-packages", filter.page, filter.limit, filter.keyword || ""],
    queryFn: () =>
      getAllQuestionPackages({
        page: filter.page,
        limit: filter.limit,
        search: filter.keyword || "",
      }),
      placeholderData: prevData => prevData,
  });
};
