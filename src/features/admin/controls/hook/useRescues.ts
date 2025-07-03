import {
  getEliminatedContestants,
  getRescueCandidates,
  getRescuedContestantsByRescueId,
  rescueManyContestants,
  addStudentsToRescue,
  removeStudentFromRescue,
  getRescuesByMatchIdAndType,
  updateRescueStatusByCurrentQuestion,
} from "../service/api";
import { useQuery, useMutation } from "@tanstack/react-query";

// Hook lấy danh sách thí sinh bị loại có phân trang, lọc, tìm kiếm
export const useEliminatedContestants = (
  matchId: number | string,
  params: { page?: number; limit?: number; search?: string; schoolId?: number; classId?: number; status?: string; registrationNumber?: string } = {},
  options?: { enabled?: boolean; refetchOnWindowFocus?: boolean }
) => {
  return useQuery({
    queryKey: ["eliminatedContestants", matchId, params],
    queryFn: () => getEliminatedContestants(matchId, params),
    enabled: options?.enabled !== undefined ? options.enabled : !!matchId,
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    staleTime: 0,// Always consider data stale to ensure fresh fetch
  });
};

// Hook lấy danh sách thí sinh cứu trợ (có thể truyền rescueId và limit)
export const useRescueCandidates = (matchId: number | string, rescueId?: number, limit?: number) => {
  return useQuery({
    queryKey: ["rescueCandidates", matchId, rescueId, limit],
    queryFn: () => getRescueCandidates(matchId, rescueId, limit),
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
    mutationFn: (variables: { matchId: number | string; data: { contestantIds: number[]; currentQuestionOrder: number; rescueId?: number } }) =>
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

// Hook: Lấy danh sách rescue theo matchId và rescueType
export const useRescuesByMatchIdAndType = (
  matchId: number | undefined,
  rescueType: string = "resurrected"
) => {
  return useQuery({
    queryKey: ["rescuesByMatchIdAndType", matchId, rescueType],
    queryFn: () => {
      if (!matchId) {
        throw new Error("Match ID is required");
      }
      return getRescuesByMatchIdAndType(matchId, rescueType);
    },
    enabled: !!matchId,
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false,
  });
};

// Hook: Cập nhật trạng thái rescue theo câu hỏi hiện tại
export const useUpdateRescueStatusByCurrentQuestion = () => {
  return useMutation({
    mutationFn: (variables: { matchId: number; currentQuestionOrder: number }) =>
      updateRescueStatusByCurrentQuestion(variables.matchId, variables.currentQuestionOrder),
    onSuccess: (data) => {
      console.log('Cập nhật trạng thái rescue thành công:', data);
    },
    onError: (error) => {
      console.error('Lỗi cập nhật trạng thái rescue:', error);
    },
  });
};

