import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteAward } from "../service/api";
import { toast } from "react-toastify";

export const useDelete = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => DeleteAward(id),
    onSuccess: (_, deletedId) => {
      // Remove specific award from cache
      queryClient.removeQueries({ queryKey: ["awards", deletedId] });
      // Invalidate awards list
      queryClient.invalidateQueries({ queryKey: ["awards"] });
      toast.success("Xóa giải thưởng thành công");
    },
    onError: (error: unknown) => {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Đã xảy ra lỗi khi xóa giải thưởng";
      toast.error(message);
    },
  });
};
