import { useQuery } from '@tanstack/react-query';
import { getQuestionTopics } from '../../questionTopic/services/questionTopicService';

export const useQuestionTopics = (searchTerm: string = '', enabled = true) => {
  return useQuery({
    queryKey: ['questionTopics', searchTerm],
    queryFn: async () => {
      const response = await getQuestionTopics({
        search: searchTerm,
        isActive: true, // Chỉ lấy các chủ đề đang hoạt động
        limit: 100, // Giới hạn số lượng kết quả
      });
      console.log('topic',response)
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 phút
    enabled
  });
}; 