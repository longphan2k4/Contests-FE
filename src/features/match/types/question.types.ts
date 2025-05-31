// types/question.types.ts
export interface QuestionData {
  questionNumber: number;
  phase: string;
  topic: string;
  type: 'Trắc Nghiệm' | 'Hình Ảnh' | 'Video' | 'Âm Thanh';
  content: string;
  mediaUrl?: string;
  options?: string[];
  correctAnswer: string;
}

export interface QuestionInfoProps {
  questionNumber: number;
  phase: string;
  topic: string;
  type: string;
}

export interface QuestionContentProps {
  content: string;
  type: string;
  mediaUrl?: string;
  options?: string[];
  isVisible: boolean;
}

export interface AnswerDisplayProps {
  answer: string;
  isVisible: boolean;
}

export interface DemoControlsProps {
  contentVisible: boolean;
  answerVisible: boolean;
  onToggleQuestion: () => void;
  onToggleAnswer: () => void;
  onSwitchQuestionType: (type: QuestionData['type']) => void;
}