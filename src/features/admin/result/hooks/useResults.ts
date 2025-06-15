import { useState, useEffect, useCallback } from 'react';
import type { Result, ResultFilterParams, ResultSummary, ApiResponse, PaginatedResponse } from '../types';
import axiosInstance from '../../../../config/axiosInstance';

export const useResults = (initialParams?: ResultFilterParams) => {
  const [results, setResults] = useState<Result[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<ResultFilterParams>(initialParams || {});
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });

  const fetchResults = useCallback(async (queryParams?: ResultFilterParams) => {
    setIsLoading(true);
    setError(null);
    
    const searchParams = queryParams || params;
    
    try {
      const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Result>>>(`/results`, { params: searchParams });
      if (response.data.success && Array.isArray(response.data.data.results)) {
        setResults(response.data.data.results);
        setPagination({
          total: response.data.data.pagination.total,
          page: response.data.data.pagination.page,
          limit: response.data.data.pagination.limit,
          totalPages: response.data.data.pagination.totalPages
        });
      } else {
        console.error('Invalid response format:', response.data);
        setError('Định dạng dữ liệu không hợp lệ');
        setResults([]);
      }
    } catch (err) {
      setError('Không thể lấy dữ liệu kết quả');
      console.error('Error fetching results:', err);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  const getResultSummary = (): ResultSummary => {
    if (!Array.isArray(results)) {
      console.error('Results is not an array:', results);
      return {
        totalQuestions: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        accuracy: 0
      };
    }

    const totalQuestions = results.length;
    const correctAnswers = results.filter(result => result.isCorrect).length;
    
    return {
      totalQuestions,
      correctAnswers,
      incorrectAnswers: totalQuestions - correctAnswers,
      accuracy: totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0
    };
  };

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  return {
    results,
    isLoading,
    error,
    fetchResults,
    setParams,
    getResultSummary,
    totalPages: pagination.totalPages,
    totalResults: pagination.total
  };
};

export default useResults; 