import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { Result, ResultFilterParams, ResultSummary, ApiResponse, PaginatedResponse } from '../types';
import axiosInstance from '../../../../config/axiosInstance';
import { useStableObject } from '../../../../hooks/useStableCallback';
import { useDebounceApi } from '../../../../hooks/useDebounceApi';

export const useResults = (initialParams?: ResultFilterParams) => {
  const [results, setResults] = useState<Result[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // ✅ Fix: Sử dụng stable object reference để tránh infinite loop
  const [params, setParams] = useState<ResultFilterParams>(initialParams || {});
  const stableParams = useStableObject(params || {});
  
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });

  // ✅ Fix: Thêm AbortController để cancel requests
  const abortControllerRef = useRef<AbortController | null>(null);

  // ✅ Fix: Loại bỏ params dependency để tránh infinite loop
  const fetchResultsInternal = useCallback(async (queryParams?: ResultFilterParams, options?: { signal?: AbortSignal }) => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new AbortController
    abortControllerRef.current = new AbortController();
    const signal = options?.signal || abortControllerRef.current.signal;
    
    setIsLoading(true);
    setError(null);
    
    const searchParams = queryParams || stableParams;
    
    try {
      const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Result>>>(
        `/results`, 
        { 
          params: searchParams,
          signal // ✅ Fix: Thêm signal để cancel request
        }
      );
      
      // ✅ Fix: Kiểm tra nếu request đã bị cancel
      if (signal.aborted) return;
      
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
    } catch (err: unknown) {
      // ✅ Fix: Không set error nếu request bị cancel
      if (err instanceof Error && (err.name === 'AbortError' || signal.aborted)) {
        return;
      }
      setError('Không thể lấy dữ liệu kết quả');
      console.error('Error fetching results:', err);
      setResults([]);
    } finally {
      if (!signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [stableParams]); // ✅ Fix: Sử dụng stableParams thay vì params

  // ✅ Fix: Sử dụng debounced API để giảm số lượng requests
  const [debouncedFetchResults, cancelFetch] = useDebounceApi(fetchResultsInternal, { delay: 300 });

  // Public fetch function
  const fetchResults = useCallback(async (queryParams?: ResultFilterParams) => {
    return debouncedFetchResults(queryParams);
  }, [debouncedFetchResults]);

  // ✅ Fix: Cleanup function để cancel requests khi component unmount
  useEffect(() => {
    return () => {
      cancelFetch();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [cancelFetch]);

  // ✅ Fix: Sử dụng stable dependency để tránh infinite loop  
  useEffect(() => {
    // ✅ Fix: Gọi debounced fetch thay vì fetchResultsInternal để tránh infinite loop
    debouncedFetchResults(stableParams);
  }, [stableParams, debouncedFetchResults]);

  // ✅ Fix: Memoize các expensive computations
  const getResultSummary = useMemo((): ResultSummary => {
    if (!Array.isArray(results)) {
      console.error('Results is not an array:', results);
      return {
        totalQuestions: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        accuracy: 0,
        byRound: {},
        byMatch: {},
        topStudents: []
      };
    }

    const totalQuestions = results.length;
    const correctAnswers = results.filter(result => result.isCorrect).length;
    
    // Thống kê theo vòng
    const byRound: Record<string, {roundName: string; total: number; correct: number; accuracy: number}> = {};
    results.forEach(result => {
      const roundId = result.match.round.id.toString();
      if (!byRound[roundId]) {
        byRound[roundId] = {
          roundName: result.match.round.name,
          total: 0,
          correct: 0,
          accuracy: 0
        };
      }
      byRound[roundId].total++;
      if (result.isCorrect) {
        byRound[roundId].correct++;
      }
      byRound[roundId].accuracy = byRound[roundId].total > 0 ? 
        (byRound[roundId].correct / byRound[roundId].total) * 100 : 0;
    });

    // Thống kê theo trận
    const byMatch: Record<string, {matchName: string; total: number; correct: number; accuracy: number}> = {};
    results.forEach(result => {
      const matchId = result.match.id.toString();
      if (!byMatch[matchId]) {
        byMatch[matchId] = {
          matchName: result.match.name,
          total: 0,
          correct: 0,
          accuracy: 0
        };
      }
      byMatch[matchId].total++;
      if (result.isCorrect) {
        byMatch[matchId].correct++;
      }
      byMatch[matchId].accuracy = byMatch[matchId].total > 0 ? 
        (byMatch[matchId].correct / byMatch[matchId].total) * 100 : 0;
    });

    // Top thí sinh
    const studentStats: Record<string, {
      studentName: string;
      studentCode: string;
      correct: number;
      total: number;
      accuracy: number;
    }> = {};

    results.forEach(result => {
      const studentId = result.contestant.student.id.toString();
      if (!studentStats[studentId]) {
        studentStats[studentId] = {
          studentName: result.contestant.student.fullName,
          studentCode: result.contestant.student.studentCode,
          correct: 0,
          total: 0,
          accuracy: 0
        };
      }
      studentStats[studentId].total++;
      if (result.isCorrect) {
        studentStats[studentId].correct++;
      }
      studentStats[studentId].accuracy = studentStats[studentId].total > 0 ? 
        (studentStats[studentId].correct / studentStats[studentId].total) * 100 : 0;
    });

    const topStudents = Object.values(studentStats)
      .sort((a, b) => b.accuracy - a.accuracy)
      .slice(0, 5);
    
    return {
      totalQuestions,
      correctAnswers,
      incorrectAnswers: totalQuestions - correctAnswers,
      accuracy: totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0,
      byRound,
      byMatch,
      topStudents
    };
  }, [results]); // ✅ Fix: Chỉ phụ thuộc vào results

  // ✅ Fix: Memoize getUniqueRounds và getUniqueMatches
  const getUniqueRounds = useMemo(() => {
    const roundsMap = new Map();
    results.forEach(result => {
      roundsMap.set(result.match.round.id, result.match.round.name);
    });
    return Array.from(roundsMap.entries()).map(([id, name]) => ({ id: Number(id), name }));
  }, [results]);

  const getUniqueMatches = useMemo(() => {
    const matchesMap = new Map();
    results.forEach(result => {
      matchesMap.set(result.match.id, result.match.name);
    });
    return Array.from(matchesMap.entries()).map(([id, name]) => ({ id: Number(id), name }));
  }, [results]);

  return {
    results,
    isLoading,
    error,
    fetchResults,
    setParams,
    getResultSummary,
    getUniqueRounds,
    getUniqueMatches,
    totalPages: pagination.totalPages,
    totalResults: pagination.total
  };
};

export default useResults; 