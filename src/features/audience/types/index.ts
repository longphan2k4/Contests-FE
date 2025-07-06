export interface MediaFile {
  url: string;
  size: number;
  type: "image" | "video" | "audio"; // hoặc mở rộng nếu cần
  filename: string;
  mimeType: string;
}

export interface Question {
  id: number;
  content: string; // HTML nội dung câu hỏi
  options: string[];
  correctAnswer: string;
  questionType: "multiple_choice" | "essay";
  questionTopic: string;
  questionMedia?: MediaFile[]; // mảng file media
  timestamp: string; // hoặc Date nếu bạn parse
}
