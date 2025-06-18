import { useMutation } from "@tanstack/react-query";
import { type CreateRescueInput } from "../types/rescues.shame";
import { CreateRescue } from "../service/api";

export const useCreateRescue = () => {
  return useMutation({
    mutationFn: (payload: CreateRescueInput) => CreateRescue(payload),
  });
};
