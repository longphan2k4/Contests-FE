import { useMutation } from "@tanstack/react-query";
import { DeleteClass } from "../service/api";

export const useDelete = () => {
  return useMutation({
    mutationFn: (id: number) => DeleteClass(id),
  });
};
