import { 
  CalendarDaysIcon, 
  BookOpenIcon, 
  TrophyIcon, 
  UsersIcon 
} from '@heroicons/react/24/outline';
import type { QuickQuestion } from './types';

export const quickQuestions: QuickQuestion[] = [
  { icon: CalendarDaysIcon, text: "Thời gian", question: "Cuộc thi diễn ra khi nào?" },
  { icon: BookOpenIcon, text: "Nội dung", question: "Các môn thi là gì?" },
  { icon: TrophyIcon, text: "Giải thưởng", question: "Giải thưởng của cuộc thi" },
  { icon: UsersIcon, text: "Đối tượng", question: "Ai được tham gia cuộc thi?" }
];