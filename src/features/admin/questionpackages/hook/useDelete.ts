import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteQuestionPackage } from "../service/api";

export const useDeleteQuestionPackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => DeleteQuestionPackage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["question-packages"] });
    },
    
  });
};
