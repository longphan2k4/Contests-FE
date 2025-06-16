import type { Match } from '../types/match';

export const fetchMatches = async (): Promise<Match[]> => {
  // Thay bằng API call thực tế
  return [
    { id: 1, match_name: 'Trận 1', start_time: '2025-06-13T10:00:00' },
    { id: 2, match_name: 'Trận 2', start_time: '2025-06-13T14:00:00' },
    { id: 3, match_name: 'Trận chung kết', start_time: '2025-06-13T18:00:00' },
  ];
};