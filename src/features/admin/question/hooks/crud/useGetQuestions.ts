import { useQuery } from '@tanstack/react-query';
import type { QuestionsListResponse, SearchParams } from '../../types';
import { questionService } from '../../services/questionService';

// Import các endpoints

export const useGetQuestions = (params: SearchParams) => {
  return useQuery<QuestionsListResponse>({
    queryKey: ['questions', params],
    queryFn: () => questionService.getQuestions(params),
    staleTime: 60000, // 1 phút
  });
};

