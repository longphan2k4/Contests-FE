import { useMutation } from "@tanstack/react-query";
import { type deleteAwardsType } from "../types/award.shame";
import { DeleteAwards } from "../service/api";

export const useDeleteMany = () => {
  return useMutation({
    mutationFn: (ids: deleteAwardsType) => DeleteAwards(ids),
  });
};
