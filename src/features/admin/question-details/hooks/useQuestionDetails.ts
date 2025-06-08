import { useState, useEffect, useCallback } from 'react';
import { getQuestionDetails } from '../services/questionDetailService';
import type { QuestionDetail, QuestionDetailFilter, Pagination } from '../types/questionDetail';

/**
 * Hook để quản lý danh sách chi tiết câu hỏi
 */
export const useQuestionDetails = (initialFilter?: QuestionDetailFilter) => {
  const [questionDetails, setQuestionDetails] = useState<QuestionDetail[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPreviousPage: false
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<QuestionDetailFilter>(initialFilter || { 
    page: 1, 
    limit: 10 
  });

  const fetchQuestionDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getQuestionDetails(filter);
      
      setQuestionDetails(response.questionDetails);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải danh sách chi tiết câu hỏi');
      setQuestionDetails([]);
      setPagination({
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: 10,
        hasNextPage: false,
        hasPreviousPage: false
      });
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchQuestionDetails();
  }, [fetchQuestionDetails]);

  const updateFilter = useCallback((newFilter: Partial<QuestionDetailFilter>) => {
    setFilter((prev) => {
      // Nếu thay đổi search, questionId, questionPackageId hoặc isActive thì reset page về 1
      if (
        newFilter.search !== undefined || 
        newFilter.questionId !== undefined || 
        newFilter.questionPackageId !== undefined || 
        newFilter.isActive !== undefined
      ) {
        return {
          ...prev,
          ...newFilter,
          page: 1
        };
      }
      
      return {
        ...prev,
        ...newFilter
      };
    });
  }, []);

  return {
    questionDetails,
    pagination,
    loading,
    error,
    filter,
    updateFilter,
    refresh: fetchQuestionDetails
  };
}; 