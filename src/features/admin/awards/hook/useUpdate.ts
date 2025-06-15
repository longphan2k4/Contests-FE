import { useMutation } from "@tanstack/react-query";
import { type UpdateAwardInput } from "../types/award.shame";
import { UpdateAward } from "../service/api";
export const useUpdate = () => {
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateAwardInput }) =>
      UpdateAward(id, payload),
  });
};
