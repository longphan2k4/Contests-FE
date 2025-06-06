import { useState } from 'react';
import { toggleSchoolActive } from '../services/schoolService';
import type { School, ApiErrorResponse } from '../types/school';
import { AxiosError } from 'axios';

export const useToggleSchoolActive = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const toggle = async (id: number): Promise<School | null> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      const updatedSchool = await toggleSchoolActive(id);
      setSuccess(true);
      return updatedSchool;
    } catch (err: unknown) {
      const error = err as AxiosError<ApiErrorResponse>;
      
      if (error.response?.data) {
        const errorResponse = error.response.data;
        setError(errorResponse.message || `Lỗi khi cập nhật trạng thái trường học (ID: ${id})`);
      } else {
        setError(error.message || `Lỗi khi cập nhật trạng thái trường học (ID: ${id})`);
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { 
    toggle, 
    loading, 
    error, 
    success 
  };
}; 