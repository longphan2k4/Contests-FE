import { useMutation } from "@tanstack/react-query";
import { DeleteSponsor } from "../service/api";

export const useDelete = () => {
  return useMutation({
    mutationFn: (id: number) => DeleteSponsor(id),
  });
};
