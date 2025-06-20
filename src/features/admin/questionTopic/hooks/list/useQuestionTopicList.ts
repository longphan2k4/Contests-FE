import { useState, useEffect, useCallback, useRef } from 'react';
import { getQuestionTopics } from '../../services/questionTopicService';
import type { QuestionTopic, QuestionTopicFilter } from '../../types/questionTopic';
import { useStableObject } from '../../../../../hooks/useStableCallback';
import { useDebounceApi } from '../../../../../hooks/useDebounceApi';

export const useQuestionTopicList = (initialFilter?: QuestionTopicFilter) => {
  const [questionTopics, setQuestionTopics] = useState<QuestionTopic[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<QuestionTopicFilter>({
    page: 1,
    limit: 10,
    ...initialFilter
  });

  const stableFilter = useStableObject(filter);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchQuestionTopicsInternal = useCallback(async (options?: { signal?: AbortSignal }) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    const signal = options?.signal || abortControllerRef.current.signal;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await getQuestionTopics(stableFilter);
      
      if (signal.aborted) return;
      
      if (!response.success) {
        throw new Error(response.message);
      }

      setQuestionTopics(response.data);
      setTotal(response.pagination.total);
      setTotalPages(response.pagination.totalPages);
    } catch (err: unknown) {
      if (err instanceof Error && (err.name === 'AbortError' || signal.aborted)) {
        return;
      }
      setError(err instanceof Error ? err.message : 'Lỗi khi tải danh sách chủ đề');
      setQuestionTopics([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  }, [stableFilter]);

  const [debouncedFetch, cancelFetch] = useDebounceApi(fetchQuestionTopicsInternal, { delay: 300 });

  const fetchQuestionTopics = useCallback(async () => {
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
    debouncedFetch();
  }, [stableFilter, debouncedFetch]);

  const updateFilter = useCallback((newFilter: Partial<QuestionTopicFilter>) => {
    setFilter((prev) => {
      if (newFilter.search !== undefined || newFilter.isActive !== undefined) {
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
    questionTopics,
    total,
    totalPages,
    loading,
    error,
    filter,
    updateFilter,
    refresh: fetchQuestionTopics
  };
}; 