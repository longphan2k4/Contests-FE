import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type DeleteMediasType } from "../types/media.shame";
import { DeleteMedias } from "../service/api";
import { toast } from "react-toastify";

export const useDeleteMany = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (ids: DeleteMediasType) => DeleteMedias(ids),
    onSuccess: (_, deletedData) => {
      // Remove specific awards from cache
      deletedData.ids.forEach(id => {
        queryClient.removeQueries({ queryKey: ["media", id] });
      });
      // Invalidate awards list
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success("Xóa các Media thành công");
    },
    onError: (error: unknown) => {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Đã xảy ra lỗi khi xóa Media";
      toast.error(message);
    },
  });
};
