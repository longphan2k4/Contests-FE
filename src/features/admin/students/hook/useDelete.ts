import { useMutation } from "@tanstack/react-query";
import { DeleteStudent } from "../service/api";

export const useDelete = () => {
  return useMutation({
    mutationFn: (id: number) => DeleteStudent(id),
  });
};
