import axiosInstance from '@/config/axiosInstance';
import type { 
  RescueQuestionResponse, 
  SupportAnswerRequest, 
  SupportAnswerApiResponse,
  ChartDataResponse 
} from '../types/rescue';

/**
 * Lấy câu hỏi cứu trợ theo match slug và rescue ID
 * GET /api/rescue/match/{slug}/{rescueId}
 */
export const getRescueQuestion = async (
  matchSlug: string, 
  rescueId: number
): Promise<RescueQuestionResponse> => {
  try {
    const response = await axiosInstance.get(`/rescue/match/${matchSlug}/${rescueId}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching rescue question:', error);
    throw error;
  }
};

/**
 * Gửi câu trả lời hỗ trợ từ khán giả
 * POST /api/rescue/supportAnswer/{rescueId}
 */
export const submitSupportAnswer = async (
  rescueId: number,
  supportAnswer: string
): Promise<SupportAnswerApiResponse> => {
  try {
    const requestBody: SupportAnswerRequest = {
      supportAnswers: supportAnswer
    };

    const response = await axiosInstance.post(`/rescue/supportAnswer/${rescueId}`, requestBody);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error('Error submitting support answer:', error);
    throw error;
  }
};

/**
 * Lấy dữ liệu biểu đồ thống kê
 * GET /rescue/chart/{id}
 * Mapping với: RescueController.RescueChart
 */
export const getRescueChart = async (
  rescueId: number
): Promise<ChartDataResponse> => {
  try {
    const response = await axiosInstance.get(`/rescue/chart/${rescueId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching rescue chart:', error);
    throw error;
  }
};