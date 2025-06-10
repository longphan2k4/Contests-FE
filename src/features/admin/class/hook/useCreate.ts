import { useMutation } from "@tanstack/react-query";
import { type CreateClassInput } from "../types/class.shame";
import { CreateClass } from "../service/api";

export const useCreate = () => {
  return useMutation({
    mutationFn: (payload: CreateClassInput) => CreateClass(payload),
  });
};
