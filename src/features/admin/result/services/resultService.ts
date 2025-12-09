import axios from 'axios';
import type { Result, ResultFilterParams } from '../types';

const API_URL = import.meta.env.VITE_API_URL || '';

export const getResults = async (params?: ResultFilterParams): Promise<Result[]> => {
  const response = await axios.get(`${API_URL}/api/results`, { params });
  return response.data;
};

export const getResultById = async (id: number): Promise<Result> => {
  const response = await axios.get(`${API_URL}/api/results/${id}`);
  return response.data;
};

export const getResultsByMatchId = async (matchId: number): Promise<Result[]> => {
  return getResults({ matchId });
};

export const getResultsByContestantId = async (contestantId: number): Promise<Result[]> => {
  return getResults({ contestantId });
}; 