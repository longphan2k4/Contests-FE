import { useMutation } from "@tanstack/react-query";
import { type UpdateUserInput } from "../types/user.shame";
import { UpdateUser } from "../service/api";
export const useUpdate = () => {
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateUserInput }) =>
      UpdateUser(id, payload),
  });
};
