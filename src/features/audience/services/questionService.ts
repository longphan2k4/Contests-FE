import type { ApiQuestion } from '../types';

const fakeQuestions: ApiQuestion[] = [
  {
    id: 1,
    intro: 'Câu hỏi giới thiệu về lập trình',
    defaultTime: 60,
    questionType: 'multiple_choice',
    content: 'Ngôn ngữ lập trình nào được sử dụng phổ biến nhất năm 2025?',
    questionMedia: { type: 'image', url: 'https://th.bing.com/th/id/OIP.ORSZc330bLQb2nZfonTbVwHaE4?r=0&rs=1&pid=ImgDetMain' },
    options: ['Java', 'Python', 'JavaScript', 'C++'],
    correctAnswer: 'JavaScript',
    mediaAnswer: { type: 'image', url: 'https://example.com/images/answer1.png' },
    score: 1,
    difficulty: 'medium',
    explanation: 'JavaScript phổ biến vì có thể dùng cho cả frontend và backend.',
    questionTopic: { id: 3, name: 'Lập trình Web' },
    questionDetails: { id: 1, questionId: 1, additionalNotes: 'Hiểu biết cơ bản về xu hướng ngôn ngữ' },
    isActive: true,
    createdAt: '2025-06-16T09:30:00Z',
    updatedAt: '2025-06-16T09:30:00Z',
  },
  {
    id: 2,
    intro: 'Câu hỏi về địa lý',
    defaultTime: 60,
    questionType: 'open_ended',
    content: 'Thủ đô của Pháp là gì?',
    questionMedia: { type: 'image', url: 'https://th.bing.com/th/id/OIP.ORSZc330bLQb2nZfonTbVwHaE4?r=0&rs=1&pid=ImgDetMain' },
    correctAnswer: 'Paris',
    mediaAnswer: { type: 'image', url: 'https://example.com/images/answer2.png' },
    score: 1,
    difficulty: 'easy',
    explanation: 'Paris là thủ đô của Pháp, nổi tiếng với tháp Eiffel.',
    questionTopic: { id: 4, name: 'Địa lý' },
    questionDetails: { id: 2, questionId: 2, additionalNotes: 'Kiến thức cơ bản về thủ đô các nước' },
    isActive: true,
    createdAt: '2025-06-16T09:30:00Z',
    updatedAt: '2025-06-16T09:30:00Z',
  },
];

export const fetchQuestions = async (): Promise<ApiQuestion[]> => {
  // Giả lập API call
  return new Promise((resolve) => {
    setTimeout(() => resolve(fakeQuestions), 500);
  });
};