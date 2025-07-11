export interface QuestionDetail {
  questionId: number;
  questionPackageId: number;
  questionOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  uniqueId?: string;
  question?: {
    id: number;
    title?: string;
    plainText?: string;
    content?: string;
    questionType?: 'multiple_choice' | 'essay' | string;
    difficulty?: 'Alpha' | 'Beta' | 'Gold' | string;
  };
  questionPackage?: {
    id: number;
    name: string;
    description?: string;
  };
}

export interface QuestionDetailResponse {
  success: boolean;
  message: string;
  data: QuestionDetail[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
  };
  timestamp: string;
}

export interface QuestionDetailStats {
  overview?: {
    totalQuestionDetails: number;
    activeQuestionDetails: number;
    inactiveQuestionDetails: number;
    totalQuestions: number;
    totalPackages: number;
  };
  packageStats?: Array<{
    questionPackageId: number;
    packageName: string;
    totalQuestions: number;
    activeQuestions: number;
    inactiveQuestions: number;
  }>;
  questionStats?: Array<{
    questionId: number;
    questionTitle: string;
    totalPackages: number;
    activeInPackages: number;
    inactiveInPackages: number;
  }>;
  // Thuộc tính cũ giữ lại để đảm bảo tương thích
  totalQuestionDetails?: number;
  activeQuestionDetails?: number;
  uniqueQuestions?: number;
  uniquePackages?: number;
  averageQuestionsPerPackage?: number;
}

export interface QuestionDetailStatsResponse {
  success: boolean;
  message: string;
  data: QuestionDetailStats;
  timestamp: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    currentPage?: number;
    page?: number;
    totalPages: number;
    totalItems?: number;
    total?: number;
    itemsPerPage?: number;
    limit?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
  filters?: {
    totalQuestions: number;
    filteredQuestions: number;
    appliedFilters: {
      questionType?: string;
      difficulty?: string;
      isActive?: boolean;
      search?: string;
    };
  };
  timestamp: string;
}

export interface ReorderRequest {
  questionPackageId: number;
  reorders: Array<{
    questionId: number;
    newOrder: number;
  }>;
}

export interface BulkCreateResponse {
  created: QuestionDetail[];
  summary: {
    totalRequested: number;
    successful: number;
    failed: number;
  };
}

export interface ReorderResponse {
  updated: QuestionDetail[];
  summary: {
    totalRequested: number;
    successful: number;
    failed: number;
  };
}

// Định nghĩa interface cho cấu trúc phản hồi của API lấy danh sách câu hỏi theo gói
export interface QuestionPackageResponse {
  packageInfo: {
    id: number;
    name: string;
    description?: string;
  };
  questions: QuestionDetail[];
}

export interface Question {
  id: number;
  content: string;
  plainText?: string;
  questionType: 'multiple_choice' | 'essay' | string;
  difficulty: 'Alpha' | 'Beta' | 'Gold' | string;
  topicId?: number;
  questionTopicId?: number;
}

export interface Topic {
  id: number;
  name: string;
}

export interface SearchParams {
  page?: number;
  limit?: number;
  difficulty?: string;
  topicId?: number;
  search?: string;
}

export interface Filters {
  difficulty: string;
  topic: string;
}

export interface QuestionDetailDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  editingQuestion: QuestionDetail | null;
  questionPackageId: number;
  totalQuestions: number;
  onSuccess?: () => void;
}

export interface AvailableQuestion {
  id: number;
  content: string;
  questionType: 'multiple_choice' | 'essay' | string;
  difficulty: 'Alpha' | 'Beta' | 'Gold' | string;
  defaultTime: number;
  score: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AvailableQuestionsResponse {
  packageInfo: {
    id: number;
    name: string;
  };
  questions: AvailableQuestion[];
} 