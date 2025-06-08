import { useState, useCallback } from 'react';
import { updateQuestionDetail } from '../services/questionDetailService';
import type { QuestionDetailFormData, QuestionDetail, ApiErrorResponse } from '../types/questionDetail';
import { AxiosError } from 'axios';
import { questionDetailUpdateSchema } from '../schemas/questionDetail.schema';
import { ZodError } from 'zod';

interface ValidationError {
  field: string;
  message: string;
}

/**
 * Hook để cập nhật một question detail
 */
export const useUpdateQuestionDetail = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  const clearErrors = useCallback(() => {
    setError(null);
    setValidationErrors([]);
    setSuccess(false);
  }, []);

  const update = useCallback(async (
    questionId: number,
    questionPackageId: number,
    data: Partial<QuestionDetailFormData>
  ): Promise<QuestionDetail | null> => {
    clearErrors();
    
    try {
      // Validate dữ liệu bằng Zod
      questionDetailUpdateSchema.parse(data);
      
      setLoading(true);
      const updatedQuestionDetail = await updateQuestionDetail(questionId, questionPackageId, data);
      setSuccess(true);
      return updatedQuestionDetail;
    } catch (err) {
      if (err instanceof ZodError) {
        // Xử lý lỗi validation từ Zod
        const errors = err.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }));
        setValidationErrors(errors);
        setError('Dữ liệu không hợp lệ');
      } else if (err instanceof AxiosError) {
        // Xử lý lỗi từ API
        const axiosError = err as AxiosError<ApiErrorResponse>;
        if (axiosError.response?.data?.error?.details) {
          setValidationErrors(axiosError.response.data.error.details);
        }
        setError(axiosError.response?.data?.message || 'Lỗi khi cập nhật chi tiết câu hỏi');
      } else {
        // Xử lý lỗi khác
        setError('Lỗi khi cập nhật chi tiết câu hỏi');
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, [clearErrors]);

  return {
    update,
    loading,
    error,
    success,
    validationErrors,
    clearErrors
  };
}; 