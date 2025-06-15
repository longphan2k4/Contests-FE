import { useMutation } from "@tanstack/react-query";
import { type UpdateSponsorInput } from "../types/sponsors.shame";
import { UpdateSponsor } from "../service/api";
export const useUpdate = () => {
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateSponsorInput }) =>
      UpdateSponsor(id, payload),
  });
};
