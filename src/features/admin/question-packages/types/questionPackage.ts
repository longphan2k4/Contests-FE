export interface QuestionPackage {
  id: number;
  name: string;
  isActive: boolean;
  questionDetailsCount: number;
  matchesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionPackageDetail extends QuestionPackage {
  questionDetails: Array<{
    questionOrder: number;
    isActive: boolean;
    question: {
      id: number;
      plainText: string;
      questionType: string;
      difficulty: string;
    };
  }>;
  matches: Array<{
    id: number;
    name: string;
    startTime: string;
    endTime: string;
  }>;
}

export interface QuestionPackageFormData {
  name: string;
  isActive?: boolean;
}

export interface QuestionPackageFilter {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  timestamp: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface ApiError {
  code: string;
  details: string | Array<{
    field: string;
    message: string;
  }>;
} 