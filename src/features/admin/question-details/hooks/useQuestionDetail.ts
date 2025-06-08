import { useState, useEffect, useCallback } from 'react';
import { getQuestionDetailById } from '../services/questionDetailService';
import type { QuestionDetail } from '../types/questionDetail';

/**
 * Hook để lấy thông tin chi tiết của một cặp câu hỏi-gói
 */
export const useQuestionDetail = (questionId?: number, questionPackageId?: number) => {
  const [questionDetail, setQuestionDetail] = useState<QuestionDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestionDetail = useCallback(async () => {
    if (!questionId || !questionPackageId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await getQuestionDetailById(questionId, questionPackageId);
      setQuestionDetail(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải thông tin chi tiết câu hỏi');
      setQuestionDetail(null);
    } finally {
      setLoading(false);
    }
  }, [questionId, questionPackageId]);

  useEffect(() => {
    fetchQuestionDetail();
  }, [fetchQuestionDetail]);

  return { 
    questionDetail, 
    loading, 
    error, 
    refresh: fetchQuestionDetail 
  };
}; 