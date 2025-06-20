import { useState, useEffect } from 'react';
import { fetchQuestions } from '../services/questionService';
import type { Question } from '../types';

export const useQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const apiQuestions = await fetchQuestions();
        const mappedQuestions: Question[] = apiQuestions.map((q) => ({
          id: q.id,
          type: q.questionType === 'multiple_choice' ? 'multiple-choice' : 'open-ended',
          text: q.content,
          intro: q.intro,
          options: q.options,
          correctAnswer: q.correctAnswer,
          questionMedia: q.questionMedia,
          mediaAnswer: q.mediaAnswer,
          explanation: q.explanation,
          defaultTime: q.defaultTime,
          score: q.score,
          difficulty: q.difficulty,
          topic: q.questionTopic.name,
          additionalNotes: q.questionDetails.additionalNotes,
        }));
        setQuestions(mappedQuestions);
        setIsLoading(false);
      } catch (err) {
        setError('Không thể tải câu hỏi');
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, []);

  return { questions, isLoading, error };
};