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
  GetChartData,
  GetAllRescues,
  GetStatistic,
  GetStatisticsContestant,
  getListAwards,
  // GetLifelineUsedRescues,
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

export const userChartData = (id: number) => {
  return useQuery({
    queryKey: ["ChartData", id],
    queryFn: () => GetChartData(id),
    enabled: !!id,
  });
};

export const useAllRescues = (
  matchSlug: string | null,
  currentQuestionOrder: number | undefined
) => {
  return useQuery({
    queryKey: ["AllRescues", matchSlug, currentQuestionOrder],
    queryFn: () => GetAllRescues(matchSlug!, currentQuestionOrder),
    enabled: !!matchSlug,
  });
};

export const useStatistic = (matchSlug: string | null) => {
  return useQuery({
    queryKey: ["Statistic", matchSlug],
    queryFn: () => GetStatistic(matchSlug!),
    enabled: !!matchSlug,
  });
};

export const useStatisticsContestant = (matchSlug: string | null) => {
  return useQuery({
    queryKey: ["StatisticsContestant", matchSlug],
    queryFn: () => GetStatisticsContestant(matchSlug!),
    enabled: !!matchSlug,
  });
};

export const useListAwards = (matchSlug: string | null) => {
  return useQuery({
    queryKey: ["ListAwards", matchSlug],
    queryFn: () => getListAwards(matchSlug),
    enabled: !!matchSlug,
  });
};

// export const useLifelineUsedRescues = (matchSlug: string | null) => {
//   return useQuery({
//     queryKey: ["LifelineUsedRescues", matchSlug],
//     queryFn: () => GetLifelineUsedRescues(matchSlug!),
//     enabled: !!matchSlug,
//   });
// };
