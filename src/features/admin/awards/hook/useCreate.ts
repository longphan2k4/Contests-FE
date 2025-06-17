import { useMutation } from "@tanstack/react-query";
import { type CreateAwardInput } from "../types/award.shame";
import { CreateAward } from "../service/api";
import { toast } from "react-toastify";

export const useCreateAward = (slug: string) => {
  return useMutation({
    mutationFn: (payload: CreateAwardInput) => CreateAward(slug, payload),
    onSuccess: () => {
      toast.success("Thêm giải thưởng thành công");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Đã xảy ra lỗi khi thêm giải thưởng";
      toast.error(message);
    }
  });
};