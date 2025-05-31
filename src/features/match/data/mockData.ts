// data/mockData.ts
import type {QuestionData } from "../types/question.types";

export const fakeQuestionData: QuestionData = {
  questionNumber: 5,
  phase: "Vòng Chung Kết",
  topic: "Khoa Học Tự Nhiên",
  type: "Trắc Nghiệm",
  content: "Trong bảng tuần hoàn các nguyên tố, nguyên tố nào có ký hiệu hóa học là 'Au'?",
  options: [
    "Bạc (Silver)",
    "Vàng (Gold)", 
    "Đồng (Copper)",
    "Chì (Lead)"
  ],
  correctAnswer: "B. Vàng (Gold)"
};

export const questionTemplates = {
  'Trắc Nghiệm': {
    ...fakeQuestionData,
    type: 'Trắc Nghiệm' as const,
    content: "Trong bảng tuần hoàn các nguyên tố, nguyên tố nào có ký hiệu hóa học là 'Au'?",
    options: ["Bạc (Silver)", "Vàng (Gold)", "Đồng (Copper)", "Chì (Lead)"],
    correctAnswer: "B. Vàng (Gold)"
  },
  'Hình Ảnh': {
    ...fakeQuestionData,
    type: 'Hình Ảnh' as const,
    content: "Đây là hình ảnh của loài động vật nào?",
    mediaUrl: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=500&h=300&fit=crop",
    correctAnswer: "Chó Golden Retriever"
  },
  'Video': {
    ...fakeQuestionData,
    type: 'Video' as const,
    content: "Hãy xem video và cho biết đây là hiện tượng gì?",
    mediaUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    correctAnswer: "Hiện tượng sóng biển"
  },
  'Âm Thanh': {
    ...fakeQuestionData,
    type: 'Âm Thanh' as const,
    content: "Đây là âm thanh của nhạc cụ nào?",
    mediaUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    correctAnswer: "Tiếng chuông"
  }
};