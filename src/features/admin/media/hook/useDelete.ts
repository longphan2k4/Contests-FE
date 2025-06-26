import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteMedia } from "../service/api";
import { toast } from "react-toastify";

export const useDelete = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => DeleteMedia(id),
    onSuccess: (_, deletedId) => {
      // Remove specific award from cache
      queryClient.removeQueries({ queryKey: ["media", deletedId] });
      // Invalidate awards list
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success("Xóa Media thành công");
    },
    onError: (error: unknown) => {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Đã xảy ra lỗi khi xóa Media";
      toast.error(message);
    },
  });
};
