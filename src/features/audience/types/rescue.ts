// Base API Response từ backend
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  timestamp?: string;
}

// Question Types theo backend
export type QuestionType = 'multiple_choice' | 'open_ended' | 'essay';

// Rescue Question Response từ backend (getRescueByMatchSlug)
export interface RescueQuestion {
  id: number;
  content: string;
  options: string[];
  questionType: QuestionType;
  questionTopic: string | null;
  questionMedia: string | null;
  correctAnswer: string;
}

// Support Answer Request (UpdateSupportAnswers)
export interface SupportAnswerRequest {
  supportAnswers: string;
}

// Support Answer Response 
export interface SupportAnswerResponse {
  success: boolean;
  message: string;
}

// Chart Data Response từ backend (RescueChart)
export interface ChartDataItem {
  label: string;
  value: number;
}

// API Response Types
export type RescueQuestionResponse = ApiResponse<RescueQuestion>;
export type SupportAnswerApiResponse = ApiResponse<null>;
export type ChartDataResponse = ApiResponse<ChartDataItem[]>;

// Question Type Guards
export const isMultipleChoice = (question: RescueQuestion): boolean => {
  return question.questionType === 'multiple_choice';
};

export const isOpenEnded = (question: RescueQuestion): boolean => {
  return question.questionType === 'open_ended';
};

export const isEssay = (question: RescueQuestion): boolean => {
  return question.questionType === 'essay';
};