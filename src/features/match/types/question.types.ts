// types/question.types.ts

export interface QuestionData {
  questionNumber: number;
  phase: string;
  topic: string;
  type: "Trắc Nghiệm" | "Hình Ảnh" | "Video" | "Âm Thanh";
  content: string;
  mediaUrl?: string;
  options?: string[];
  correctAnswer: string;
  answerType?: "option" | "text" | "image" | "video" | "audio";
  answerMediaUrl?: string;
}

export interface QuestionInfoProps {
  questionNumber: number;
  phase: string;
  topic: string;
  type: "multiple_choice" | "essay";
}

export interface Media {
  type: "image" | "video" | "audio";
  url: string;
}
export interface QuestionContentProps {
  content: string | undefined;
  type: "multiple_choice" | "essay" | null;
  questionMedia: Media[] | null;
  options?: string[];
}

export interface AnswerContentProps {
  answermedia: Media[] | null;
  correctAnswer: string | null;
}

export interface AnswerDisplayProps {
  answer: string;
  answerType?: "option" | "text" | "image" | "video" | "audio";
  answerMediaUrl?: string;
  isVisible: boolean;
}

export interface DemoControlsProps {
  contentVisible: boolean;
  answerVisible: boolean;
  onToggleQuestion: () => void;
  onToggleAnswer: () => void;
  onSwitchQuestionType: (type: QuestionData["type"]) => void;
  onSwitchAnswerType?: (
    type: "option" | "text" | "image" | "video" | "audio"
  ) => void;
}
