import { useState } from 'react';
import { deleteSchool } from '../../services/schoolService';
import type { ApiErrorResponse } from '../../types/school';
import { AxiosError } from 'axios';

export const useDeleteSchool = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const remove = async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      await deleteSchool(id);
      setSuccess(true);
      return true;
    } catch (err: unknown) {
      const error = err as AxiosError<ApiErrorResponse>;
      
      if (error.response?.data) {
        const errorResponse = error.response.data;
        setError(errorResponse.message || `Lỗi khi xóa trường học (ID: ${id})`);
      } else {
        setError(error.message || `Lỗi khi xóa trường học (ID: ${id})`);
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { 
    remove, 
    loading, 
    error, 
    success 
  };
}; 