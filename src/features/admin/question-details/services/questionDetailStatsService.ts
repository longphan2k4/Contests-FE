import axiosInstance from '../../../../config/axiosInstance';
import type { QuestionDetailStats, ApiResponse } from '../types/questionDetail';

/**
 * Lấy thống kê tổng quan về chi tiết câu hỏi
 */
export const getQuestionDetailStats = async (
  questionPackageId?: number, 
  timeRange?: 'day' | 'week' | 'month' | 'year'
): Promise<QuestionDetailStats> => {
  try {
    const params = new URLSearchParams();
    if (questionPackageId) {
      params.append('questionPackageId', String(questionPackageId));
    }
    if (timeRange) {
      params.append('timeRange', timeRange);
    }

    const response = await axiosInstance.get<ApiResponse<QuestionDetailStats>>('/question-details/stats', { 
      params 
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching question detail statistics:', error);
    throw error;
  }
};

/**
 * Lấy thống kê theo gói câu hỏi
 */
export const getStatsByPackage = async (packageId: number): Promise<QuestionDetailStats> => {
  try {
    const response = await axiosInstance.get<ApiResponse<QuestionDetailStats>>(
      `/question-details/stats?questionPackageId=${packageId}`
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching statistics for package ${packageId}:`, error);
    throw error;
  }
}; 