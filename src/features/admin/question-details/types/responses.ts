import type { QuestionDetail } from './questionDetail';
import type { AvailableQuestion } from './question';

export interface ReorderRequest {
  questionPackageId: number;
  reorders: Array<{
    questionId: number;
    newOrder: number;
  }>;
}

export interface BulkCreateResponse {
  totalRequested: number;
  successful: number;
  failed: number;
  successfulItems: Array<{
    questionId: number;
    questionPackageId: number;
  }>;
  failedItems: Array<{
    questionId: number;
    questionPackageId: number;
    reason: string;
  }>;
}

export interface ReorderResponse {
  updated: QuestionDetail[];
  summary: {
    totalRequested: number;
    successful: number;
    failed: number;
  };
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
  };
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 