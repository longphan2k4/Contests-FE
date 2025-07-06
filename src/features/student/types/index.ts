// API Response Types
export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    role: string;
    accessToken: string;
    refreshToken?: string;
    contestant: {
      id: number;
      fullName: string;
      studentCode: string;
      class: string | null;
      contestId: number;
    };
    contest: {
      id: number;
      name: string;
      slug: string;
    };
    matches: Match[];
    socket: string;
  };
  timestamp: string;
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

// Class and School Types
export interface School {
  name: string;
}

export interface Class {
  id: number;
  name: string;
  isActive: boolean;
  school: School;
}

export interface ClassListResponse {
  success: boolean;
  message: string;
  data: Class[];
  timestamp: string;
}

// Student types
export interface Student {
  id: number;
  fullName: string;
  studentCode: string;
}

export interface Contest {
  id: number;
  name: string;
  slug: string;
  status: "upcoming" | "active" | "completed" | "ongoing" | "finished";
}

export interface Round {
  id: number;
  name: string;
}

export interface Match {
  id: number;
  name: string;
  slug: string;
  status: "upcoming" | "active" | "completed";
  currentQuestion: number;
  remainingTime: number | null;
}

export interface Question {
  id: number;
  content: string;
  questionType: "multiple_choice" | "fill_blank" | "true_false";
  options?: string[];
  correctAnswer: string;
  defaultTime: number;
  order: number;
}

export interface StudentAnswer {
  questionId: number;
  answer: string;
  isCorrect: boolean;
  submittedAt: string;
  questionOrder: number;
}

export interface ContestantInfo {
  contestant: {
    id: number;
    fullName: string;
    studentCode: string;
    class: string | null;
    registrationNumber: number; 
  };
  contest: {
    id: number;
    name: string;
    slug: string;
  };
  matches: Match[];
}

export interface SocketAnswer {
  matchId: number;
  questionOrder: number;
  answer: string;
  submittedAt?: string;
}

export interface AnswerResult {
  success: boolean;
  message: string;
  result?: {
    isCorrect: boolean;
    questionOrder: number;
    submittedAt: string;
    correctAnswer?: string;
    explanation?: string;
    eliminated?: boolean;
    score?: number;
  };
}

// Socket Events Types
export interface SocketCurrentQuestionData {
  currentQuestion: Question;
}

export interface SocketAnswerSubmittedData {
  contestantId: number;
  isCorrect: boolean;
  questionOrder: number;
  submittedAt: string;
}

// Form Validation Types
export interface LoginFormData {
  identifier: string;
  password: string;
}

export interface LoginFormErrors {
  identifier?: string;
  password?: string;
  general?: string;
}

// Registration Types
export interface RegisterFormData {
  username: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  classId: number;
  school: string;
}

export interface RegisterFormErrors {
  username?: string;
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  classId?: string;
  school?: string;
  general?: string;
}

export interface RegisterRequest {
  username: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  classId: number;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    username: string;
    fullName: string;
    email: string;
    classId: number;
    studentCode?: string;
    class?: {
      id: number;
      name: string;
      school: {
        name: string;
      };
    };
  };
  timestamp: string;
}

// Error response type cho validation errors từ backend
export interface ValidationError {
  field: string;
  message: string;
}

export interface RegisterErrorResponse {
  success: false;
  message: string;
  error?: {
    type: string;
    details: ValidationError[];
  };
  timestamp?: string;
}

// Union type cho response có thể là success hoặc error
export type RegisterApiResponse = RegisterResponse | RegisterErrorResponse;
