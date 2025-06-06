import { useMutation } from "@tanstack/react-query";
import { login } from "../services/api";
import { type LoginSchemaType } from "../types/auth.shema";
export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginSchemaType) => login(data),
  });
}
