import { useState, useCallback } from 'react';
import { updateQuestionTopic } from '../../services/questionTopicService';
import type { UpdateQuestionTopicInput } from '../../schemas/questionTopic.schema';

export const useUpdateQuestionTopic = () => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = useCallback(async (id: number, data: UpdateQuestionTopicInput) => {
    try {
      setIsUpdating(true);
      await updateQuestionTopic(id, data);
      return true;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  return {
    isUpdating,
    handleUpdate
  };
}; 