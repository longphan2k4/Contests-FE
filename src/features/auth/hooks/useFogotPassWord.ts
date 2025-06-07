import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../services/api";
import { type ForgotPasswordSchemaType } from "../types/auth.shema";

const useForgotPassword = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordSchemaType) => forgotPassword(data),
  });
};

export default useForgotPassword;
