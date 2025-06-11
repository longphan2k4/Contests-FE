import { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { questionDetailService } from '../services';
import type { QuestionDetail } from '../types';
import { useNotification } from '../../../../contexts/NotificationContext';
import axios from 'axios';

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

interface ApiError {
  message: string;
  errors?: Array<{
    message: string;
    field?: string;
  }>;
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
  const [questionDetails, setQuestionDetails] = useState<QuestionDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filterStats, setFilterStats] = useState<FilterStats | null>(null);
  const [filter, setFilter] = useState<Filter>({
    page: 1,
    limit: 10,
    isActive: true,
    sortBy: 'questionOrder',
    sortOrder: 'asc'
  });

  const { showSuccessNotification, showErrorNotification } = useNotification();

  const updateFilter = useCallback((newFilter: Partial<Filter>) => {
    setFilter(prevFilter => ({ ...prevFilter, ...newFilter }));
  }, []);

  const fetchQuestionDetails = useCallback(async () => {
    if (!packageId) {
      setError('Không tìm thấy ID gói câu hỏi');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await questionDetailService.getQuestionDetailsByPackage(
        Number(packageId),
        { 
          page: filter.page, 
          limit: filter.limit,
          isActive: filter.isActive,
          questionType: filter.questionType,
          difficulty: filter.difficulty,
          sortBy: filter.sortBy,
          sortOrder: filter.sortOrder,
          search: filter.search,
          includeInactive: filter.isActive === undefined ? true : false
        }
      );
      if (response && response.data) {
        const questionData = response.data.questions || [];
        setQuestionDetails(questionData);
        
        if (response.pagination) {
          setTotal(response.pagination.totalItems || response.pagination.total || 0);
          setTotalPages(response.pagination.totalPages || Math.ceil((response.pagination.total || 0) / filter.limit));
        } else {
          setTotal(questionData.length);
          setTotalPages(1);
        }
        
        if (response.filters) {
          setFilterStats({
            totalQuestions: response.filters.totalQuestions,
            filteredQuestions: response.filters.filteredQuestions,
            appliedFilters: response.filters.appliedFilters
          });
        } else {
          setFilterStats(null);
        }
      } else {
        setQuestionDetails([]);
        setError('Không có dữ liệu câu hỏi');
        setTotal(0);
        setTotalPages(0);
        setFilterStats(null);
      }
    } catch (error) {
      console.error('Error fetching question details:', error);
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setError(error.response.data.message);
        showErrorNotification(error.response.data.message);
      } else {
        setError('Có lỗi xảy ra khi tải danh sách câu hỏi');
        showErrorNotification('Có lỗi xảy ra khi tải danh sách câu hỏi');
      }
      setQuestionDetails([]);
      setTotal(0);
      setTotalPages(0);
      setFilterStats(null);
    } finally {
      setLoading(false);
    }
  }, [packageId, filter, showErrorNotification]);

  useEffect(() => {
    if (packageId) {
      fetchQuestionDetails();
    }
  }, [packageId, fetchQuestionDetails]);

  const handleDelete = async (record: QuestionDetail) => {
    try {
      await questionDetailService.deleteQuestionDetail(record.questionId, record.questionPackageId);
      showSuccessNotification('Xóa câu hỏi thành công');
      fetchQuestionDetails();
    } catch (error) {
      console.error('Error deleting question:', error);
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        showErrorNotification(error.response.data.message);
      } else {
        showErrorNotification('Có lỗi xảy ra khi xóa câu hỏi');
      }
    }
  };

  const handleDeleteSelected = async () => {
    try {
      if (selectedIds.size === 0) {
        showErrorNotification('Vui lòng chọn ít nhất một câu hỏi để xóa');
        return;
      }

      const items = Array.from(selectedIds).map(id => {
        const questionDetail = questionDetails.find(q => q.questionId === id);
        if (!questionDetail) {
          throw new Error(`Không tìm thấy câu hỏi có ID: ${id}`);
        }
        return {
          questionId: questionDetail.questionId,
          questionPackageId: questionDetail.questionPackageId
        };
      });

      await questionDetailService.batchDelete({ items });
      showSuccessNotification(`Đã xóa ${selectedIds.size} câu hỏi thành công`);
      setSelectedIds(new Set());
      fetchQuestionDetails();
    } catch (error) {
      console.error('Error deleting selected questions:', error);
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data as ApiError;
        if (errorData?.message) {
          showErrorNotification(errorData.message);
        } else if (errorData?.errors) {
          // Xử lý trường hợp có nhiều lỗi
          const errorMessages = errorData.errors.map(err => err.message).join('\n');
          showErrorNotification(errorMessages);
        } else {
          showErrorNotification('Có lỗi xảy ra khi xóa các câu hỏi đã chọn');
        }
      } else if (error instanceof Error) {
        showErrorNotification(error.message);
      } else {
        showErrorNotification('Có lỗi xảy ra khi xóa các câu hỏi đã chọn');
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
        showSuccessNotification('Cập nhật câu hỏi thành công');
      } else if (values.questionId) {
        await questionDetailService.createQuestionDetail({
          questionId: values.questionId,
          questionPackageId: Number(packageId),
          questionOrder: values.questionOrder,
          isActive: values.isActive
        });
        showSuccessNotification('Thêm câu hỏi thành công');
      } else {
        throw new Error('Thiếu thông tin câu hỏi');
      }
      fetchQuestionDetails();
      return true;
    } catch (error) {
      console.error('Error saving question:', error);
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        showErrorNotification(error.response.data.message);
      } else {
        showErrorNotification('Có lỗi xảy ra khi lưu câu hỏi');
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
    filterStats
  };
}; 