import axiosInstance from '../../../../config/axiosInstance';
import type { 
  QuestionDetail, 
  QuestionDetailFilter, 
  QuestionDetailResponse, 
  QuestionDetailFormData, 
  ReorderRequest,
  ApiResponse
} from '../types/questionDetail';

/**
 * Lấy danh sách chi tiết câu hỏi từ API
 */
export const getQuestionDetails = async (filter?: QuestionDetailFilter): Promise<QuestionDetailResponse> => {
  try {
    // Xây dựng các tham số query
    const params = new URLSearchParams();
    if (filter?.page) params.append('page', String(filter.page));
    if (filter?.limit) params.append('limit', String(filter.limit));
    if (filter?.questionId) params.append('questionId', String(filter.questionId));
    if (filter?.questionPackageId) params.append('questionPackageId', String(filter.questionPackageId));
    if (filter?.isActive !== undefined) params.append('isActive', String(filter.isActive));
    if (filter?.search) params.append('search', filter.search.trim());

    const response = await axiosInstance.get<ApiResponse<QuestionDetailResponse>>('/question-details', { params });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching question details:', error);
    throw error;
  }
};

/**
 * Lấy chi tiết một question detail
 */
export const getQuestionDetailById = async (questionId: number, questionPackageId: number): Promise<QuestionDetail> => {
  try {
    const response = await axiosInstance.get<ApiResponse<QuestionDetail>>(`/question-details/${questionId}/${questionPackageId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching question detail:`, error);
    throw error;
  }
};

/**
 * Tạo question detail mới
 */
export const createQuestionDetail = async (data: QuestionDetailFormData): Promise<QuestionDetail> => {
  try {
    const response = await axiosInstance.post<ApiResponse<QuestionDetail>>('/question-details', data);
    return response.data.data;
  } catch (error) {
    console.error('Error creating question detail:', error);
    throw error;
  }
};

/**
 * Cập nhật question detail
 */
export const updateQuestionDetail = async (
  questionId: number, 
  questionPackageId: number, 
  data: Partial<QuestionDetailFormData>
): Promise<QuestionDetail> => {
  try {
    const response = await axiosInstance.put<ApiResponse<QuestionDetail>>(
      `/question-details/${questionId}/${questionPackageId}`, 
      data
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error updating question detail:`, error);
    throw error;
  }
};

/**
 * Xóa question detail (soft delete)
 */
export const deleteQuestionDetail = async (questionId: number, questionPackageId: number): Promise<QuestionDetail> => {
  try {
    const response = await axiosInstance.delete<ApiResponse<QuestionDetail>>(`/question-details/${questionId}/${questionPackageId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error deleting question detail:`, error);
    throw error;
  }
};

/**
 * Xóa question detail (hard delete)
 */
export const hardDeleteQuestionDetail = async (questionId: number, questionPackageId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/question-details/${questionId}/${questionPackageId}/hard`);
  } catch (error) {
    console.error(`Error hard deleting question detail:`, error);
    throw error;
  }
};

/**
 * Tạo nhiều question detail cùng lúc
 */
export const bulkCreateQuestionDetails = async (data: QuestionDetailFormData[]): Promise<QuestionDetail[]> => {
  try {
    const response = await axiosInstance.post<ApiResponse<{ created: QuestionDetail[] }>>('/question-details/bulk', {
      questionDetails: data
    });
    return response.data.data.created;
  } catch (error) {
    console.error('Error bulk creating question details:', error);
    throw error;
  }
};

/**
 * Sắp xếp lại thứ tự câu hỏi trong gói
 */
export const reorderQuestionDetails = async (data: ReorderRequest): Promise<QuestionDetail[]> => {
  try {
    const response = await axiosInstance.put<ApiResponse<{ updated: QuestionDetail[] }>>('/question-details/reorder', data);
    return response.data.data.updated;
  } catch (error) {
    console.error('Error reordering question details:', error);
    throw error;
  }
};

/**
 * Lấy danh sách câu hỏi theo gói
 */
export const getQuestionsByPackage = async (
  packageId: number, 
  page: number = 1, 
  limit: number = 10, 
  includeInactive: boolean = false
): Promise<QuestionDetailResponse> => {
  try {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    if (!includeInactive) {
      params.append('isActive', 'true');
    }
    
    const response = await axiosInstance.get<ApiResponse<QuestionDetailResponse>>(
      `/question-details/package/${packageId}`, 
      { params }
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching questions by package:`, error);
    throw error;
  }
};

/**
 * Lấy danh sách gói câu hỏi theo câu hỏi
 */
export const getPackagesByQuestion = async (
  questionId: number,
  page: number = 1,
  limit: number = 10,
  isActive?: boolean
): Promise<QuestionDetailResponse> => {
  try {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    if (isActive !== undefined) {
      params.append('isActive', String(isActive));
    }
    
    const response = await axiosInstance.get<ApiResponse<QuestionDetailResponse>>(
      `/question-details/question/${questionId}`,
      { params }
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching packages by question:`, error);
    throw error;
  }
}; 