import { useMutation } from "@tanstack/react-query";
import { type CreateQuestionPackageInput } from "../types/questionpackages.shame";
import { CreateQuestionPackage } from "../service/api";

export const useCreateQuestionPackage = () => {
  return useMutation({
    mutationFn: (payload: CreateQuestionPackageInput) => CreateQuestionPackage(payload),
  });
};
