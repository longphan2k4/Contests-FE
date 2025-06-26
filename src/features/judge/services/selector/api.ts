import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { Contest } from '../../types/selector/Contest';
import type { Match } from '../../types/selector/Match';

const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Gửi cookie (feAccessToken)
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized: Invalid or missing token');
    }
    return Promise.reject(error);
  }
);

export const getContests = async (): Promise<Contest[]> => {
  try {
    const response = await api.get('/contest/list-contest/judge');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching contests:', error);
    throw error;
  }
};

export const getMatchesByContestId = async (contestId: number): Promise<Match[]> => {
  try {
    const response = await api.get(`/match/judge/${contestId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching matches:', error);
    throw error;
  }
};