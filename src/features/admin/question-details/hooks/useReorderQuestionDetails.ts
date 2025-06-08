import { useState, useCallback } from 'react';
import { reorderQuestionDetails } from '../services/questionDetailService';
import type { QuestionDetail, ReorderRequest, ApiErrorResponse } from '../types/questionDetail';
import { AxiosError } from 'axios';

/**
 * Hook để sắp xếp lại thứ tự câu hỏi
 */
export const useReorderQuestionDetails = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const reorder = useCallback(async (data: ReorderRequest): Promise<QuestionDetail[] | null> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      const result = await reorderQuestionDetails(data);
      setSuccess(true);
      return result;
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      setError(axiosError.response?.data?.message || 'Lỗi khi sắp xếp lại thứ tự câu hỏi');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    reorder,
    loading,
    error,
    success
  };
}; 