import { useState, useCallback, useEffect } from 'react';
import { questionDetailService } from '../services/questionDetailService';
import type { AvailableQuestion } from '../types';

interface AvailableQuestionsFilter {
  page?: number;
  limit?: number;
  isActive?: boolean;
  questionType?: string;
  difficulty?: string;
  search?: string;
}

interface AppliedFilters {
  questionType?: string;
  difficulty?: string;
  isActive?: boolean;
  search?: string;
}

interface UseAvailableQuestionsProps {
  packageId: number;
  initialFilter?: AvailableQuestionsFilter;
}

interface UseAvailableQuestionsReturn {
  questions: AvailableQuestion[];
  packageInfo: { id: number; name: string } | null;
  loading: boolean;
  error: string | null;
  filter: AvailableQuestionsFilter;
  updateFilter: (newFilter: Partial<AvailableQuestionsFilter>) => void;
  refreshQuestions: () => Promise<void>;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  appliedFilters: AppliedFilters;
}

export const useAvailableQuestions = ({ 
  packageId, 
  initialFilter = { page: 1, limit: 10, isActive: true } 
}: UseAvailableQuestionsProps): UseAvailableQuestionsReturn => {
  const [questions, setQuestions] = useState<AvailableQuestion[]>([]);
  const [packageInfo, setPackageInfo] = useState<{ id: number; name: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<AvailableQuestionsFilter>(initialFilter);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [hasPrev, setHasPrev] = useState<boolean>(false);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({});

  const fetchQuestions = useCallback(async () => {
    if (!packageId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await questionDetailService.getAvailableQuestions(packageId, filter);
      setQuestions(response.data.questions);
      setPackageInfo(response.data.packageInfo);
      
      if (response.pagination) {
        setTotal(response.pagination.total || 0);
        setTotalPages(response.pagination.totalPages || 0);
        setHasNext(!!response.pagination.hasNext);
        setHasPrev(!!response.pagination.hasPrev);
      }
      
      if (response.filters) {
        setAppliedFilters(response.filters.appliedFilters || {});
      }
      
    } catch (err) {
      setError('Không thể lấy danh sách câu hỏi');
      console.error('Lỗi khi lấy danh sách câu hỏi:', err);
    } finally {
      setLoading(false);
    }
  }, [packageId, filter]);

  const updateFilter = useCallback((newFilter: Partial<AvailableQuestionsFilter>) => {
    setFilter(prev => ({
      ...prev,
      ...newFilter,
      // Nếu có thay đổi khác ngoài page, reset về page 1
      page: newFilter.page !== undefined || Object.keys(newFilter).length === 1 
        ? newFilter.page || prev.page
        : 1
    }));
  }, []);

  const refreshQuestions = useCallback(async () => {
    await fetchQuestions();
  }, [fetchQuestions]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  return {
    questions,
    packageInfo,
    loading,
    error,
    filter,
    updateFilter,
    refreshQuestions,
    total,
    totalPages,
    hasNext,
    hasPrev,
    appliedFilters
  };
}; 