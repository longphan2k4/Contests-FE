import { useMutation } from "@tanstack/react-query";
import { DeleteRescue } from "../service/api";

export const useDelete = () => {
  return useMutation({
    mutationFn: (id: number) => DeleteRescue(id),
  });
};
