import { useQuery } from "@tanstack/react-query";
import { getAllAwards } from "../service/api";
import { type AwardQuery } from "../types/award.shame";

export const useAwards = (filter: AwardQuery) => {
  return useQuery({
    queryKey: ["awards", filter],
    queryFn: () => getAllAwards(filter),
    placeholderData: prevData => prevData, // ✅ Giữ lại data cũ
  });
};
