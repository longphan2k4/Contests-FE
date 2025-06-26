import { useQuery } from "@tanstack/react-query";
import {
  getMatchInfo,
  getContestantList,
  groupInfo,
} from "../services/selector/api";

export const useMatchInfo = (match: string | null) => {
  return useQuery({
    queryKey: ["matchInfo", match],
    queryFn: () => getMatchInfo(match),
    enabled: !!match,
  });
};
export const useContestantList = (match: string | null) => {
  return useQuery({
    queryKey: ["contestantList", match],
    queryFn: () => getContestantList(match),
    enabled: !!match,
  });
};
export const useGroupInfo = (match: string | null) => {
  return useQuery({
    queryKey: ["groupInfo", match],
    queryFn: () => groupInfo(match),
    enabled: !!match,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
