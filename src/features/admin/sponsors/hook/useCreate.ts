import { useMutation } from "@tanstack/react-query";
import { type CreateSponsorInput } from "../types/sponsors.shame";
import { CreateSponsor } from "../service/api";

export const useCreateSponsor = () => {
  return useMutation({
    mutationFn: (payload: CreateSponsorInput) => CreateSponsor(payload),
  });
};
