import { useMutation } from "@tanstack/react-query";
import { type deleteStudentsType } from "../types/student.shame";
import { DeleteUssers } from "../service/api";

export const useDeleteMany = () => {
  return useMutation({
    mutationFn: (ids: deleteStudentsType) => DeleteUssers(ids),
  });
};
