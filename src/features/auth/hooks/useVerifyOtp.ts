import { useMutation } from "@tanstack/react-query";
import { verifyOtp } from "../services/api";
const useVerifyOtp = () => {
  return useMutation({
    mutationFn: verifyOtp,
  });
};
export default useVerifyOtp;
