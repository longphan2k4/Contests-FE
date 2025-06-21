import { useState, useCallback, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { questionDetailService } from '../services';
import type { QuestionDetail } from '../types';
import { useToast } from '../../../../contexts/toastContext';
import axios from 'axios';
import { useStableObject } from '../../../../hooks/useStableCallback';
import { useDebounceApi } from '../../../../hooks/useDebounceApi';

interface Filter {
  page: number;
  limit: number;
  isActive?: boolean;
  questionType?: string;
  difficulty?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

interface QuestionDetailFormValues {
  questionId: number;
  questionOrder: number;
  isActive: boolean;
  questionPackageId?: number;
}

interface FilterStats {
  totalQuestions: number;
  filteredQuestions: number;
  appliedFilters: {
    questionType?: string;
    difficulty?: string;
    isActive?: boolean;
    search?: string;
  };
}

export const useQuestionDetails = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const { showToast } = useToast();
  
  const [questionDetails, setQuestionDetails] = useState<QuestionDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filterStats, setFilterStats] = useState<FilterStats | null>(null);
  const [packageName, setPackageName] = useState<string | null>(null);
  
  const [filter, setFilter] = useState<Filter>({
    page: 1,
    limit: 10,
    isActive: undefined,
    questionType: '',
    difficulty: '',
    sortBy: 'questionOrder',
    sortOrder: 'asc',
    search: ''
  });
  
  const stableFilter = useStableObject(filter);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchQuestionDetailsInternal = useCallback(async (options?: { signal?: AbortSignal }) => {
    if (!packageId) {
      setError('Không tìm thấy ID gói câu hỏi');
      return;
    }
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    const signal = options?.signal || abortControllerRef.current.signal;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await questionDetailService.getQuestionDetailsByPackage(
        Number(packageId),
        {
          page: stableFilter.page,
          limit: stableFilter.limit,
          isActive: stableFilter.isActive,
          questionType: stableFilter.questionType,
          difficulty: stableFilter.difficulty,
          search: stableFilter.search,
          sortBy: stableFilter.sortBy,
          sortOrder: stableFilter.sortOrder
        }
      );

      if (signal.aborted) return;

      if (response.data) {
        const questionData = response.data.questions || [];
        setQuestionDetails(questionData);
        setPackageName(response.data.packageInfo?.name || null);
        setTotal(response.pagination?.total || 0);
        setTotalPages(response.pagination?.totalPages || 0);
        if (response.filters) {
          setFilterStats({
            totalQuestions: response.data.total || 0,
            filteredQuestions: questionData.length,
            appliedFilters: response.filters.appliedFilters || {
              questionType: stableFilter.questionType,
              difficulty: stableFilter.difficulty,
              isActive: stableFilter.isActive,
              search: stableFilter.search
            }
          });
        }
      } else {
        setQuestionDetails([]);
        setError('Không có dữ liệu câu hỏi');
        setTotal(0);
        setTotalPages(0);
        setFilterStats(null);
      }
    } catch (error: unknown) {
      if (error instanceof Error && (error.name === 'AbortError' || signal.aborted)) {
        return;
      }
      
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setError(error.response.data.message);
        showToast(error.response.data.message, 'error');
      } else {
        setError('Có lỗi xảy ra khi tải danh sách câu hỏi');
        showToast('Có lỗi xảy ra khi tải danh sách câu hỏi', 'error');
      }
      setQuestionDetails([]);
      setTotal(0);
      setTotalPages(0);
      setFilterStats(null);
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  }, [packageId, stableFilter, showToast]);

  const [debouncedFetch, cancelFetch] = useDebounceApi(fetchQuestionDetailsInternal, { delay: 300 });

  const fetchQuestionDetails = useCallback(async () => {
    return debouncedFetch();
  }, [debouncedFetch]);

  useEffect(() => {
    return () => {
      cancelFetch();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [cancelFetch]);

  useEffect(() => {
    if (packageId) {
      debouncedFetch();
    }
  }, [packageId, stableFilter, debouncedFetch]);

  const updateFilter = useCallback((newFilter: Partial<Filter>) => {
    setFilter(prev => ({
      ...prev,
      ...newFilter
    }));
  }, []);

  const handleDelete = async (record: QuestionDetail) => {
    try {
      if (!record.questionPackageId) {
        throw new Error('Không tìm thấy ID gói câu hỏi');
      }
      await questionDetailService.hardDeleteQuestionDetail(record.questionId, record.questionPackageId);
      showToast('Xóa câu hỏi thành công', 'success');
      if (questionDetails.length === 1 && filter.page > 1) {
        updateFilter({ page: filter.page - 1 });
      } else {
        fetchQuestionDetails();
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        showToast(error.response.data.message, 'error');
      } else {
        showToast('Có lỗi xảy ra khi xóa câu hỏi', 'error');
      }
    }
  };

  const handleDeleteSelected = async () => {
    try {
      if (selectedIds.size === 0) {
        showToast('Vui lòng chọn ít nhất một câu hỏi để xóa', 'error');
        return;
      }

      const items = Array.from(selectedIds).map(id => {
        const questionDetail = questionDetails.find(q => q.questionId === id);
        if (!questionDetail) {
          throw new Error(`Không tìm thấy câu hỏi có ID: ${id}`);
        }
        if (!questionDetail.questionPackageId) {
          throw new Error(`Không tìm thấy ID gói câu hỏi cho câu hỏi có ID: ${id}`);
        }
        return {
          questionId: questionDetail.questionId,
          questionPackageId: questionDetail.questionPackageId
        };
      });

      await questionDetailService.batchDelete({ items });
      showToast(`Đã xóa ${selectedIds.size} câu hỏi thành công`, 'success');
      setSelectedIds(new Set());
      
      const remainingItems = questionDetails.length - selectedIds.size;
      if (remainingItems <= 0 && filter.page > 1) {
        updateFilter({ page: filter.page - 1 });
      } else {
        fetchQuestionDetails();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        if (errorData?.data?.failedItems && Array.isArray(errorData.data.failedItems)) {
          errorData.data.failedItems.forEach((item: { questionId: number; questionPackageId: number; reason: string }) => {
            const found = questionDetails.find(
              q => q.questionId === item.questionId && q.questionPackageId === item.questionPackageId
            );
            showToast(`Câu hỏi số ${found?.questionOrder ?? '-'}: ${item.reason}`, 'error');
          });
        } else if (errorData?.message) {
          showToast(errorData.message, 'error');
        } else if (errorData?.errors) {
          const errorMessages = errorData.errors.map((err: { message: string }) => err.message).join('\n');
          showToast(errorMessages, 'error');
        } else {
          showToast('Có lỗi xảy ra khi xóa các câu hỏi đã chọn', 'error');
        }
      } else if (error instanceof Error) {
        showToast(error.message, 'error');
      } else {
        showToast('Có lỗi xảy ra khi xóa các câu hỏi đã chọn', 'error');
      }
    }
  };

  const handleCreateOrUpdate = async (values: QuestionDetailFormValues) => {
    try {
      if (values.questionId && values.questionPackageId) {
        await questionDetailService.updateQuestionDetail(
          values.questionId,
          values.questionPackageId,
          {
            questionOrder: values.questionOrder,
            isActive: values.isActive
          }
        );
        showToast(`Cập nhật câu hỏi thành công`, 'success');
      } else if (values.questionId) {
        await questionDetailService.createQuestionDetail({
          questionId: values.questionId,
          questionPackageId: Number(packageId),
          questionOrder: values.questionOrder,
          isActive: values.isActive
        });
        showToast('Thêm câu hỏi thành công', 'success');
      } else {
        throw new Error('Thiếu thông tin câu hỏi');
      }
      return true;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        showToast(error.response.data.message, 'error');
      } else {
        showToast('Có lỗi xảy ra khi lưu câu hỏi', 'error');
      }
      return false;
    }
  };

  return {
    questionDetails,
    loading,
    error,
    selectedIds,
    setSelectedIds,
    total,
    totalPages,
    filter,
    updateFilter,
    handleDelete,
    handleDeleteSelected,
    handleCreateOrUpdate,
    fetchQuestionDetails,
    filterStats,
    packageName
  };
}; 