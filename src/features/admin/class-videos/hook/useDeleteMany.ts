import { useMutation } from "@tanstack/react-query";
import { type deleteClassVideosType } from "../types/class-video.shame";
import { DeleteClassVideos } from "../service/api";

export const useDeleteMany = () => {
  return useMutation({
    mutationFn: (ids: deleteClassVideosType) => DeleteClassVideos(ids),
  });
};
