import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import type { Question, BatchDeleteResponseData } from '../types';
import { questionService } from '../services/questionService';
import { useSnackbar } from 'notistack';

export const useQuestionCrud = () => {
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const createMutation = useMutation({
    mutationFn: (formData: FormData) => {
      return questionService.createQuestion(formData);
    },
    onSuccess: (data) => {
      enqueueSnackbar(data.message, { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) => {
      // Log FormData để debug
      console.log('FormData trước khi gửi:');
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      
      // Tạo FormData mới để tránh thay đổi FormData gốc
      const newFormData = new FormData();
      
      // Copy tất cả các trường từ FormData cũ sang
      for (const [key, value] of formData.entries()) {
        if (key === 'isActive') {
          // Xử lý đặc biệt cho isActive
          const isActiveValue = value === 'true' ? 'true' : 'fasle';
          newFormData.append(key, isActiveValue);
        } else {
          newFormData.append(key, value);
        }
      }
      
      // Log FormData mới để debug
      console.log('FormData sau khi xử lý:');
      for (const [key, value] of newFormData.entries()) {
        console.log(`${key}:`, value);
      }
      
      return questionService.updateQuestion(id, newFormData);
    },
    onSuccess: (data) => {
      enqueueSnackbar(data.message, { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      return questionService.deleteQuestion(id);
    },
    onSuccess: (data) => {
      enqueueSnackbar(data.message, { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    }
  });

  const batchDeleteMutation = useMutation({
    mutationFn: (ids: number[]) => {
      return questionService.batchDelete(ids);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    }
  });

  const uploadMediaMutation = useMutation({
    mutationFn: ({ 
      questionId, 
      mediaType, 
      files 
    }: { 
      questionId: number; 
      mediaType: 'questionMedia' | 'mediaAnswer'; 
      files: File[] 
    }) => {
      return questionService.uploadMedia(questionId, mediaType, files);
    },
    onSuccess: (data) => {
      enqueueSnackbar(data.message, { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
    onError: (error: unknown) => {
      console.error('Lỗi khi upload media:', error);
      enqueueSnackbar('Có lỗi xảy ra khi tải lên media', { variant: 'error' });
    }
  });

  const openCreateDialog = () => {
    setSelectedQuestion(null);
    setDialogMode('create');
    setDialogOpen(true);
  };

  const openEditDialog = (question: Question) => {
    setSelectedQuestion(question);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const openViewDialog = (question: Question) => {
    setSelectedQuestion(question);
    setDialogMode('view');
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const handleSubmit = async (formData: FormData) => {
    if (dialogMode === 'create') {
      await createMutation.mutateAsync(formData);
    } else if (dialogMode === 'edit' && selectedQuestion) {
      await updateMutation.mutateAsync({ id: selectedQuestion.id, formData });
    }
  };

  const handleDelete = async (id: number) => {
    return await deleteMutation.mutateAsync(id);
  };

  const handleBatchDelete = async (ids: number[]): Promise<BatchDeleteResponseData> => {
    return await batchDeleteMutation.mutateAsync(ids);
  };

  const handleUploadMedia = async (
    questionId: number,
    mediaType: 'questionMedia' | 'mediaAnswer',
    files: File[]
  ) => {
    return await uploadMediaMutation.mutateAsync({ questionId, mediaType, files });
  };

  return {
    selectedQuestion,
    dialogOpen,
    dialogMode,
    isLoading: createMutation.isPending || 
               updateMutation.isPending || 
               deleteMutation.isPending || 
               batchDeleteMutation.isPending ||
               uploadMediaMutation.isPending,
    openCreateDialog,
    openEditDialog,
    openViewDialog,
    closeDialog,
    handleSubmit,
    handleDelete,
    handleBatchDelete,
    handleUploadMedia
  };
}; 