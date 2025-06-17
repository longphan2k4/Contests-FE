import type { 
  QuestionDetail, 
  QuestionDetailStats,
  ApiResponse,
  ReorderRequest,
  QuestionPackageResponse
} from '../types';
import axiosInstance from '../../../../config/axiosInstance';

const BASE_URL = '/question-details';

interface BulkCreateResponse {
  totalRequested: number;
  successful: number;
  failed: number;
  successfulItems: Array<{
    questionId: number;
    questionPackageId: number;
  }>;
  failedItems: Array<{
    questionId: number;
    questionPackageId: number;
    reason: string;
  }>;
}

interface ReorderResponse {
  updated: QuestionDetail[];
  summary: {
    totalRequested: number;
    successful: number;
    failed: number;
  };
}

interface BatchDeletePayload {
  items: Array<{
    questionId: number;
    questionPackageId: number;
  }>;
}

export const questionDetailService = {
  /**
   * Lấy danh sách chi tiết câu hỏi từ API
   * GET /api/question-details
   */
  getQuestionDetails: async (params: {
    page?: number;
    limit?: number;
    questionId?: number;
    questionPackageId?: number;
    isActive?: boolean;
    search?: string;
  }): Promise<ApiResponse<QuestionDetail[]>> => {
    try {
      const response = await axiosInstance.get<ApiResponse<QuestionDetail[]>>(BASE_URL, { params });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách chi tiết câu hỏi:', error);
      throw error;
    }
  },

  /**
   * Lấy chi tiết một question detail
   * GET /api/question-details/{questionId}/{questionPackageId}
   */
  getQuestionDetailById: async (questionId: number, questionPackageId: number): Promise<QuestionDetail> => {
    try {
      const response = await axiosInstance.get<ApiResponse<QuestionDetail>>(`${BASE_URL}/${questionId}/${questionPackageId}`);
      return response.data.data;
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết câu hỏi:', error);
      throw error;
    }
  },

  /**
   * Tạo question detail mới
   * POST /api/question-details
   */
  createQuestionDetail: async (data: {
    questionId: number;
    questionPackageId: number;
    questionOrder: number;
    isActive: boolean;
  }): Promise<QuestionDetail> => {

    try {
      const response = await axiosInstance.post<ApiResponse<QuestionDetail>>(BASE_URL, data);
      console.log(response)
      return response.data.data;
    } catch (error) {
      console.error('Lỗi khi tạo chi tiết câu hỏi mới:', error);
      throw error;
    }
  },

  /**
   * Cập nhật question detail
   * PUT /api/question-details/{questionId}/{questionPackageId}
   */
  updateQuestionDetail: async (questionId: number, questionPackageId: number, data: {
    questionOrder?: number;
    isActive?: boolean;
  }): Promise<QuestionDetail> => {
    try {
      const response = await axiosInstance.put<ApiResponse<QuestionDetail>>(`${BASE_URL}/${questionId}/${questionPackageId}`, data);
      return response.data.data;
    } catch (error) {
      console.error('Lỗi khi cập nhật chi tiết câu hỏi:', error);
      throw error;
    }
  },

  /**
   * Xóa question detail (soft delete)
   * DELETE /api/question-details/{questionId}/{questionPackageId}
   */
  deleteQuestionDetail: async (questionId: number, questionPackageId: number): Promise<QuestionDetail> => {
    try {
      const response = await axiosInstance.delete<ApiResponse<QuestionDetail>>(`${BASE_URL}/${questionId}/${questionPackageId}`);
      return response.data.data;
    } catch (error) {
      console.error('Lỗi khi xóa chi tiết câu hỏi:', error);
      throw error;
    }
  },

  /**
   * Xóa question detail (hard delete)
   * DELETE /api/question-details/{questionId}/{questionPackageId}/hard
   */
  hardDeleteQuestionDetail: async (questionId: number, questionPackageId: number): Promise<void> => {
    try {
      await axiosInstance.delete(`${BASE_URL}/${questionId}/${questionPackageId}/hard`);
    } catch (error) {
      console.error('Lỗi khi xóa vĩnh viễn chi tiết câu hỏi:', error);
      throw error;
    }
  },

  /**
   * Tạo nhiều question detail cùng lúc
   * POST /api/question-details/bulk
   */
  bulkCreateQuestionDetails: async (data: {
    questionDetails: Array<{
      questionId: number;
      questionPackageId: number;
      questionOrder: number;
      isActive: boolean;
    }>;
  }): Promise<BulkCreateResponse> => {
    try {
      const response = await axiosInstance.post<ApiResponse<BulkCreateResponse>>(`${BASE_URL}/bulk`, data);
      console.log('response', response);
      return response.data.data;
      
    } catch (error) {
      console.error('Lỗi khi tạo nhiều chi tiết câu hỏi:', error);
      throw error;
    }
  },

  /**
   * Sắp xếp lại thứ tự câu hỏi trong gói
   * PUT /api/question-details/reorder
   */
  reorderQuestionDetails: async (data: ReorderRequest): Promise<ReorderResponse> => {
    try {
      const response = await axiosInstance.put<ApiResponse<ReorderResponse>>(`${BASE_URL}/reorder`, data);
      return response.data.data;
    } catch (error) {
      console.error('Lỗi khi sắp xếp lại thứ tự câu hỏi:', error);
      throw error;
    }
  },

  /**
   * Lấy danh sách câu hỏi theo gói
   * GET /api/question-details/package/{packageId}
   */
  getQuestionsByPackage: async (
    packageId: number, 
    params: {
      page?: number;
      limit?: number;
      isActive?: boolean;
      includeInactive?: boolean;
      questionType?: string;
      difficulty?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      search?: string;
    }
  ): Promise<ApiResponse<QuestionPackageResponse>> => {
    try {
      const response = await axiosInstance.get<ApiResponse<QuestionPackageResponse>>(`${BASE_URL}/package/${packageId}`, { params });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách câu hỏi theo gói:', error);
      throw error;
    }
  },

  /**
   * Lấy danh sách gói câu hỏi theo câu hỏi
   * GET /api/question-details/question/{questionId}
   */
  getPackagesByQuestion: async (
    questionId: number,
    params: {
      page?: number;
      limit?: number;
      isActive?: boolean;
    }
  ): Promise<ApiResponse<QuestionDetail[]>> => {
    try {
      const response = await axiosInstance.get<ApiResponse<QuestionDetail[]>>(`${BASE_URL}/question/${questionId}`, { params });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách gói câu hỏi theo câu hỏi:', error);
      throw error;
    }
  },

  /**
   * Lấy thống kê chi tiết câu hỏi
   * GET /api/question-details/stats
   */
  getQuestionDetailStats: async (questionPackageId?: number): Promise<QuestionDetailStats> => {
    try {
      const response = await axiosInstance.get<ApiResponse<QuestionDetailStats>>(`${BASE_URL}/stats`, {
        params: { questionPackageId }
      });
      return response.data.data;
    } catch (error) {
      console.error('Lỗi khi lấy thống kê chi tiết câu hỏi:', error);
      throw error;
    }
  },

  /**
   * Lấy danh sách chi tiết câu hỏi theo gói (alias cho getQuestionsByPackage)
   * GET /api/question-details/package/{packageId}
   */
  getQuestionDetailsByPackage: async (packageId: number, params: {
    page?: number;
    limit?: number;
    isActive?: boolean;
    includeInactive?: boolean;
    questionType?: string;
    difficulty?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
  }): Promise<ApiResponse<QuestionPackageResponse>> => {
    try {
      console.log('params', params);
      const response = await axiosInstance.get<ApiResponse<QuestionPackageResponse>>(`${BASE_URL}/package/${packageId}`, { params });
      console.log('response', response);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách chi tiết câu hỏi theo gói:', error);
      throw error;
    }
  },

  /**
   * Xóa nhiều câu hỏi cùng lúc
   * POST /api/question-details/batch-delete
   */
  batchDelete: async (payload: BatchDeletePayload) => {
    try {
      const response = await axiosInstance.post(`${BASE_URL}/batch-delete`, payload);
      console.log(response);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi xóa nhiều câu hỏi:', error);
      throw error;
    }
  }
}; 