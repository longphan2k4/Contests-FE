export interface Result {
  id: number;
  name: string;
  contestantId: number;
  matchId: number;
  isCorrect: boolean;
  questionOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ResultFilterParams {
  matchId?: number;
  contestantId?: number;
  page?: number;
  limit?: number;
}

export interface ResultSummary {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  results: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
} 