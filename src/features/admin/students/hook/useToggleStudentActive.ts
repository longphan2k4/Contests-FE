import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleStudentActive } from "../service/api";

export const useToggleStudentActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => toggleStudentActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};
