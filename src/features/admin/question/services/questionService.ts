import type { 
  Question, 
  QuestionsListResponse,
  SearchParams,
  BatchDeleteResponseData
} from '../types';
import axiosInstance from '../../../../config/axiosInstance';

const BASE_URL = '/questions';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

// Định nghĩa cho response tổng thể từ API khi batch delete
interface BatchDeleteApiResponse {
  success: boolean;
  message: string;
  data: BatchDeleteResponseData;
  timestamp: string;
}

export const questionService = {
  /**
   * Lấy danh sách câu hỏi từ API
   * GET /api/questions
   */
  getQuestions: async (params: SearchParams): Promise<QuestionsListResponse> => {
    try {
      // Tạo một bản sao của params để tránh thay đổi params gốc
      const queryParams = { ...params };

      // Chỉ gửi questionType nếu có giá trị hợp lệ
      if (!queryParams.questionType || !['multiple_choice', 'essay'].includes(queryParams.questionType)) {
        delete queryParams.questionType;
      }

      // Chỉ gửi difficulty nếu có giá trị hợp lệ
      if (!queryParams.difficulty || !['Alpha', 'Beta', 'Rc', 'Gold'].includes(queryParams.difficulty)) {
        delete queryParams.difficulty;
      }

      // Chỉ gửi isActive nếu có giá trị boolean
      if (queryParams.isActive === undefined) {
        delete queryParams.isActive;
      }

      const response = await axiosInstance.get<QuestionsListResponse>(BASE_URL, { params: queryParams });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách câu hỏi:', error);
      throw error;
    }
  },

  /**
   * Lấy chi tiết một câu hỏi
   * GET /api/questions/{id}
   */
  getQuestionById: async (id: number): Promise<Question> => {
    try {
      const response = await axiosInstance.get<ApiResponse<Question>>(`${BASE_URL}/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết câu hỏi:', error);
      throw error;
    }
  },

  /**
   * Tạo câu hỏi mới
   * POST /api/questions
   */
  createQuestion: async (formData: FormData): Promise<{ question: Question; message: string }> => {
    try {
      // Log toàn bộ entries của formData để debug
      for (const [key, value] of formData.entries()) {
        console.log('FormData field:', key, value);
      }
      const response = await axiosInstance.post<ApiResponse<Question>>(BASE_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return {
        question: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Lỗi khi tạo câu hỏi mới:', error);
      throw error;
    }
  },

  /**
   * Cập nhật câu hỏi
   * PATCH /api/questions/{id}
   */
  updateQuestion: async (id: number, formData: FormData): Promise<{ question: Question; message: string }> => {
    try {
      // Log toàn bộ entries của formData để debug
      console.log('FormData entries:');
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await axiosInstance.patch<ApiResponse<Question>>(
        `${BASE_URL}/${id}`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      console.log('Response update:', response.data);
      return {
        question: response.data.data,
        message: response.data.message
      };
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string; error?: Record<string, unknown> } } };
        console.error('Lỗi chi tiết:', axiosError.response?.data);
        if (axiosError.response?.data?.error) {
          console.error('Chi tiết lỗi validation:', axiosError.response.data.error);
        }
        throw new Error(axiosError.response?.data?.message || 'Lỗi khi cập nhật câu hỏi');
      }
      throw error;
    }
  },

  /**
   * Xóa câu hỏi (soft delete)
   * DELETE /api/questions/{id}
   */
  deleteQuestion: async (id: number): Promise<{ message: string }> => {
    try {
      const response = await axiosInstance.delete<ApiResponse<null>>(`${BASE_URL}/${id}/hard`);
      console.log('respone delete',response)
      console.log('message delete',response.data.message)
      return {
        message: response.data.message
      };
    } catch (error) {
      console.error('Lỗi khi xóa câu hỏi:', error);
      throw error;
    }
  },

  /**
   * Xóa câu hỏi (hard delete)
   * DELETE /api/questions/{id}/hard
   */
  hardDeleteQuestion: async (id: number): Promise<{ message: string }> => {

    try {
      const response = await axiosInstance.delete<ApiResponse<null>>(`${BASE_URL}/${id}/hard`);
      return {
        message: response.data.message
      };
    } catch (error) {
      console.error('Lỗi khi xóa vĩnh viễn câu hỏi:', error);
      throw error;
    }
  },

  /**
   * Xóa nhiều câu hỏi cùng lúc
   * POST /api/questions/batch
   */
  batchDelete: async (ids: number[]): Promise<BatchDeleteResponseData> => {
    console.log('ids delete',ids)
    try {
        console.log('ids delete2',ids)
      const response = await axiosInstance.delete<BatchDeleteApiResponse>(`${BASE_URL}/batch`,
        {data: { ids, hardDelete: true} }
      );
      console.log('respone batch delete',response)
      console.log('message batch delete',response.data.message)
      return response.data.data;
    } catch (error) {
      console.error('Lỗi khi xóa nhiều câu hỏi:', error);
      throw error;
    }
  },

  /**
   * Upload media cho câu hỏi
   * POST /api/questions/{id}/media
   */
  uploadMedia: async (id: number, mediaType: 'questionMedia' | 'mediaAnswer', files: File[]): Promise<{ question: Question; message: string }> => {
    try {
      const formData = new FormData();
      formData.append('mediaType', mediaType);
      
      // Thêm các file vào formData
      files.forEach(file => {
        formData.append('media', file);
      });
      
      const response = await axiosInstance.post<ApiResponse<Question>>(
        `${BASE_URL}/${id}/media`, 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      return {
        question: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Lỗi khi upload media cho câu hỏi:', error);
      throw error;
    }
  }
}; 