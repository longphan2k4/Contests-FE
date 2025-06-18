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