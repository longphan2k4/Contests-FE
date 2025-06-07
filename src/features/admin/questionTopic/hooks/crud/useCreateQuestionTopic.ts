import { useState, useCallback } from 'react';
import { createQuestionTopic } from '../../services/questionTopicService';
import type { CreateQuestionTopicInput } from '../../schemas/questionTopic.schema';

export const useCreateQuestionTopic = () => {
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = useCallback(async (data: CreateQuestionTopicInput) => {
    try {
      setIsCreating(true);
      await createQuestionTopic(data);
      return true;
    } catch (error) {
      throw error;
    } finally {
      setIsCreating(false);
    }
  }, []);

  return {
    isCreating,
    handleCreate
  };
}; 