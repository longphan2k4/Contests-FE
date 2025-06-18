import type { Contestant } from './types';

export const TOTAL_ICONS = 60;
export const MOCK_CURRENT_QUESTION = 3;

export const mockContestants: Contestant[] = Array.from({ length: TOTAL_ICONS }, (_, index) => {
  const status = ['Đang thi', 'Bị loại', 'Được cứu', 'Cấm thi'][Math.floor(Math.random() * 4)];
  return {
    registration_number: index + 1,
    fullname: `Contestant ${index + 1}`,
    match_status: status,
    eliminated_at_question_order: status === 'Bị loại' || status === 'Cấm thi' ? Math.floor(Math.random() * 5) + 1 : null,
    rescued_at_question_order: status === 'Được cứu' ? Math.floor(Math.random() * 5) + 1 : null,
  };
});