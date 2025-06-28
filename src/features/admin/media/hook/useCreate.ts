import { useMutation } from "@tanstack/react-query";
import { type CreateMediaInput } from "../types/media.shame";
import { CreateMedia } from "../service/api";

interface UseCreateMediaPayload {
  slug: string;
  data: CreateMediaInput;
}

export const useCreateMedia = () => {
  return useMutation({
    mutationFn: ({ slug, data }: UseCreateMediaPayload) => CreateMedia(slug, data),
  });
};