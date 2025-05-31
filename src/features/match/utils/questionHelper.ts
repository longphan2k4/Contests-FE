// utils/questionHelpers.ts
// utils/questionHelpers.ts
import type { QuestionData } from '../types/question.types';
import { questionTemplates } from '../data/mockData';

export const createQuestionByType = (type: QuestionData['type']): QuestionData => {
  return questionTemplates[type];
};

export const getQuestionTypeIcon = (type: string): string => {
  const iconMap = {
    'Trắc Nghiệm': 'DocumentTextIcon',
    'Hình Ảnh': 'PhotoIcon', 
    'Video': 'VideoCameraIcon',
    'Âm Thanh': 'SpeakerWaveIcon'
  };
  
  return iconMap[type as keyof typeof iconMap] || '';
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

export const formatQuestionNumber = (number: number): string => {
  return `Câu ${number}`;
};

export const getMediaType = (url: string): 'image' | 'video' | 'audio' | 'unknown' => {
  const extension = url.split('.').pop()?.toLowerCase();
  
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
    return 'image';
  }
  
  if (['mp4', 'avi', 'mov', 'wmv'].includes(extension || '')) {
    return 'video';
  }
  
  if (['mp3', 'wav', 'aac', 'ogg'].includes(extension || '')) {
    return 'audio';
  }
  
  return 'unknown';
};