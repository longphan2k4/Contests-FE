import { useMutation } from "@tanstack/react-query";
import { type UpdateQuestionPackageInput } from "../types/questionpackages.shame";
import { UpdateQuestionPackage } from "../service/api";
export const useUpdate = () => {
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateQuestionPackageInput }) =>
      UpdateQuestionPackage(id, payload),
  });
};
