import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteStudent } from "../service/api";

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => DeleteStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
    
  });
};
