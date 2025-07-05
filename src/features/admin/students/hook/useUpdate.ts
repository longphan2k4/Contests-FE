import { useMutation } from "@tanstack/react-query";
import { UpdateStudent } from "../service/api";
export const useUpdate = () => {
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: FormData }) =>
      UpdateStudent(id, payload),
  });
};
