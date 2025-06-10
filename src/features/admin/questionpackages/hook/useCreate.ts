import { useMutation } from "@tanstack/react-query";
import { createQuestionPackage } from "../service/api";
import { type CreateUpdateQuestionPackageInput } from "../types/questionpackages.shame";


export const useCreateQuestionPackage = () => {
  return useMutation({
    mutationFn: (payload: CreateUpdateQuestionPackageInput) => createQuestionPackage(payload),
  });
};
