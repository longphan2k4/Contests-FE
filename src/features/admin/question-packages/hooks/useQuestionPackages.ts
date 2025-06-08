import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { questionPackageService } from '../services/questionPackageService';
import type { QuestionPackageFormData, QuestionPackageFilter } from '../types/questionPackage';
import { toast } from 'react-toastify';
import type { AxiosError } from 'axios';

interface ApiErrorResponse {
  message: string;
}

export const useQuestionPackages = (initialFilter: QuestionPackageFilter = {}) => {
  const [filter, setFilter] = useState<QuestionPackageFilter>({
    page: 1,
    limit: 10,
    ...initialFilter
  });

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['questionPackages', filter],
    queryFn: () => questionPackageService.getAll(filter)
  });

  const createMutation = useMutation({
    mutationFn: (data: QuestionPackageFormData) => questionPackageService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questionPackages'] });
      toast.success('Tạo gói câu hỏi thành công');
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: QuestionPackageFormData }) =>
      questionPackageService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questionPackages'] });
      toast.success('Cập nhật gói câu hỏi thành công');
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => questionPackageService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questionPackages'] });
      toast.success('Xóa gói câu hỏi thành công');
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      questionPackageService.update(id, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questionPackages'] });
      toast.success('Cập nhật trạng thái thành công');
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  });

  const updateFilter = useCallback((newFilter: Partial<QuestionPackageFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
  }, []);

  return {
    questionPackages: data?.data || [],
    pagination: data?.pagination,
    loading: isLoading,
    error,
    filter,
    updateFilter,
    create: createMutation.mutate,
    update: updateMutation.mutate,
    delete: deleteMutation.mutate,
    updateStatus: updateStatusMutation.mutate
  };
}; 