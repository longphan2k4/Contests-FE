import { useMutation } from "@tanstack/react-query";
import { type deleteUsersType } from "../types/user.shame";
import { DeleteUssers } from "../service/api";

export const useDeleteMany = () => {
  return useMutation({
    mutationFn: (ids: deleteUsersType) => DeleteUssers(ids),
  });
};
