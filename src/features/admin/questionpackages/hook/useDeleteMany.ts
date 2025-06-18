import { useMutation } from "@tanstack/react-query";
import { type deleteQuestionPackagesType } from "../types/questionpackages.shame";
import { DeleteQuestionPackages } from "../service/api";

export const useDeleteMany = () => {
  return useMutation({
    mutationFn: (ids: deleteQuestionPackagesType) => DeleteQuestionPackages(ids),
  });
};
