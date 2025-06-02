// utils/questionHelpers.ts
import type { QuestionData } from '../types/question.types';
import { sampleQuestions } from '../data/mockData';

export const createQuestionByType = (type: QuestionData['type']): QuestionData => {
  return sampleQuestions[type] || sampleQuestions['Trắc Nghiệm'];
};

export const getQuestionTypeIcon = (type: string): string => {
  const iconMap = {
    'Trắc Nghiệm': 'DocumentTextIcon',
    'Hình Ảnh': 'PhotoIcon', 
    'Video': 'VideoCameraIcon',
    'Âm Thanh': 'SpeakerWaveIcon'
  };
  
  return iconMap[type as keyof typeof iconMap] || 'DocumentTextIcon';
};

export const validateQuestionData = (question: QuestionData): boolean => {
  if (!question.content || !question.correctAnswer) {
    return false;
  }
  
  if (question.type === 'Trắc Nghiệm' && (!question.options || question.options.length === 0)) {
    return false;
  }
  
  if (['Hình Ảnh', 'Video', 'Âm Thanh'].includes(question.type) && !question.mediaUrl) {
    return false;
  }
  
  return true;
};

export const validateAnswerData = (answer: string, answerType?: string, mediaUrl?: string): boolean => {
  if (!answer) return false;
  
  switch (answerType) {
    case 'option':
      return ['A', 'B', 'C', 'D'].includes(answer.toUpperCase());
    case 'image':
    case 'audio':
    case 'video':
      return !!mediaUrl;
    case 'text':
    default:
      return true;
  }
};

export const formatQuestionNumber = (number: number): string => {
  return `Câu ${number}`;
};

export const getMediaType = (url: string): 'image' | 'video' | 'audio' | 'unknown' => {
  const extension = url.split('.').pop()?.toLowerCase();
  
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')) {
    return 'image';
  }
  
  if (['mp4', 'avi', 'mov', 'wmv', 'webm'].includes(extension || '')) {
    return 'video';
  }
  
  if (['mp3', 'wav', 'aac', 'ogg', 'm4a'].includes(extension || '')) {
    return 'audio';
  }
  
  return 'unknown';
};

export const getAnswerTypeFromQuestion = (questionType: QuestionData['type']): 'option' | 'text' | 'image' | 'video' | 'audio' => {
  switch (questionType) {
    case 'Trắc Nghiệm':
      return 'option';
    case 'Hình Ảnh':
      return 'image';
    case 'Video':
      return 'video';
    case 'Âm Thanh':
      return 'audio';
    default:
      return 'text';
  }
};

export const createAnswerByType = (
  content: string, 
  type: 'option' | 'text' | 'image' | 'video' | 'audio' = 'text',
  mediaUrl?: string
): Partial<QuestionData> => {
  return {
    correctAnswer: content,
    answerType: type,
    answerMediaUrl: mediaUrl
  };
};

export const getAnswerTypeLabel = (answerType?: string): string => {
  switch (answerType) {
    case 'option':
      return 'Đáp án lựa chọn';
    case 'text':
      return 'Đáp án văn bản';
    case 'image':
      return 'Đáp án hình ảnh';
    case 'video':
      return 'Đáp án video';
    case 'audio':
      return 'Đáp án âm thanh';
    default:
      return 'Đáp án';
  }
};

export const isValidMediaUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const generateRandomQuestion = (): QuestionData => {
  const types: QuestionData['type'][] = ['Trắc Nghiệm', 'Hình Ảnh', 'Video', 'Âm Thanh'];
  const randomType = types[Math.floor(Math.random() * types.length)];
  
  return createQuestionByType(randomType);
};

export const updateQuestionAnswer = (
  question: QuestionData, 
  newAnswer: string, 
  answerType?: 'option' | 'text' | 'image' | 'video' | 'audio',
  mediaUrl?: string
): QuestionData => {
  return {
    ...question,
    correctAnswer: newAnswer,
    answerType: answerType || question.answerType || 'text',
    answerMediaUrl: mediaUrl || question.answerMediaUrl
  };
};