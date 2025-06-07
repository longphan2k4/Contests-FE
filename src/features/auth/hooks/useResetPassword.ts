import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../services/api";
import { type ResetPasswordSchemaType } from "../types/auth.shema";

const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordSchemaType) => resetPassword(data),
  });
};

export default useResetPassword;
