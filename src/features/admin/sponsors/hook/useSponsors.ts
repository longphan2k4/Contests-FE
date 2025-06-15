import { useQuery } from "@tanstack/react-query";
import { getAllSponsors } from "../service/api";
import { type SponsorQuery } from "../types/sponsors.shame";

export const useSponsors = (filter: SponsorQuery) => {
  return useQuery({
    queryKey: ["users", filter],
    queryFn: () => getAllSponsors(filter),
    placeholderData: prevData => prevData, // ✅ Giữ lại data cũ
  });
};
