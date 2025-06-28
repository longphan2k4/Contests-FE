import { useMutation } from "@tanstack/react-query";
import { type CreateClassVideoInput } from "../types/class-video.shame";
import { CreateClassVideo } from "../service/api";

interface UseCreateClassVideoPayload {
  slug: string;
  data: CreateClassVideoInput;
}

export const useCreateClassVideo = () => {
  return useMutation({
    mutationFn: ({ slug, data }: UseCreateClassVideoPayload) => CreateClassVideo(slug, data),
  });
};