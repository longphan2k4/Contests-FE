import axiosInstance from '../../../../config/axiosInstance';
import type { SearchParams, Question, Topic } from '../types';

export const questionService = {
  getQuestions: async (params: SearchParams) => {
    try {
      const response = await axiosInstance.get<{ data: { questions: Question[] } }>('/questions', { params });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách câu hỏi:', error);
      throw error;
    }
  },
  
  getTopics: async () => {
    try {
      const response = await axiosInstance.get<{ data: Topic[] }>('/question-topics');
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách chủ đề:', error);
      throw error;
    }
  }
}; 