import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import type { Question, BatchDeleteResponseData } from '../types';
import { questionService } from '../services/questionService';
import { useSnackbar } from 'notistack';

interface QuestionFormData {
  intro?: string;
  defaultTime: number;
  questionType: 'multiple_choice' | 'essay';
  content: string;
  options?: string[] | null;
  correctAnswer: string;
  score: number;
  difficulty: 'Alpha' | 'Beta' | 'Rc' | 'Gold';
  explanation?: string;
  questionTopicId: number;
  isActive: boolean;
}

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
      const questionData: QuestionFormData = {
        intro: formData.get('intro') as string,
        defaultTime: Number(formData.get('defaultTime')),
        questionType: formData.get('questionType') as 'multiple_choice' | 'essay',
        content: formData.get('content') as string,
        options: formData.get('options') ? JSON.parse(formData.get('options') as string) : null,
        correctAnswer: formData.get('correctAnswer') as string,
        score: Number(formData.get('score')),
        difficulty: formData.get('difficulty') as 'Alpha' | 'Beta' | 'Rc' | 'Gold',
        explanation: formData.get('explanation') as string,
        questionTopicId: Number(formData.get('questionTopicId')),
        isActive: formData.get('isActive') === 'true'
      };
      console.log('questionUpdate',questionData)
      return questionService.updateQuestion(id, questionData);
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