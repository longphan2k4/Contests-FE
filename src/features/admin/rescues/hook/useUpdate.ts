import { useMutation } from "@tanstack/react-query";
import { type UpdateRescueInput } from "../types/rescues.shame";
import { UpdateRescue } from "../service/api";
export const useUpdate = () => {
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateRescueInput }) =>
      UpdateRescue(id, payload),
  });
};
