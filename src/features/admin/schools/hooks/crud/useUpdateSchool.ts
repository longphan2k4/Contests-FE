import { useState } from 'react';
import { updateSchool } from '../../services/schoolService';
import type { School, ValidationError, ApiErrorResponse } from '../../types/school';
import { AxiosError } from 'axios';

export const useUpdateSchool = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  const update = async (id: number, schoolData: Partial<School>): Promise<School | null> => {
    try {
      setLoading(true);
      setError(null);
      setValidationErrors([]);
      setSuccess(false);
      const updatedSchool = await updateSchool(id, schoolData);
      setSuccess(true);
      return updatedSchool;
    } catch (err: unknown) {
      const error = err as AxiosError<ApiErrorResponse>;
      
      if (error.response?.data) {
        const errorResponse = error.response.data;
        
        if (errorResponse.error?.type === 'VALIDATION_ERROR' && 
            errorResponse.error?.details && 
            Array.isArray(errorResponse.error.details)) {
          // Xử lý lỗi validation từ backend
          setValidationErrors(errorResponse.error.details);
          setError(errorResponse.error.details[0].message);
        } else {
          // Xử lý thông báo lỗi khác từ backend
          setError(errorResponse.message || 'Lỗi khi cập nhật trường học');
          setValidationErrors([]);
        }
      } else {
        // Xử lý lỗi không có response từ server
        setError(error.message || 'Lỗi khi kết nối đến server');
        setValidationErrors([]);
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { 
    update, 
    loading, 
    error, 
    success, 
    validationErrors 
  };
}; 