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
  answerType?: 'option' | 'text' | 'image' | 'video' | 'audio';
  answerMediaUrl?: string;
}

export interface QuestionInfoProps {
  questionNumber: number;
  phase: string;
  topic: string;
  type: string;
}

export interface QuestionContentProps {
  content: string;
  type: 'Trắc Nghiệm' | 'Hình Ảnh' | 'Video' | 'Âm Thanh';
  mediaUrl?: string;
  options?: string[];
  isVisible: boolean;
}

export interface AnswerDisplayProps {
  answer: string;
  answerType?: 'option' | 'text' | 'image' | 'video' | 'audio';
  answerMediaUrl?: string;
  isVisible: boolean;
}

export interface DemoControlsProps {
  contentVisible: boolean;
  answerVisible: boolean;
  onToggleQuestion: () => void;
  onToggleAnswer: () => void;
  onSwitchQuestionType: (type: QuestionData['type']) => void;
  onSwitchAnswerType?: (type: 'option' | 'text' | 'image' | 'video' | 'audio') => void;
}