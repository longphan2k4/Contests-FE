import { useState, useEffect } from 'react';
import type { Question, Topic, Filters, QuestionDetail } from '../types';
import { questionService } from '../services/questionService';
import { questionDetailService } from '../services/questionDetailService';
import { useQuestionDetailStore } from '../stores/questionDetailStore';

export const useQuestionDetailDialog = (open: boolean, questionPackageId: number) => {
  console.debug('🔄 [useQuestionDetailDialog] Hook được gọi lại với:', { open, questionPackageId });
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Filters>({
    difficulty: '',
    topic: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);

  // Lấy danh sách ID từ store
  const { getExistingQuestionIds, setExistingQuestionIds } = useQuestionDetailStore();
  const existingQuestionIds = getExistingQuestionIds(questionPackageId);
  console.debug('📦 [useQuestionDetailDialog] ID câu hỏi từ store:', {
    packageId: questionPackageId,
    existingIds: Array.from(existingQuestionIds)
  });

  // Reset state khi dialog mở/đóng
  useEffect(() => {
    console.debug('🔄 [useQuestionDetailDialog] Dialog state changed:', { open });
    if (!open) {
      console.debug('🧹 [useQuestionDetailDialog] Resetting state');
      setSelectedIds(new Set());
      setSelectedQuestions([]);
      setSearchTerm('');
      setFilters({ difficulty: '', topic: '' });
    }
  }, [open]);

  // Fetch dữ liệu khi dialog mở
  useEffect(() => {
    const fetchInitialData = async () => {
      if (open && questionPackageId) {
        console.debug('🚀 [useQuestionDetailDialog] Starting initial data fetch', {
          packageId: questionPackageId,
          existingIdsCount: existingQuestionIds.size
        });
        
        setLoading(true);
        try {
          // Nếu chưa có dữ liệu trong store thì fetch mới
          if (existingQuestionIds.size === 0) {
            await fetchExistingQuestions();
          } else {
            console.debug('💾 [useQuestionDetailDialog] Using cached data:', Array.from(existingQuestionIds));
          }
          // Fetch danh sách câu hỏi và chủ đề
          await Promise.all([fetchQuestions(), fetchTopics()]);
        } catch (error) {
          console.error('❌ [useQuestionDetailDialog] Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchInitialData();
  }, [open, questionPackageId, existingQuestionIds.size]);

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
    const fetchFilteredData = async () => {
      if (open && questionPackageId) {
        console.debug('🔄 [useQuestionDetailDialog] Filters changed, fetching new data:', {
          searchTerm,
          filters
        });
        await fetchQuestions();
      }
    };

    fetchFilteredData();
  }, [filters, searchTerm, open, questionPackageId]);

  const fetchExistingQuestions = async () => {
    try {
      console.log('🔍 Đang fetch danh sách câu hỏi hiện có trong gói:', questionPackageId);
      
      let allQuestions: QuestionDetail[] = [];
      let currentPage = 1;
      let hasNextPage = true;
      const limit = 10;

      while (hasNextPage) {
        console.log(`📄 Đang fetch trang ${currentPage}...`);
        
        const response = await questionDetailService.getQuestionsByPackage(questionPackageId, {
          isActive: true,
          page: currentPage,
          limit
        });
        
        if (response.data?.questions) {
          allQuestions = [...allQuestions, ...response.data.questions];
          console.log(`✅ Đã fetch trang ${currentPage}:`, {
            pageQuestions: response.data.questions.length,
            totalSoFar: allQuestions.length
          });

          // Kiểm tra xem còn trang tiếp theo không
          hasNextPage = response.data.questions.length === limit;
          currentPage++;
        } else {
          hasNextPage = false;
        }
      }

      if (allQuestions.length > 0) {
        const questionIds = allQuestions.map(q => q.questionId);
        console.log('📦 Kết quả fetch toàn bộ câu hỏi:', {
          totalPages: currentPage - 1,
          totalQuestions: questionIds.length,
          questions: allQuestions.map(q => ({
            id: q.questionId,
            order: q.questionOrder
          }))
        });
        
        setExistingQuestionIds(questionPackageId, questionIds);
        return new Set(questionIds);
      }
      
      console.log('⚠️ Không tìm thấy câu hỏi nào trong gói');
      return new Set<number>();
    } catch (error) {
      console.error('❌ Lỗi khi fetch câu hỏi:', error);
      return new Set<number>();
    }
  };

  const fetchQuestions = async () => {
    try {
      console.debug('🔍 [useQuestionDetailDialog] Fetching all questions', {
        filters,
        searchTerm
      });
      
      const response = await questionService.getQuestions({
        page: 1,
        limit: 100,
        difficulty: filters.difficulty || undefined,
        topicId: filters.topic ? Number(filters.topic) : undefined,
        search: searchTerm || undefined
      });
      
      if (response.data?.questions) {
        const allQuestions = response.data.questions;
        console.debug('📊 [useQuestionDetailDialog] Questions fetched:', {
          total: allQuestions.length,
          existingIds: Array.from(existingQuestionIds)
        });
        
        const filteredQuestions = allQuestions.filter(
          question => !existingQuestionIds.has(question.id)
        );
        
        console.debug('✅ [useQuestionDetailDialog] Questions filtered:', {
          before: allQuestions.length,
          after: filteredQuestions.length,
          removed: allQuestions.length - filteredQuestions.length
        });
        
        setQuestions(filteredQuestions);
      } else {
        console.debug('⚠️ [useQuestionDetailDialog] No questions found');
        setQuestions([]);
      }
    } catch (error) {
      console.error('❌ [useQuestionDetailDialog] Error fetching questions:', error);
      setQuestions([]);
    }
  };

  const fetchTopics = async () => {
    try {
      console.debug('🔍 [useQuestionDetailDialog] Fetching topics');
      const response = await questionService.getTopics();
      if (response.data) {
        console.debug('✅ [useQuestionDetailDialog] Topics fetched:', {
          count: response.data.length
        });
        setTopics(response.data);
      } else {
        console.debug('⚠️ [useQuestionDetailDialog] No topics found');
        setTopics([]);
      }
    } catch (error) {
      console.error('❌ [useQuestionDetailDialog] Error fetching topics:', error);
      setTopics([]);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.debug('🔍 [useQuestionDetailDialog] Search term changed:', e.target.value);
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    console.debug('🔍 [useQuestionDetailDialog] Search triggered:', searchTerm);
    fetchQuestions();
  };

  const handleFilterChange = (name: string, value: string) => {
    console.debug('🔄 [useQuestionDetailDialog] Filter changed:', { name, value });
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectQuestion = (question: Question) => {
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

  return {
    questions,
    loading,
    selectedQuestion,
    selectedIds,
    selectedQuestions,
    searchTerm,
    filters,
    showFilters,
    topics,
    handleSearchChange,
    handleSearch,
    handleFilterChange,
    handleSelectQuestion,
    handleSelectAll,
    handleSelectOne,
    handleRemoveSelected,
    handleKeyPress,
    toggleFilters
  };
}; 