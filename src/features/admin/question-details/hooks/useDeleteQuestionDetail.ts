import { useState, useCallback } from 'react';
import { deleteQuestionDetail, hardDeleteQuestionDetail } from '../services/questionDetailService';
import type { QuestionDetail, ApiErrorResponse } from '../types/questionDetail';
import { AxiosError } from 'axios';

/**
 * Hook để xóa một question detail
 */
export const useDeleteQuestionDetail = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const clearState = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  const softDelete = useCallback(async (
    questionId: number,
    questionPackageId: number
  ): Promise<QuestionDetail | null> => {
    clearState();
    
    try {
      setLoading(true);
      const result = await deleteQuestionDetail(questionId, questionPackageId);
      setSuccess(true);
      return result;
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      setError(axiosError.response?.data?.message || 'Lỗi khi xóa chi tiết câu hỏi');
      return null;
    } finally {
      setLoading(false);
    }
  }, [clearState]);

  const hardDelete = useCallback(async (
    questionId: number,
    questionPackageId: number
  ): Promise<boolean> => {
    clearState();
    
    try {
      setLoading(true);
      await hardDeleteQuestionDetail(questionId, questionPackageId);
      setSuccess(true);
      return true;
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      setError(axiosError.response?.data?.message || 'Lỗi khi xóa vĩnh viễn chi tiết câu hỏi');
      return false;
    } finally {
      setLoading(false);
    }
  }, [clearState]);

  return {
    softDelete,
    hardDelete,
    loading,
    error,
    success,
    clearState
  };
}; 