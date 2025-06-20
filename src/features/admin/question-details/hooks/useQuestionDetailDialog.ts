import { useState, useEffect, useCallback, useRef } from 'react';
import type { AvailableQuestion } from '../types';
import { questionDetailService } from '../services/questionDetailService';
import { useStableObject } from '../../../../hooks/useStableCallback';
import { useDebounceApi } from '../../../../hooks/useDebounceApi';

export const useQuestionDetailDialog = (open: boolean, questionPackageId: number) => {
  const [questions, setQuestions] = useState<AvailableQuestion[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [selectedQuestions, setSelectedQuestions] = useState<AvailableQuestion[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<AvailableQuestion | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ difficulty: '', topic: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const stableFilters = useStableObject(filters);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchAvailableQuestionsInternal = useCallback(async (options?: { signal?: AbortSignal }) => {
    if (!questionPackageId) return;
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    const signal = options?.signal || abortControllerRef.current.signal;

    try {
      setIsLoading(true);
      
      const params = {
        page: currentPage,
        limit: pageSize,
        difficulty: stableFilters.difficulty || undefined,
        topic: stableFilters.topic || undefined,
        search: searchTerm || undefined
      };

      // console.debug('🔄 [useQuestionDetailDialog] Fetching with params:', params);

      const response = await questionDetailService.getAvailableQuestions(
        questionPackageId,
        params
      );

      if (signal.aborted) return;

      if (response?.data) {
        setQuestions(response.data.questions || []);
        setTotal(response.pagination?.total || 0);
        // console.debug('✅ [useQuestionDetailDialog] Fetched questions:', {
        //   count: (response.data.questions || []).length,
        //   total: response.pagination?.total
        // });
      } else {
        setQuestions([]);
        setTotal(0);
      }
    } catch (error: unknown) {
      if (error instanceof Error && (error.name === 'AbortError' || signal.aborted)) {
        return;
      }
      console.error('❌ [useQuestionDetailDialog] Error fetching questions:', error);
      setQuestions([]);
      setTotal(0);
    } finally {
      if (!signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [questionPackageId, stableFilters, searchTerm, currentPage, pageSize]);

  const [debouncedFetch, cancelFetch] = useDebounceApi(fetchAvailableQuestionsInternal, { delay: 300 });

  const fetchAvailableQuestions = useCallback(async () => {
    return debouncedFetch();
  }, [debouncedFetch]);

  useEffect(() => {
    return () => {
      cancelFetch();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [cancelFetch]);

  useEffect(() => {
    if (!open) {
      setQuestions([]);
      setSelectedIds(new Set());
      setSelectedQuestions([]);
      setSearchTerm('');
      setFilters({ difficulty: '', topic: '' });
      setCurrentPage(1);
      return;
    }
    
    if (questionPackageId) {
      // console.debug('🔄 [useQuestionDetailDialog] Dialog opened, fetching questions');
      debouncedFetch();
    }
  }, [open, questionPackageId, stableFilters, searchTerm, currentPage, pageSize, debouncedFetch]);

  useEffect(() => {
    const selected = questions.filter(q => selectedIds.has(q.id));
    // console.debug('✅ [useQuestionDetailDialog] Selected questions updated:', {
    //   selectedIds: Array.from(selectedIds),
    //   selectedCount: selected.length
    // });
    setSelectedQuestions(selected);
  }, [selectedIds, questions]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // console.debug('🔍 [useQuestionDetailDialog] Search term changed:', e.target.value);
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleSearch = useCallback(() => {
    // console.debug('🔍 [useQuestionDetailDialog] Search triggered:', searchTerm);
    setCurrentPage(1);
    fetchAvailableQuestions();
  }, [searchTerm, fetchAvailableQuestions]);

  const handleFilterChange = useCallback((name: string, value: string) => {
    // console.debug('🔄 [useQuestionDetailDialog] Filter changed:', { name, value });
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  }, []);

  const handleSelectQuestion = useCallback((question: AvailableQuestion) => {
    // console.debug('✅ [useQuestionDetailDialog] Question selected:', question);
    setSelectedQuestion(question);
  }, []);

  const handleSelectAll = useCallback((checked: boolean) => {
    // console.debug('✅ [useQuestionDetailDialog] Select all:', {
    //   checked,
    //   count: questions.length
    // });
    if (checked) {
      setSelectedIds(new Set(questions.map(q => q.id)));
    } else {
      setSelectedIds(new Set());
    }
  }, [questions]);

  const handleSelectOne = useCallback((id: number, checked: boolean) => {
    // console.debug('✅ [useQuestionDetailDialog] Select one:', { id, checked });
    setSelectedIds(prev => {
      const newSelectedIds = new Set(prev);
      if (checked) {
        newSelectedIds.add(id);
      } else {
        newSelectedIds.delete(id);
      }
      return newSelectedIds;
    });
  }, []);

  const handleRemoveSelected = useCallback((id: number) => {
    // console.debug('❌ [useQuestionDetailDialog] Remove selected:', id);
    setSelectedIds(prev => {
      const newSelectedIds = new Set(prev);
      newSelectedIds.delete(id);
      return newSelectedIds;
    });
  }, []);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      // console.debug('🔍 [useQuestionDetailDialog] Search triggered by Enter key');
      e.preventDefault();
      handleSearch();
    }
  }, [handleSearch]);

  const toggleFilters = useCallback(() => {
    // console.debug('🔄 [useQuestionDetailDialog] Toggle filters');
    setShowFilters(prev => !prev);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    // console.debug('🔄 [useQuestionDetailDialog] Page changed:', page);
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    // console.debug('🔄 [useQuestionDetailDialog] Page size changed:', size);
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  return {
    questions,
    loading: isLoading,
    selectedQuestion,
    selectedIds,
    selectedQuestions,
    searchTerm,
    filters,
    showFilters,
    topics: [],
    total,
    currentPage,
    pageSize,
    handleSearchChange,
    handleSearch,
    handleFilterChange,
    handleSelectQuestion,
    handleSelectAll,
    handleSelectOne,
    handleRemoveSelected,
    handleKeyPress,
    toggleFilters,
    handlePageChange,
    handlePageSizeChange
  };
}; 