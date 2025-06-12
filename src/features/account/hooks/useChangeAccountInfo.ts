import { useMutation } from "@tanstack/react-query";
import { changeAccountInfo } from "../services/api";

const useChangeAccountInfo = () => {
  return useMutation({
    mutationFn: (data: { username: string; email: string }) => changeAccountInfo(data),
  });
};

export default useChangeAccountInfo;