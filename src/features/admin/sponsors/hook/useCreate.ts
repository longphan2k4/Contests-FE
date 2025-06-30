import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSponsorForContest } from "../service/api";
import { toast } from "react-toastify";
import type { CreateSponsorForContestInput } from "../types/sponsors.shame";

export const useCreateSponsorForContest = (slug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSponsorForContestInput) => {
      return await createSponsorForContest(slug, data);
    },
    onSuccess: () => {
      toast.success("Thêm nhà tài trợ thành công");
      queryClient.invalidateQueries({ queryKey: ["sponsors", slug] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Thêm nhà tài trợ thất bại");
    },
  });
};
