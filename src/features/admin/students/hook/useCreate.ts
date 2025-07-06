import { useMutation } from "@tanstack/react-query";
import { CreateStudent } from "../service/api";

export const useCreateStudent = () => {
  return useMutation({
    mutationFn: (payload: FormData) => CreateStudent(payload),
  });
};
