import axiosInstance from '../../../../config/axiosInstance';
import type { 
  QuestionTopic, 
  QuestionTopicFilter, 
  QuestionTopicsResponse
} from '../types/questionTopic';



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

    const response = await axiosInstance.get<QuestionTopicsResponse>('/question-topics', { params });
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
    const response = await axiosInstance.get<QuestionTopic>(`/question-topic/${id}`);
    console.log(response.data);
    return response.data;

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
    const response = await axiosInstance.post<QuestionTopic>('/question-topics', questionTopicData);
    console.log(response.data);
    return response.data;
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
    const response = await axiosInstance.put<QuestionTopic>(`/question-topics/${id}`, questionTopicData);
    return response.data;
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
    await axiosInstance.delete(`/question-topic/${ids}`);
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