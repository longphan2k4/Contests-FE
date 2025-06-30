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
      return response.data || [];
    },
    staleTime: 30 * 1000, // 30 giây (giảm từ 5 phút để data được refresh nhanh hơn)
    refetchOnMount: true, // Luôn refetch khi component mount lại
    refetchOnWindowFocus: false, // Không refetch khi focus lại window để tránh spam
    enabled
  });
}; 