import { useQuery, useMutation } from "@tanstack/react-query";
import {
  GetBgContest,
  GetcountContestant,
  GetListQuestion,
  GetScreenControl,
  GetListRescues,
  GetCurrentQuestion,
  GetMatchInfo,
  GetListContestant,
  GetListSponsorMedia,
  GetListClassVideo,
  GetListRescueLifelineUsed,
  getCandidatesList,
  getCompletedContestants,
  updateToCompleted,
  updateToEliminated,
  updateAllCompletedToEliminated,
  getListAwards,
  getResultsByMatchSlug,
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

export const useListSponsorMedia = (slug: string | null) => {
  return useQuery({
    queryKey: ["ListSponsorMedia", slug],
    queryFn: () => GetListSponsorMedia(slug),
    enabled: !!slug,
  });
};

export const useListClassVideo = (slug: string | null) => {
  return useQuery({
    queryKey: ["ListClassVideo", slug],
    queryFn: () => GetListClassVideo(slug),
    enabled: !!slug,
  });
};

export const useListRescueLifelineUsed = (match: string | null) => {
  return useQuery({
    queryKey: ["ListRescueLifelineUsed", match],
    queryFn: () => GetListRescueLifelineUsed(match),
    enabled: !!match,
  });
};

// Hook để lấy danh sách thí sinh ứng cử viên cứu trợ đồng thời cập nhật thành qua vòng
export const useCandidatesList = (matchId: number | null, limit?: number) => {
  return useQuery({
    queryKey: ["CandidatesList", matchId, limit],
    queryFn: () => getCandidatesList(matchId!, limit),
    enabled: !!matchId,
  });
};

// Hook để lấy danh sách thí sinh đã hoàn thành (completed) trong trận đấu
export const useCompletedContestants = (
  matchId: number | null,
  limit?: number
) => {
  return useQuery({
    queryKey: ["CompletedContestants", matchId, limit],
    queryFn: () => getCompletedContestants(matchId!, limit),
    enabled: !!matchId,
  });
};

// Hook để cập nhật trạng thái thành completed cho các thí sinh trong trận đấu
export const useUpdateToCompleted = () => {
  return useMutation({
    mutationFn: ({
      matchId,
      contestantIds,
    }: {
      matchId: number | string;
      contestantIds: number[];
    }) => updateToCompleted(matchId, contestantIds),
  });
};

// Hook để cập nhật trạng thái thành eliminated cho các thí sinh trong trận đấu (từ completed về eliminated)
export const useUpdateToEliminated = () => {
  return useMutation({
    mutationFn: ({
      matchId,
      contestantIds,
    }: {
      matchId: number | string;
      contestantIds: number[];
    }) => updateToEliminated(matchId, contestantIds),
  });
};

// Hook để cập nhật tất cả thí sinh completed về eliminated trong trận đấu
export const useUpdateAllCompletedToEliminated = () => {
  return useMutation({
    mutationFn: (matchId: number | string) =>
      updateAllCompletedToEliminated(matchId),
  });
};

export const useListAwards = (matchSlug: string | null) => {
  return useQuery({
    queryKey: ["ListAwards", matchSlug],
    queryFn: () => getListAwards(matchSlug),
    enabled: !!matchSlug,
  });
};

export const useResultsByMatchSlug = (matchSlug: string | null) => {
  return useQuery({
    queryKey: ["ResultsByMatchSlug", matchSlug],
    queryFn: () => getResultsByMatchSlug(matchSlug),
    enabled: !!matchSlug,
  });
};
