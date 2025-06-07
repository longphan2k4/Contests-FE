import axios from 'axios';
import type { 
  QuestionTopic, 
  QuestionTopicFilter, 
  QuestionTopicsResponse
} from '../types/questionTopic';
import { API_URL } from '../../../../config/env';
import { loginFake } from '../../schools/services/loginFake';


interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

// Tạo axios instance với cấu hình mặc định
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Thêm interceptor để tự động đăng nhập nếu cần
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await loginFake();
      // Thử lại request ban đầu
      return api(error.config);
    }
    return Promise.reject(error);
  }
);

/**
 * Lấy danh sách chủ đề câu hỏi từ API
 */
export const getQuestionTopics = async (filter?: QuestionTopicFilter): Promise<QuestionTopicsResponse> => {
  try {
    const params = new URLSearchParams();
    if (filter?.page) params.append('page', String(filter.page));
    if (filter?.limit) params.append('limit', String(filter.limit));
    if (filter?.search) params.append('search', filter.search.trim());
    if (filter?.isActive !== undefined) params.append('isActive', String(filter.isActive));
    if (filter?.sortBy) params.append('sortBy', filter.sortBy);
    if (filter?.sortOrder) params.append('sortOrder', filter.sortOrder);

    const response = await api.get<QuestionTopicsResponse>('/question-topics', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching question topics:', error);
    // Trả về response mặc định khi có lỗi
    return {
      success: false,
      message: 'Có lỗi xảy ra khi tải danh sách chủ đề',
      data: [],
      pagination: {
        page: filter?.page || 1,
        limit: filter?.limit || 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false
      },
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Lấy thông tin chi tiết chủ đề câu hỏi
 */
export const getQuestionTopicById = async (id: number): Promise<QuestionTopic> => {
  try {
    const response = await api.get<ApiResponse<QuestionTopic>>(`/question-topic/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching question topic with id ${id}:`, error);
    throw error;
  }
};

/**
 * Tạo chủ đề câu hỏi mới
 */
export const createQuestionTopic = async (questionTopicData: Partial<QuestionTopic>): Promise<QuestionTopic> => {
  try {
    const response = await api.post<ApiResponse<QuestionTopic>>('/question-topic', questionTopicData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating question topic:', error);
    throw error;
  }
};

/**
 * Cập nhật thông tin chủ đề câu hỏi
 */
export const updateQuestionTopic = async (id: number, questionTopicData: Partial<QuestionTopic>): Promise<QuestionTopic> => {
  try {
    const response = await api.patch<ApiResponse<QuestionTopic>>(`/question-topic/${id}`, questionTopicData);
    return response.data.data;
  } catch (error) {
    console.error(`Error updating question topic with id ${id}:`, error);
    throw error;
  }
};

/**
 * Xóa chủ đề câu hỏi
 */
export const deleteQuestionTopic = async (ids: number[]): Promise<void> => {
  try {
    await api.delete(`/question-topic/${ids}`);
  } catch (error) {
    console.error(`Error deleting question topics with ids ${ids}:`, error);
    throw error;
  }
};

/**
 * Kích hoạt/vô hiệu hóa chủ đề câu hỏi
 */
export const toggleQuestionTopicActive = async (id: number): Promise<QuestionTopic> => {
  try {
    const questionTopic = await getQuestionTopicById(id);
    return updateQuestionTopic(id, { isActive: !questionTopic.isActive });
  } catch (error) {
    console.error(`Error toggling active state for question topic with id ${id}:`, error);
    throw error;
  }
}; 