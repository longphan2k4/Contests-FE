import { useState, useCallback } from 'react';
import { deleteMultipleQuestionTopics } from '../../services/questionTopicService';
import { useNotification } from '../../../../../hooks';

export const useDeleteQuestionTopic = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { showSuccessNotification, showErrorNotification } = useNotification();

  const handleDelete = useCallback(async (id: number) => {
    try {
      setIsDeleting(true);
      const response = await deleteMultipleQuestionTopics([id]);
      if (response.data.successful > 0) {
        showSuccessNotification(response.message);
        return true;
      } else {
        showErrorNotification(response.message);
        return false;
      }
    } catch (error) {
      console.log(error);
      showErrorNotification('Có lỗi xảy ra khi xóa chủ đề');
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, [showSuccessNotification, showErrorNotification]);

  const handleDeleteSelected = useCallback(async (ids: number[]) => {
    try {

      setIsDeleting(true);
      const response = await deleteMultipleQuestionTopics(ids);
      console.log(response);
      if (response.success) {
        showSuccessNotification(response.message);
        return true;
      } else {
        showErrorNotification(response.message);
        return false;
      }
    } catch (error) {
      console.log(error);
      showErrorNotification('Có lỗi xảy ra khi xóa các chủ đề đã chọn');
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, [showSuccessNotification, showErrorNotification]);

  return {
    isDeleting,
    handleDelete,
    handleDeleteSelected
  };
}; 