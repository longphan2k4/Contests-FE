// src/auth/hooks/useChangePassword.ts
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../services/api";

const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: {
      currentPassword: string;
      newPassword: string;
      confirmNewPassword: string;
    }) => changePassword(data),
  });
};

export default useChangePassword;