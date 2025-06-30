import { useQuery } from "@tanstack/react-query";
import { GetMatchInfo } from "../../controls/service/api";

export const useMatchInfo = (match: string | null) => {
  return useQuery({
    queryKey: ["MatchInfo", match],
    queryFn: async () => {
      console.log("🚀 [HOOK] Calling GetMatchInfo for match:", match);
      const result = await GetMatchInfo(match);
      console.log("📥 [HOOK] GetMatchInfo response:", result);
      return result;
    },
    enabled: !!match,
  });
}; 