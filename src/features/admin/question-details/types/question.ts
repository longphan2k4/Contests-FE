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