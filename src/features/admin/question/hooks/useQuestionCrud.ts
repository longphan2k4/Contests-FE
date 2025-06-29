import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import type { Question, BatchDeleteResponseData } from '../types';
import { questionService } from '../services/questionService';
import { useToast } from '../../../../contexts/toastContext';
import { AxiosError } from 'axios';

interface ApiErrorResponse {
  success: false;
  message: string;
  code: string;
}

export const useQuestionCrud = () => {
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const createMutation = useMutation({
    mutationFn: (formData: FormData) => {
      return questionService.createQuestion(formData);
    },
    onSuccess: (data) => {
      showToast(data.message, 'success');
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      setDialogOpen(false);
      
      // Reset selected question để đảm bảo form sẽ được clear khi mở lại
      setSelectedQuestion(null);
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      showToast(error.response?.data?.message || 'Có lỗi xảy ra khi tạo câu hỏi', 'error');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) => {
      return questionService.updateQuestion(id, formData);
    },
    onSuccess: (data) => {
      showToast(data.message, 'success');
      
      // Invalidate và refetch data ngay lập tức để có data mới
      queryClient.invalidateQueries({ 
        queryKey: ['questions']
      });
      
      if (selectedQuestion) {
        
        // Invalidate query cho question detail cụ thể
        queryClient.invalidateQueries({ 
          queryKey: ['question', selectedQuestion.id]
        });
        
        // Set data mới vào cache để component có thể sử dụng ngay
        if (data.data) {
          
          queryClient.setQueryData(['question', selectedQuestion.id], data.data);
          
          // Cập nhật selectedQuestion với data mới
          setSelectedQuestion(data.data);
        }
      } else {
        showToast('Có lỗi xảy ra khi cập nhật câu hỏi', 'error');
      }
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      showToast(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật câu hỏi', 'error');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      return questionService.deleteQuestion(id);
    },
    onSuccess: (data) => {
      showToast(data.message, 'success');
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      showToast(error.response?.data?.message || 'Có lỗi xảy ra khi xóa câu hỏi', 'error');
    }
  });

  const batchDeleteMutation = useMutation({
    mutationFn: (ids: number[]) => {
      return questionService.batchDelete(ids);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      showToast(error.response?.data?.message || 'Có lỗi xảy ra khi xóa các câu hỏi đã chọn', 'error');
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
      showToast(data.message, 'success');
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      showToast(error.response?.data?.message || 'Có lỗi xảy ra khi tải lên media', 'error');
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
    // Reset selectedQuestion sau khi đóng dialog để tránh xung đột dữ liệu
    setTimeout(() => {
      if (dialogMode === 'create') {
        setSelectedQuestion(null);
      }
    }, 200);
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      if (dialogMode === 'create') {
        await createMutation.mutateAsync(formData);
        // Dialog sẽ được đóng trong onSuccess của createMutation
      } else if (dialogMode === 'edit' && selectedQuestion) {
        
        // Đợi update mutation hoàn thành
        await updateMutation.mutateAsync({ id: selectedQuestion.id, formData });
        
        
        // Chỉ đóng dialog sau khi mutation thành công
        // Đợi một chút để UI có thể update với data mới
        setTimeout(() => {
          setDialogOpen(false);
        }, 300);
      }
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Lỗi khi gửi dữ liệu câu hỏi');
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