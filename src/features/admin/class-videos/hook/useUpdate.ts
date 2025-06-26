import { useMutation } from "@tanstack/react-query";
import { type UpdateClassVideoInput } from "../types/class-video.shame";
import { UpdateClassVideo } from "../service/api";
export const useUpdate = () => {
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateClassVideoInput }) =>
      UpdateClassVideo(id, payload),
  });
};
