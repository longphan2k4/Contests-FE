import { useMutation } from "@tanstack/react-query";
import { DeleteAward } from "../service/api";

export const useDelete = () => {
  return useMutation({
    mutationFn: (id: number) => DeleteAward(id),
  });
};
