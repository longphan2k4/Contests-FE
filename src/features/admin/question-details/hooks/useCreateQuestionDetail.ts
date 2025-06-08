import { useState, useCallback } from 'react';
import { createQuestionDetail } from '../services/questionDetailService';
import type { QuestionDetailFormData, QuestionDetail, ApiErrorResponse } from '../types/questionDetail';
import { AxiosError } from 'axios';
import { questionDetailCreateSchema } from '../schemas/questionDetail.schema';
import { ZodError } from 'zod';

interface ValidationError {
  field: string;
  message: string;
}

/**
 * Hook để tạo mới một question detail
 */
export const useCreateQuestionDetail = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  const clearErrors = useCallback(() => {
    setError(null);
    setValidationErrors([]);
    setSuccess(false);
  }, []);

  const create = useCallback(async (data: QuestionDetailFormData): Promise<QuestionDetail | null> => {
    clearErrors();
    
    try {
      // Validate dữ liệu bằng Zod
      questionDetailCreateSchema.parse(data);
      
      setLoading(true);
      const newQuestionDetail = await createQuestionDetail(data);
      setSuccess(true);
      return newQuestionDetail;
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
        setError(axiosError.response?.data?.message || 'Lỗi khi tạo chi tiết câu hỏi');
      } else {
        // Xử lý lỗi khác
        setError('Lỗi khi tạo chi tiết câu hỏi');
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, [clearErrors]);

  return {
    create,
    loading,
    error,
    success,
    validationErrors,
    clearErrors
  };
}; 