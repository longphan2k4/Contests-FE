import { useMutation } from "@tanstack/react-query";
import { DeleteQuestionPackage } from "../service/api";

export const useDelete = () => {
  return useMutation({
    mutationFn: (id: number) => DeleteQuestionPackage(id),
  });
};
