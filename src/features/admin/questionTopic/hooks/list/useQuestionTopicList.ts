import { useState, useEffect, useCallback } from 'react';
import { getQuestionTopics } from '../../services/questionTopicService';
import type { QuestionTopic, QuestionTopicFilter } from '../../types/questionTopic';

export const useQuestionTopicList = (initialFilter?: QuestionTopicFilter) => {
  const [questionTopics, setQuestionTopics] = useState<QuestionTopic[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<QuestionTopicFilter>({
    page: 1,
    limit: 10,
    ...initialFilter
  });

  const fetchQuestionTopics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getQuestionTopics(filter);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      setQuestionTopics(response.data);
      setTotal(response.pagination.total);
      setTotalPages(response.pagination.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải danh sách chủ đề');
      setQuestionTopics([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchQuestionTopics();
  }, [fetchQuestionTopics]);

  const updateFilter = useCallback((newFilter: Partial<QuestionTopicFilter>) => {
    setFilter((prev) => {
      // Nếu thay đổi search hoặc isActive thì reset page về 1
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