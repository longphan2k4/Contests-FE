import axiosInstance from "../../../../config/axiosInstance";
import type { 
  ContestantMatchQueryInput,
  ContestantMatchResponse 
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
};
