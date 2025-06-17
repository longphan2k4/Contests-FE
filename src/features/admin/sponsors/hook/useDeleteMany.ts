import { useMutation } from "@tanstack/react-query";
import { type deleteSponsorsType } from "../types/sponsors.shame";
import { DeleteSponsors } from "../service/api";

export const useDeleteMany = () => {
  return useMutation({
    mutationFn: (ids: deleteSponsorsType) => DeleteSponsors(ids),
  });
};  
