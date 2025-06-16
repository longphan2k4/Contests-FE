import { useQuery } from "@tanstack/react-query";
import { getAllAwards } from "../service/api";
import { type AwardQuery } from "../types/award.shame";

export const useAwards = (slug: string, filter: AwardQuery) => {
  return useQuery({
    queryKey: ["awards", slug,filter],
    queryFn: () => getAllAwards(slug,filter),
    placeholderData: prevData => prevData, // ✅ Giữ lại data cũ
  });
};
