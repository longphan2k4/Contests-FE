import { useMutation } from "@tanstack/react-query";
import { type CreateAwardInput } from "../types/award.shame";
import { CreateAward } from "../service/api";

export const useCreateAward = () => {
  return useMutation({
    mutationFn: (payload: CreateAwardInput) => CreateAward(payload),
  });
};
