import { useMutation } from "@tanstack/react-query";
import { type UpdateMediaInput } from "../types/media.shame";
import { UpdateMedia } from "../service/api";
export const useUpdate = () => {
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateMediaInput }) =>
      UpdateMedia(id, payload),
  });
};
