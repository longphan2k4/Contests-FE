import { useMutation } from "@tanstack/react-query";
import { type UpdateClassInput } from "../types/class.shame";
import { UpdateClass } from "../service/api";
export const useUpdate = () => {
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateClassInput }) =>
      UpdateClass(id, payload),
  });
};
