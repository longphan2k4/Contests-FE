export interface ApiQuestion {
  id: number;
  intro: string;
  defaultTime: number;
  questionType: 'multiple_choice' | 'open_ended';
  content: string;
  questionMedia?: { type: string; url: string };
  options?: string[];
  correctAnswer?: string;
  mediaAnswer?: { type: string; url: string };
  score: number;
  difficulty: string;
  explanation: string;
  questionTopic: { id: number; name: string };
  questionDetails: { id: number; questionId: number; additionalNotes: string };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: number;
  type: 'multiple-choice' | 'open-ended';
  text: string;
  intro?: string;
  options?: string[];
  correctAnswer?: string;
  questionMedia?: { type: string; url: string };
  mediaAnswer?: { type: string; url: string };
  explanation?: string;
  defaultTime?: number;
  score?: number;
  difficulty?: string;
  topic?: string;
  additionalNotes?: string;
}