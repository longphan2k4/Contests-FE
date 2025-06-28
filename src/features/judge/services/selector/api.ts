import axiosInstance from "@config/axiosInstance";
import type { Contest } from "../../types/selector/Contest";

import type { Match } from "../../types/selector/Match";

export const getContests = async (): Promise<Contest[]> => {
  try {
    const response = await axiosInstance.get("/contest/list-contest/judge");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching contests:", error);
    throw error;
  }
};

export const getMatchesByContestId = async (
  contestId: number
): Promise<Match[]> => {
  try {
    const response = await axiosInstance.get(`/match/judge/${contestId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching matches:", error);
    throw error;
  }
};

export const getMatchInfo = async (match: string | null) => {
  const res = await axiosInstance.get(`/match/${match}/matchInfo`);
  return res.data;
};
export const getContestantList = async (match: string | null) => {
  try {
    const response = await axiosInstance.get(
      `/group-divisions/contestant/judge/${match}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching contestant list:", error);
    throw error;
  }
};

export const groupInfo = async (match: string | null) => {
  try {
    const response = await axiosInstance.get(`/group/match/${match}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching group info:", error);
    throw error;
  }
};
