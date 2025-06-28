import { useMutation } from "@tanstack/react-query";
import { DeleteClassVideo } from "../service/api";

export const useDelete = () => {
  return useMutation({
    mutationFn: (id: number) => DeleteClassVideo(id),
  });
};
