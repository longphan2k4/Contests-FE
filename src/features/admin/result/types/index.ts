// Thông tin học sinh
export interface Student {
  id: number;
  fullName: string;
  studentCode: string;
}

// Thông tin thí sinh
export interface Contestant {
  id: number;
  studentId: number;
  student: Student;
}

// Thông tin vòng thi
export interface Round {
  id: number;
  name: string;
}

// Thông tin trận đấu
export interface Match {
  id: number;
  name: string;
  roundId: number;
  round: Round;
}

// Cấu trúc Result đầy đủ
export interface Result {
  id: number;
  name: string;
  contestantId: number;
  matchId: number;
  isCorrect: boolean;
  questionOrder: number;
  createdAt: string;
  updatedAt: string;
  contestant: Contestant;
  match: Match;
}

// Tham số lọc kết quả với nhiều tùy chọn hơn
export interface ResultFilterParams {
  matchId?: number;
  contestantId?: number;
  roundId?: number;
  studentName?: string;
  matchName?: string;
  isCorrect?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'questionOrder' | 'studentName' | 'matchName';
  sortOrder?: 'asc' | 'desc';
}

// Thống kê kết quả
export interface ResultSummary {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number;
  byRound: Record<string, {
    roundName: string;
    total: number;
    correct: number;
    accuracy: number;
  }>;
  byMatch: Record<string, {
    matchName: string;
    total: number;
    correct: number;
    accuracy: number;
  }>;
  topStudents: {
    studentName: string;
    studentCode: string;
    correct: number;
    total: number;
    accuracy: number;
  }[];
}

// API Response interfaces
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

// Filter state cho UI
export interface FilterState {
  studentName: string;
  matchName: string;
  roundId: string;
  isCorrect: string; // 'all' | 'true' | 'false'
  sortBy: string;
  sortOrder: string;
} 