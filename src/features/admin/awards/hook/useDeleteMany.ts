import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type deleteAwardsType } from "../types/award.shame";
import { DeleteAwards } from "../service/api";
import { toast } from "react-toastify";

export const useDeleteMany = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (ids: deleteAwardsType) => DeleteAwards(ids),
    onSuccess: (_, deletedData) => {
      // Remove specific awards from cache
      deletedData.ids.forEach(id => {
        queryClient.removeQueries({ queryKey: ["awards", id] });
      });
      // Invalidate awards list
      queryClient.invalidateQueries({ queryKey: ["awards"] });
      toast.success("Xóa các giải thưởng thành công");
    },
    onError: (error: unknown) => {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Đã xảy ra lỗi khi xóa giải thưởng";
      toast.error(message);
    },
  });
};
