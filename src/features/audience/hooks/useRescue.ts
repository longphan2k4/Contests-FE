import { useState, useEffect, useCallback } from 'react';
import type { 
  RescueQuestion, 
  ChartDataItem 
} from '../types/rescue';
import { 
  getRescueQuestion, 
  submitSupportAnswer, 
  getRescueChart 
} from '../services/rescueService';

interface UseRescueProps {
  matchSlug: string;
  rescueId: number;
  autoRefreshChart?: boolean;
  refreshInterval?: number;
}

interface UseRescueReturn {
  // State
  question: RescueQuestion | null;
  chartData: ChartDataItem[];
  selectedAnswer: string;
  isLoading: boolean;
  isSubmitting: boolean;
  isChartLoading: boolean;
  hasVoted: boolean;
  error: string | null;
  
  // Actions
  setSelectedAnswer: (answer: string) => void;
  submitVote: () => Promise<void>;
  refreshChart: () => Promise<void>;
  refreshQuestion: () => Promise<void>;
  reset: () => void;
}

export const useRescue = ({
  matchSlug,
  rescueId,
  autoRefreshChart = true,
  refreshInterval = 2000
}: UseRescueProps): UseRescueReturn => {
  // State
  const [question, setQuestion] = useState<RescueQuestion | null>(null);
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isChartLoading, setIsChartLoading] = useState<boolean>(false);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch question
  const fetchQuestion = useCallback(async () => {
    if (!matchSlug || !rescueId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await getRescueQuestion(matchSlug, rescueId);
      if (response.success && response.data) {
        setQuestion(response.data);
      } else {
        setError(response.message || 'Không thể tải câu hỏi');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi không xác định');
      console.error('Error fetching question:', err);
    } finally {
      setIsLoading(false);
    }
  }, [matchSlug, rescueId]);

  // Fetch chart data
  const fetchChart = useCallback(async () => {
    if (!rescueId) return;
    
    setIsChartLoading(true);
    
    try {
      const response = await getRescueChart(rescueId);
      if (response.success && response.data) {
        setChartData(response.data);
      }
    } catch (err) {
      console.error('Error fetching chart:', err);
    } finally {
      setIsChartLoading(false);
    }
  }, [rescueId]);

  // Submit vote
  const submitVote = useCallback(async () => {
    if (!selectedAnswer || !rescueId || hasVoted) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await submitSupportAnswer(rescueId, selectedAnswer);
      if (response.success) {
        setHasVoted(true);
        // Refresh chart after voting
        await fetchChart();
      } else {
        setError(response.message || 'Không thể gửi phiếu bầu');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi không xác định');
      console.error('Error submitting vote:', err);
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedAnswer, rescueId, hasVoted, fetchChart]);

  // Actions
  const refreshChart = useCallback(async () => {
    await fetchChart();
  }, [fetchChart]);

  const refreshQuestion = useCallback(async () => {
    await fetchQuestion();
  }, [fetchQuestion]);

  const reset = useCallback(() => {
    setQuestion(null);
    setChartData([]);
    setSelectedAnswer('');
    setHasVoted(false);
    setError(null);
  }, []);

  // Effects
  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

  useEffect(() => {
    if (!autoRefreshChart || !rescueId) return;

    const interval = setInterval(() => {
      fetchChart();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefreshChart, rescueId, refreshInterval, fetchChart]);

  return {
    // State
    question,
    chartData,
    selectedAnswer,
    isLoading,
    isSubmitting,
    isChartLoading,
    hasVoted,
    error,
    
    // Actions
    setSelectedAnswer,
    submitVote,
    refreshChart,
    refreshQuestion,
    reset
  };
};