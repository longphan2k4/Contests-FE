import axiosStudent, { debugStudentToken } from "../../../config/axiosStudent";

// Types - Cập nhật interface để phù hợp với API backend
export interface SubmitAnswerRequest {
  matchId: number;
  questionOrder: number;
  answer: string;
  selectedOptions?: number[];
  correctAnswers?: number[];
}

export interface SubmitAnswerResponse {
  success: boolean;
  message: string;
  alreadyAnswered?: boolean;
  data: {
    result: {
      isCorrect: boolean;
      score: number;
      eliminated: boolean;
      correctAnswer: number[] | string;
      explanation: string;
      submittedAt: string;
      questionOrder: number;
      studentsEliminated?: string[];
    };
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

/**
 * Submit answer API service
 * Thay thế cho socket submit
 */
export class SubmitAnswerService {
  /**
   * Gửi câu trả lời của thí sinh
   */
  static async submitAnswer(
    matchId: number,
    questionOrder: number,
    answer: string,
    selectedOptions?: number[],
    correctAnswers?: number[]
  ): Promise<SubmitAnswerResponse> {
    try {
      console.log('🚀 Gửi câu trả lời qua API...');
      debugStudentToken();

      const requestData: SubmitAnswerRequest = {
        matchId,
        questionOrder,
        answer,
        ...(selectedOptions && { selectedOptions }),
        ...(correctAnswers && { correctAnswers })
      };

      console.log('📤 Request data:', requestData);

      // Sử dụng axiosStudent (đã có interceptor token sẵn)
      const response = await axiosStudent.post<SubmitAnswerResponse>(
        "/results/submit-answer",
        requestData
      );

      console.log('✅ API Response:', response.data);

      return response.data;

    } catch (error: unknown) {
      console.error('❌ Lỗi submit answer:', error);

      // Xử lý lỗi từ server
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string }; status?: number } };
        console.error('Server Error:', axiosError.response?.status, axiosError.response?.data);
        return {
          success: false,
          message: axiosError.response?.data?.message || 'Có lỗi từ server',
          data: {
            result: {
              isCorrect: false,
              score: 0,
              eliminated: false,
              correctAnswer: correctAnswers || answer,
              explanation: '',
              submittedAt: new Date().toISOString(),
              questionOrder: questionOrder,
              studentsEliminated: []
            }
          }
        };
      }

      // Xử lý lỗi network
      const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định';
      console.error('Network Error:', errorMessage);
      return {
        success: false,
        message: 'Lỗi kết nối mạng',
        data: {
          result: {
            isCorrect: false,
            score: 0,
            eliminated: false,
            correctAnswer: correctAnswers || answer,
            explanation: '',
            submittedAt: new Date().toISOString(),
            questionOrder: questionOrder,
            studentsEliminated: []
          }
        }
      };
    }
  }

  /**
   * Kiểm tra trạng thái submit (có thể dùng để check đã submit chưa)
   */
  static async checkSubmissionStatus(): Promise<boolean> {
    try {
      // Có thể implement API riêng để check trạng thái đã submit
      // Hiện tại return false để cho phép submit
      return false;
    } catch (error) {
      console.error('Lỗi khi check submission status:', error);
      return false;
    }
  }
}

export default SubmitAnswerService; 