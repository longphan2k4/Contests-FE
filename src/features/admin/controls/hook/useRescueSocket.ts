import { useState, useCallback } from 'react';
import { useSocket } from '@contexts/SocketContext';
import { useQueryClient } from '@tanstack/react-query';

type RescueStatusUpdateResult = {
  updatedRescues: Array<{
    id: number;
    name: string;
    index: number;
    status: string;
    questionFrom: number;
    questionTo: number;
    rescueType: string;
  }>;
  currentEligibleRescues: Array<{
    id: number;
    name: string;
    index: number;
    status: string;
    questionFrom: number;
    questionTo: number;
  }>;
  totalUpdated: number;
  summary: {
    passed: number;
    notEligible: number;
    notUsed: number;
    unchanged: number;
  };
};

// Hook để cập nhật và lắng nghe các sự kiện liên quan đến rescue
export const useRescueSocket = () => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<RescueStatusUpdateResult | null>(null);

  // Hàm cập nhật status rescue dựa vào câu hỏi hiện tại
  const updateRescueStatusByQuestion = useCallback(
    (matchId: number, currentQuestionOrder: number, match?: string) => {
      return new Promise<RescueStatusUpdateResult>((resolve, reject) => {
        if (!socket) {
          const errorMsg = 'Socket chưa được kết nối';
          setError(errorMsg);
          reject(new Error(errorMsg));
          return;
        }

        setIsUpdating(true);
        setError(null);

        socket.emit(
          'rescue:updateStatusByQuestion',
          { matchId, currentQuestionOrder, match },
          (err: any, response: any) => {
            setIsUpdating(false);

            if (err) {
              setError(err.message || 'Lỗi không xác định');
              reject(err);
            } else {
              setLastResult(response.data);
              
              // Invalidate related queries để cập nhật dữ liệu mới
              queryClient.invalidateQueries({ queryKey: ['rescuesByMatchIdAndType', matchId] });
              
              resolve(response.data);
            }
          }
        );
      });
    },
    [socket, queryClient]
  );

  return {
    updateRescueStatusByQuestion,
    isUpdating,
    error,
    lastResult,
  };
};
