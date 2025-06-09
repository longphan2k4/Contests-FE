import { useMutation } from "@tanstack/react-query";
import { type CreateUserInput } from "../types/user.shame";
import { CreateUser } from "../service/api";

export const useCreateUser = () => {
  return useMutation({
    mutationFn: (payload: CreateUserInput) => CreateUser(payload),
  });
};
