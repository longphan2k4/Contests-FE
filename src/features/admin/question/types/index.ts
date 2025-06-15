export type QuestionType = "multiple_choice" | "essay";

export interface MediaFile {
  type: "image" | "video" | "audio";
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  duration?: number;
  dimensions?: {
    width: number;
    height: number;
  };
}

export interface Question {
  id: number;
  intro?: string;
  defaultTime: number;
  questionType: QuestionType;
  content: string;
  questionMedia?: MediaFile[];
  options?: string[] | null;
  correctAnswer: string;
  mediaAnswer?: MediaFile[];
  score: number;
  difficulty: "Alpha" | "Beta" | "Rc" | "Gold";
  explanation?: string;
  questionTopicId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  
  questionTopic?: {
    id: number;
    name: string;
  };
}

export interface QuestionsListResponse {
  success: true;
  message: string;
  data: {
    questions: Question[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    }
  };
  timestamp: string;
}

export interface SearchParams {
  page?: number;
  limit?: number;
  search?: string;
  questionTopicId?: number;
  questionType?: QuestionType;
  difficulty?: Question['difficulty'];
  hasMedia?: boolean;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Giới hạn upload
export const LIMITS = {
  image: 5 * 1024 * 1024,    // 5MB
  video: 100 * 1024 * 1024,  // 100MB
  audio: 20 * 1024 * 1024    // 20MB
};

// Định nghĩa cho từng lỗi chi tiết khi xóa nhiều câu hỏi
export interface BatchDeleteError {
  id: number;
  error: string;
}

// Định nghĩa cho data trả về của batch delete
export interface BatchDeleteResponseData {
  successIds: number[];
  failedIds: number[];
  errors: BatchDeleteError[];
}

