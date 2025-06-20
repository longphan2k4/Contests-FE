import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type CreateAwardInput } from "../types/award.shame";
import { CreateAward } from "../service/api";
import { toast } from "react-toastify";

export const useCreateAward = (slug: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: CreateAwardInput) => CreateAward(slug, payload),
    onSuccess: () => {
      // Invalidate awards list to show new award
      queryClient.invalidateQueries({ queryKey: ["awards"] });
      toast.success("Thêm giải thưởng thành công");
    },
    onError: (error: unknown) => {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Đã xảy ra lỗi khi thêm giải thưởng";
      toast.error(message);
    }
  });
};