import axiosInstance from "../../../../config/axiosInstance";
import type {
  ContestantMatchQueryInput,
  ContestantMatchResponse,
  ContestantQueryInput
} from "../types/contestant-match.types";

export const contestantMatchApi = {
  // Lấy danh sách thí sinh theo trận đấu
  getContestantsByMatch: async (
    matchId: number,
    params: ContestantMatchQueryInput = {},
    contestSlug: string
  ): Promise<ContestantMatchResponse> => {
    const response = await axiosInstance.get(
      `/contests/${contestSlug}/matches/${matchId}/contestants`,
      { params }
    );
    return response.data;
  },

  // Lấy danh sách vòng đấu
  getRounds: async (contestSlug: string) => {
    const response = await axiosInstance.get(`/contests/${contestSlug}/rounds`);
    return response.data;
  },

  //lấy chi tiết thí sinh trong trận đấu : /contestant/53/match/2
  getContestantInMatch: async (contestantId: number, matchId: number) => {
    const response = await axiosInstance.get(`/contestant/${contestantId}/match/${matchId}`);
    return response.data.data; // Trả về data.data để lấy đúng cấu trúc dữ liệu
  },

  // lấy thông tin thí sinh với nhóm trong trận đấu hiện tại: /:id/contest/:slug/match/:matchId/with-groups
  getContestantWithGroups: async (
    contestantId: number,
    contestSlug: string,
    matchId: number
  ) => {
    const response = await axiosInstance.get(
      `/contestant/${contestantId}/contest/${contestSlug}/match/${matchId}/with-groups`
    );
    return response.data.data; // Trả về data.data để lấy đúng cấu trúc dữ liệu
  },


  // Lấy danh sách trận đấu
  getMatches: async (contestSlug: string, roundId?: number) => {
    const params = roundId ? { roundId } : {};
    const response = await axiosInstance.get(`/contests/${contestSlug}/matches`, { params });
    return response.data;
  },

  // Lấy danh sách trạng thái
  getStatusOptions: async () => {
    return {
      data: {
        options: [
          { label: "Đang thi", value: "active" },
          { label: "Bị loại", value: "eliminated" },
          { label: "Thăng hạng", value: "advanced" },
        ]
      }
    };
  },

  // Cập nhật trạng thái thí sinh trong trận đấu
  updateContestantStatus: async (
    contestSlug: string,
    matchId: number,
    contestantId: number,
    status: string
  ) => {
    const response = await axiosInstance.patch(
      `/contests/${contestSlug}/matches/${matchId}/contestants/${contestantId}/status`,
      { status }
    );
    return response.data;
  },

  // lấy danh sách các trận trong cuộc thi theo slug cuộc thi: /contest/:slug/matches
  getMatchesByContestSlug: async (contestSlug: string) => {
    const response = await axiosInstance.get(`/match/contest/${contestSlug}`);
    return response.data;
  },

  //lấy danh sách thí sinh trong trận đấu theo slug cuộc thi và id trận đấu: /contest/:slug/match/:matchId/contestants
  getContestantsInMatch: async (
    contestSlug: string,
    matchId: number,
    params: ContestantQueryInput = {}
  ): Promise<ContestantMatchResponse> => {
    const queryParams = {
      ...params,
      // truyền string vào để axios tự động chuyển đổi thành query string
      schoolIds: params.schoolIds ? params.schoolIds.join(",") : undefined,
      classIds: params.classIds ? params.classIds.join(",") : undefined,
    };
    const response = await axiosInstance.get(
      `/contestant/contest/${contestSlug}/match/${matchId}/contestants`,
      { params: queryParams }
    );
    return response.data;
  }
};
