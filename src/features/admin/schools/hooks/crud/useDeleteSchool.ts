import { useState } from 'react';
import type { ApiErrorResponse } from '../../types/school';
import { AxiosError } from 'axios';

export const useDeleteSchool = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleDeleteSchools = async (ids: number[]): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      console.log('Xoá các trường có id:', ids);
      setSuccess(true);
      return true;
    } catch (err: unknown) {
      const error = err as AxiosError<ApiErrorResponse>;
      
      if (error.response?.data) {
        const errorResponse = error.response.data;
        setError(errorResponse.message || `Lỗi khi xóa trường học`);
      } else {
        setError(error.message || `Lỗi khi xóa trường học`);
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { 
    handleDeleteSchools, 
    loading, 
    error, 
    success 
  };
}; 