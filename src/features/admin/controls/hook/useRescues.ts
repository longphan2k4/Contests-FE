import {
  getEliminatedContestants,
  getRescueCandidates,
  getRescuedContestantsByRescueId,
  rescueManyContestants,
  addStudentsToRescue,
  removeStudentFromRescue,
} from "../service/api";
import { useQuery, useMutation } from "@tanstack/react-query";

// Hook lấy danh sách thí sinh bị loại có phân trang, lọc, tìm kiếm
export const useEliminatedContestants = (
  matchId: number | string,
  params: { page?: number; limit?: number; search?: string; schoolId?: number; classId?: number; status?: string } = {}
) => {
  return useQuery({
    queryKey: ["eliminatedContestants", matchId, params],
    queryFn: () => getEliminatedContestants(matchId, params),
    enabled: !!matchId,
  });
};

// Hook lấy danh sách thí sinh cứu trợ (có thể truyền rescueId)
export const useRescueCandidates = (matchId: number | string, rescueId?: number) => {
  return useQuery({
    queryKey: ["rescueCandidates", matchId, rescueId],
    queryFn: () => getRescueCandidates(matchId, rescueId),
    enabled: !!matchId,
  });
};

// Hook lấy danh sách thí sinh đã được cứu trợ theo rescueId
export const useRescuedContestantsByRescueId = (rescueId: number | string) => {
  return useQuery({
    queryKey: ["rescuedContestants", rescueId],
    queryFn: () => getRescuedContestantsByRescueId(rescueId),
    enabled: !!rescueId,
  });
};

// Hook cứu trợ hàng loạt thí sinh
export const useRescueManyContestants = () => {
  return useMutation({
    mutationFn: (variables: { matchId: number | string; data: { contestantIds: number[]; currentQuestionOrder: number } }) =>
      rescueManyContestants(variables.matchId, variables.data),
  });
};

// Hook thêm hàng loạt studentIds vào rescue
export const useAddStudentsToRescue = () => {
  return useMutation({
    mutationFn: (variables: { rescueId: number; studentIds: number[] }) =>
      addStudentsToRescue(variables.rescueId, variables.studentIds),
  });
};

// Hook xóa 1 studentId khỏi rescue
export const useRemoveStudentFromRescue = () => {
  return useMutation({
    mutationFn: (variables: { rescueId: number; studentId: number }) =>
      removeStudentFromRescue(variables.rescueId, variables.studentId),
  });
};

