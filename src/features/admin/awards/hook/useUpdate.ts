import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type UpdateAwardInput } from "../types/award.shame";
import { UpdateAward } from "../service/api";
import { toast } from "react-toastify";

export const useUpdate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateAwardInput }) =>
      UpdateAward(id, payload),    onSuccess: (_, variables) => {
      // Invalidate specific award query
      queryClient.invalidateQueries({ queryKey: ["awards", variables.id] });
      // Invalidate awards list
      queryClient.invalidateQueries({ queryKey: ["awards"] });
      toast.success("Cập nhật giải thưởng thành công");
    },    onError: (error: unknown) => {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Đã xảy ra lỗi khi cập nhật giải thưởng";
      toast.error(message);
    },
  });
};
