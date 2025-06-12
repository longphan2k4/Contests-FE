import { useMutation } from "@tanstack/react-query";
import { changeAccountInfo } from "../services/api";
import type { UserType } from "../../auth/types/auth.shema";

const useChangeAccountInfo = () => {
  return useMutation<
    { data?: UserType; message?: string }, // Type cho response
    Error,
    { username: string; email: string }
  >({
    mutationFn: (data: { username: string; email: string }) => changeAccountInfo(data),
  });
};

export default useChangeAccountInfo;