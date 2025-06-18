export interface Question {
  id: number;
  content?: string;
  questionType?: string;
  difficulty?: string;
}

export interface QuestionDetail {
  questionId: number;
  questionPackageId: number;
  uniqueId?: string;
  question?: Question;
  questionOrder?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface QuestionDetailDialogProps {
  open: boolean;
  onClose: () => void;
  editingQuestion?: QuestionDetail;
  totalQuestions?: number;
  questionPackageId: number;
  onSuccess?: () => Promise<void>;
}

export interface AvailableQuestion {
  id: number;
  content: string;
  questionType: string;
  difficulty: string;
  questionOrder?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface QuestionDetailStats {
  total: number;
  active: number;
  inactive: number;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
  filters?: {
    questionType?: string[];
    difficulty?: string[];
    isActive?: boolean[];
    appliedFilters?: {
      questionType?: string;
      difficulty?: string;
      isActive?: boolean;
      search?: string;
    };
  };
}

export interface ReorderRequest {
  questionPackageId: number;
  items?: Array<{
    questionId: number;
    questionOrder: number;
    newOrder?: number;
  }>;
  reorders: Array<{
    questionId: number;
    questionOrder: number;
  }>;
}

export interface QuestionPackageResponse {
  items: QuestionDetail[];
  questions: QuestionDetail[];
  packageInfo?: {
    id: number;
    name: string;
    description?: string;
  };
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AvailableQuestionsResponse {
  items: AvailableQuestion[];
  questions: AvailableQuestion[];
  packageInfo?: {
    id: number;
    name: string;
    description?: string;
  };
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BulkCreateResponse {
  created: number;
  failed: number;
  details: Array<{
    questionId: number;
    status: 'success' | 'failed';
    message?: string;
  }>;
}

export interface ReorderResponse {
  updated: number;
  failed: number;
  details: Array<{
    questionId: number;
    status: 'success' | 'failed';
    message?: string;
  }>;
}

export interface SearchParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  questionType?: string;
  difficulty?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface Topic {
  id: number;
  name: string;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface FilterStats {
  totalQuestions: number;
  filteredQuestions: number;
  appliedFilters: {
    questionType?: string;
    difficulty?: string;
    isActive?: boolean;
    search?: string;
  };
} 