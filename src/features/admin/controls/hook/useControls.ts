import { useQuery } from "@tanstack/react-query";
import {
  GetBgContest,
  GetcountContestant,
  GetListQuestion,
  GetScreenControl,
  GetListRescues,
  GetCurrentQuestion,
  GetMatchInfo,
  GetListContestant,
} from "../service/api";


export const useMatchInfo = (match: string | null) => {
  return useQuery({
    queryKey: ["MatchInfo", match],
    queryFn: () => GetMatchInfo(match),
    enabled: !!match,
  });
};

export const useBgContest = (match: string | null) => {
  return useQuery({
    queryKey: ["BgContest", match],
    queryFn: () => GetBgContest(match),
    enabled: !!match,
  });
};

export const useCurrentQuestion = (match: string | null) => {
  return useQuery({
    queryKey: ["CurrentQuestion", match],
    queryFn: () => GetCurrentQuestion(match),
    enabled: !!match,
  });
};

export const useListRescues = (match: string | null) => {
  return useQuery({
    queryKey: ["ListRescues", match],
    queryFn: () => GetListRescues(match),
    enabled: !!match,
  });
};

export const useListContestant = (match: string | null) => {
  return useQuery({
    queryKey: ["ListContestant", match],
    queryFn: () => GetListContestant(match),
    enabled: !!match,
  });
};

export const useCountContestant = (match: string | null) => {
  return useQuery({
    queryKey: ["CountContestant", match],
    queryFn: () => GetcountContestant(match),
    enabled: !!match,
  });
};

export const useListQuestion = (match: string | null) => {
  return useQuery({
    queryKey: ["ListQuestion", match],
    queryFn: () => GetListQuestion(match),
    enabled: !!match,
  });
};

export const useScreenControl = (match: string | null) => {
  return useQuery({
    queryKey: ["ScreenControl", match],
    queryFn: () => GetScreenControl(match),
    enabled: !!match,
  });
};


