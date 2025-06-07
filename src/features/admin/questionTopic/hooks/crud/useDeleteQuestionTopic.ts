import { useState, useCallback } from 'react';
import { deleteQuestionTopic } from '../../services/questionTopicService';
import { useNotification } from '../../../../../hooks';

export const useDeleteQuestionTopic = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { showSuccessNotification, showErrorNotification } = useNotification();

  const handleDelete = useCallback(async (id: number) => {
    try {
      setIsDeleting(true);
      await deleteQuestionTopic([id]);
      showSuccessNotification('Xóa chủ đề thành công');
      return true;
    } catch (error) {
      showErrorNotification('Có lỗi xảy ra khi xóa chủ đề');
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, [showSuccessNotification, showErrorNotification]);

  return {
    isDeleting,
    handleDelete
  };
}; 