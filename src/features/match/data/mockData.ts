// data/mockData.ts
import type { QuestionData } from '../types/question.types';

export const fakeQuestionData: QuestionData = {
  questionNumber: 1,
  phase: "Khởi động",
  topic: "Lịch sử Việt Nam",
  type: "Trắc Nghiệm",
  content: "Cuộc khởi nghĩa Hai Bà Trưng diễn ra vào năm nào?",
  options: ["40 - 43", "39 - 42", "41 - 44", "38 - 41"],
  correctAnswer: "A",
  answerType: "option"
};

// Dữ liệu mẫu cho các loại câu hỏi và đáp án khác nhau
export const sampleQuestions: Record<string, QuestionData> = {
  'Trắc Nghiệm': {
    questionNumber: 1,
    phase: "Khởi động",
    topic: "Lịch sử Việt Nam",
    type: "Trắc Nghiệm",
    content: "Cuộc khởi nghĩa Hai Bà Trưng diễn ra vào năm nào?",
    options: ["40 - 43", "39 - 42", "41 - 44", "38 - 41"],
    correctAnswer: "A",
    answerType: "option"
  },
  
  'Hình Ảnh': {
    questionNumber: 2,
    phase: "Tăng tốc",
    topic: "Địa lý Việt Nam",
    type: "Hình Ảnh",
    content: "Đây là hình ảnh của danh lam thắng cảnh nào ở Việt Nam?",
    mediaUrl: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=500",
    correctAnswer: "Vịnh Hạ Long",
    answerType: "text"
  },
  
  'Video': {
    questionNumber: 3,
    phase: "Vượt chướng ngại vật",
    topic: "Văn hóa Việt Nam",
    type: "Video",
    content: "Đây là video về một lễ hội truyền thống nào của Việt Nam?",
    mediaUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    correctAnswer: "Đây là video về Lễ hội Đền Hùng, được tổ chức hàng năm để tưởng nhớ các Vua Hùng - những người có công dựng nước.",
    answerType: "text"
  },
  
  'Âm Thanh': {
    questionNumber: 4,
    phase: "Về đích",
    topic: "Âm nhạc Việt Nam",
    type: "Âm Thanh",
    content: "Đây là giai điệu của bài hát nào?",
    mediaUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
    correctAnswer: "Tiếng Việt",
    answerType: "text"
  }
};

// Dữ liệu mẫu cho các loại đáp án khác nhau
export const sampleAnswerTypes: Record<string, Partial<QuestionData>> = {
  'option': {
    correctAnswer: "B",
    answerType: "option"
  },
  
  'text': {
    correctAnswer: "Thủ đô của Việt Nam là Hà Nội, được thành lập từ năm 1010 dưới thời vua Lý Thái Tổ với tên gọi ban đầu là Thăng Long.",
    answerType: "text"
  },
  
  'image': {
    correctAnswer: "Đây là hình ảnh minh họa đáp án:",
    answerType: "image",
    answerMediaUrl: "https://images.unsplash.com/photo-1509924603848-648615cbc56a?w=400"
  },
  
  'video': {
    correctAnswer: "Video giải thích đáp án:",
    answerType: "video",
    answerMediaUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4"
  },
  
  'audio': {
    correctAnswer: "Âm thanh giải thích đáp án:",
    answerType: "audio",
    answerMediaUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-04.mp3"
  }
};