import { useState, useEffect, useCallback } from 'react';
import { getQuestionDetailStats } from '../services/questionDetailStatsService';
import type { QuestionDetailStats } from '../types/questionDetail';

/**
 * Hook để lấy thống kê chi tiết câu hỏi
 */
export const useQuestionDetailStats = (packageId?: number, timeRange?: 'day' | 'week' | 'month' | 'year') => {
  const [stats, setStats] = useState<QuestionDetailStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState({
    packageId,
    timeRange
  });

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getQuestionDetailStats(filter.packageId, filter.timeRange);
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải thống kê chi tiết câu hỏi');
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, [filter.packageId, filter.timeRange]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const updateFilter = useCallback((newFilter: { packageId?: number, timeRange?: 'day' | 'week' | 'month' | 'year' }) => {
    setFilter(prev => ({
      ...prev,
      ...newFilter
    }));
  }, []);

  return {
    stats,
    loading,
    error,
    filter,
    updateFilter,
    refresh: fetchStats
  };
}; 