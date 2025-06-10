import { useMutation } from "@tanstack/react-query";
import { type deleteClasssType } from "../types/class.shame";
import { DeleteClasses } from "../service/api";

export const useDeletes = () => {
  return useMutation({
    mutationFn: (ids: deleteClasssType) => DeleteClasses(ids),
  });
};
