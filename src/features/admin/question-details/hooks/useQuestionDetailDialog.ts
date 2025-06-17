import { useState, useEffect, useCallback } from 'react';
import type { AvailableQuestion } from '../types';
import { questionDetailService } from '../services/questionDetailService';

export const useQuestionDetailDialog = (open: boolean, questionPackageId: number) => {
  const [questions, setQuestions] = useState<AvailableQuestion[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [selectedQuestions, setSelectedQuestions] = useState<AvailableQuestion[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<AvailableQuestion | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ difficulty: '', topic: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchAvailableQuestions = useCallback(async () => {
    if (!questionPackageId) return;
    
    setIsLoading(true);
    try {
      console.debug('🔍 [useQuestionDetailDialog] Fetching available questions', {
        packageId: questionPackageId,
        filters,
        searchTerm,
        page: currentPage,
        limit: pageSize
      });
      
      const response = await questionDetailService.getAvailableQuestions(questionPackageId, {
        page: currentPage,
        limit: pageSize,
        isActive: true,
        difficulty: filters.difficulty || undefined,
        questionType: filters.topic || undefined,
        search: searchTerm || undefined
      });
      
      if (response.data?.questions) {
        console.debug('✅ [useQuestionDetailDialog] Available questions fetched:', {
          count: response.data.questions.length,
          total: response.pagination?.total
        });
        
        setQuestions(response.data.questions);
        
        if (response.pagination) {
          setTotal(response.pagination.total || 0);
        }
      } else {
        console.debug('⚠️ [useQuestionDetailDialog] No available questions found');
        setQuestions([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('❌ [useQuestionDetailDialog] Error fetching available questions:', error);
      setQuestions([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [questionPackageId, filters, searchTerm, currentPage, pageSize]);

  // Reset state khi dialog mở/đóng
  useEffect(() => {
    if (!open) {
      // Reset state khi dialog đóng
      setQuestions([]);
      setSelectedIds(new Set());
      setSelectedQuestions([]);
      setSearchTerm('');
      setFilters({ difficulty: '', topic: '' });
    } else if (questionPackageId) {
      // Nếu dialog mở và có packageId, fetch dữ liệu
      fetchAvailableQuestions();
    }
  }, [open, questionPackageId, fetchAvailableQuestions]);

  // Cập nhật danh sách câu hỏi đã chọn khi selectedIds thay đổi
  useEffect(() => {
    const selected = questions.filter(q => selectedIds.has(q.id));
    console.debug('✅ [useQuestionDetailDialog] Selected questions updated:', {
      selectedIds: Array.from(selectedIds),
      selectedCount: selected.length
    });
    setSelectedQuestions(selected);
  }, [selectedIds, questions]);

  // Fetch lại câu hỏi khi filters hoặc searchTerm thay đổi
  useEffect(() => {
    if (open && questionPackageId) {
      console.debug('🔄 [useQuestionDetailDialog] Filters changed, fetching new data:', {
        searchTerm,
        filters
      });
      fetchAvailableQuestions();
    }
  }, [filters, searchTerm, open, questionPackageId, currentPage, pageSize, fetchAvailableQuestions]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.debug('🔍 [useQuestionDetailDialog] Search term changed:', e.target.value);
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    console.debug('🔍 [useQuestionDetailDialog] Search triggered:', searchTerm);
    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
    fetchAvailableQuestions();
  };

  const handleFilterChange = (name: string, value: string) => {
    console.debug('🔄 [useQuestionDetailDialog] Filter changed:', { name, value });
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset về trang 1 khi thay đổi bộ lọc
  };

  const handleSelectQuestion = (question: AvailableQuestion) => {
    console.debug('✅ [useQuestionDetailDialog] Question selected:', question);
    setSelectedQuestion(question);
  };

  const handleSelectAll = (checked: boolean) => {
    console.debug('✅ [useQuestionDetailDialog] Select all:', {
      checked,
      count: questions.length
    });
    if (checked) {
      setSelectedIds(new Set(questions.map(q => q.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    console.debug('✅ [useQuestionDetailDialog] Select one:', { id, checked });
    const newSelectedIds = new Set(selectedIds);
    if (checked) {
      newSelectedIds.add(id);
    } else {
      newSelectedIds.delete(id);
    }
    setSelectedIds(newSelectedIds);
  };

  const handleRemoveSelected = (id: number) => {
    console.debug('❌ [useQuestionDetailDialog] Remove selected:', id);
    const newSelectedIds = new Set(selectedIds);
    newSelectedIds.delete(id);
    setSelectedIds(newSelectedIds);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      console.debug('🔍 [useQuestionDetailDialog] Search triggered by Enter key');
      e.preventDefault();
      handleSearch();
    }
  };

  const toggleFilters = () => {
    console.debug('🔄 [useQuestionDetailDialog] Toggle filters');
    setShowFilters(prev => !prev);
  };

  const handlePageChange = (page: number) => {
    console.debug('🔄 [useQuestionDetailDialog] Page changed:', page);
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    console.debug('🔄 [useQuestionDetailDialog] Page size changed:', size);
    setPageSize(size);
    setCurrentPage(1); // Reset về trang 1 khi thay đổi kích thước trang
  };

  return {
    questions,
    loading: isLoading,
    selectedQuestion,
    selectedIds,
    selectedQuestions,
    searchTerm,
    filters,
    showFilters,
    topics: [], // Trả về mảng rỗng vì không còn sử dụng topics
    total,
    currentPage,
    pageSize,
    handleSearchChange,
    handleSearch,
    handleFilterChange,
    handleSelectQuestion,
    handleSelectAll,
    handleSelectOne,
    handleRemoveSelected,
    handleKeyPress,
    toggleFilters,
    handlePageChange,
    handlePageSizeChange
  };
}; 