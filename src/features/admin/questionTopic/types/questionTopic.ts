/**
 * Interface cho đối tượng chủ đề câu hỏi
 */
export interface QuestionTopic {
  id: number;
  name: string;
  isActive: boolean;
  questionsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionTopicFilter {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface QuestionTopicsResponse {
  success: boolean;
  message: string;
  data: QuestionTopic[];
  pagination: Pagination;
  timestamp: string;
}

export interface ValidationError {
  field: string;
  message: string;
} 