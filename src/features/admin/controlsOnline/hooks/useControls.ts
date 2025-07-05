import { useQuery } from "@tanstack/react-query";
import { GetMatchInfo } from "../../controls/service/api";

export const useMatchInfo = (match: string | null) => {
  return useQuery({
    queryKey: ["MatchInfo", match],
    queryFn: async () => {
      const result = await GetMatchInfo(match);
      return result;
    },
    enabled: !!match,
  });
}; 