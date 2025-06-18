import { useMutation } from "@tanstack/react-query";
import { type deleteRescueType } from "../types/rescues.shame";
import { DeleteRescues } from "../service/api";

export const useDeleteMany = () => {
  return useMutation({
    mutationFn: (ids: deleteRescueType) => DeleteRescues(ids),
  });
};
