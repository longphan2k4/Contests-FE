import type { Result, ResultSummary } from '../types';

/**
 * Tính toán tổng kết các câu trả lời theo match
 * @param results Mảng kết quả
 */
export const calculateResultSummary = (results: Result[]): ResultSummary => {
  const totalQuestions = results.length;
  const correctAnswers = results.filter(result => result.isCorrect).length;
  
  return {
    totalQuestions,
    correctAnswers,
    incorrectAnswers: totalQuestions - correctAnswers,
    accuracy: totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0,
    byRound: {},
    byMatch: {},
    topStudents: []
  };
};

/**
 * Nhóm kết quả theo thí sinh
 * @param results Mảng kết quả
 */
export const groupResultsByContestant = (results: Result[]): { [contestantId: number]: Result[] } => {
  return results.reduce((acc, result) => {
    const contestantId = result.contestantId;
    
    if (!acc[contestantId]) {
      acc[contestantId] = [];
    }
    
    acc[contestantId].push(result);
    
    return acc;
  }, {} as { [contestantId: number]: Result[] });
};

/**
 * Tính tỉ lệ chính xác theo mảng kết quả
 * @param results Mảng kết quả
 */
export const calculateAccuracy = (results: Result[]): number => {
  if (results.length === 0) return 0;
  
  const correctCount = results.filter(result => result.isCorrect).length;
  return (correctCount / results.length) * 100;
};

/**
 * Sắp xếp kết quả theo thứ tự câu hỏi
 * @param results Mảng kết quả
 */
export const sortByQuestionOrder = (results: Result[]): Result[] => {
  return [...results].sort((a, b) => a.questionOrder - b.questionOrder);
}; 