import { useEffect, useCallback, useState } from 'react';
import { useSocket } from '@contexts/SocketContext';
import { useParams } from 'react-router-dom';

// Định nghĩa types cho socket responses
interface SocketResponse {
  success: boolean;
  message?: string;
  data?: any;
}

interface MatchStartData {
  matchId: string;
  currentQuestion: number;
  timeRemaining: number;
  status: 'started' | 'paused' | 'stopped';
}

interface TimerData {
  timeRemaining: number;
  isActive: boolean;
  isPaused: boolean;
}

interface ExamState {
  isStarted: boolean;
  isPaused: boolean;
  isLoading: boolean;
  currentQuestion: number;
  timeRemaining: number;
}

export const useAdminSocket = () => {
  const { socket, isConnected } = useSocket();
  const { match } = useParams();
  
  const [examState, setExamState] = useState<ExamState>({
    isStarted: false,
    isPaused: false,
    isLoading: false,
    currentQuestion: 0,
    timeRemaining: 0,
  });

  // Event listeners cho admin socket
  useEffect(() => {
    if (!socket) return;

    const handleMatchStarted = (data: MatchStartData) => {
      console.log('✅ Match đã bắt đầu:', data);
      setExamState(prev => ({
        ...prev,
        isStarted: true,
        isPaused: false,
        currentQuestion: data.currentQuestion,
        timeRemaining: data.timeRemaining,
        isLoading: false,
      }));
    };

    const handleMatchPaused = (data: { isPaused: boolean }) => {
      console.log('⏸️ Match đã tạm dừng:', data);
      setExamState(prev => ({
        ...prev,
        isPaused: data.isPaused,
        isLoading: false,
      }));
    };

    const handleMatchResumed = () => {
      console.log('▶️ Match đã tiếp tục');
      setExamState(prev => ({
        ...prev,
        isPaused: false,
        isLoading: false,
      }));
    };

    const handleMatchStopped = () => {
      console.log('🛑 Match đã kết thúc');
      setExamState(prev => ({
        ...prev,
        isStarted: false,
        isPaused: false,
        isLoading: false,
      }));
    };

    const handleQuestionChanged = (data: { currentQuestion: number; timeRemaining: number }) => {
      console.log('➡️ Chuyển câu hỏi:', data);
      setExamState(prev => ({
        ...prev,
        currentQuestion: data.currentQuestion,
        timeRemaining: data.timeRemaining,
        isLoading: false,
      }));
    };

    const handleTimerUpdate = (data: TimerData) => {
      setExamState(prev => ({
        ...prev,
        timeRemaining: data.timeRemaining,
        isPaused: data.isPaused,
      }));
    };

    // Đăng ký các event listeners
    socket.on('match:started', handleMatchStarted);
    socket.on('match:paused', handleMatchPaused);
    socket.on('match:resumed', handleMatchResumed);
    socket.on('match:stopped', handleMatchStopped);
    socket.on('match:questionChanged', handleQuestionChanged);
    socket.on('timer:update', handleTimerUpdate);

    return () => {
      socket.off('match:started', handleMatchStarted);
      socket.off('match:paused', handleMatchPaused);
      socket.off('match:resumed', handleMatchResumed);
      socket.off('match:stopped', handleMatchStopped);
      socket.off('match:questionChanged', handleQuestionChanged);
      socket.off('timer:update', handleTimerUpdate);
    };
  }, [socket]);

  // Socket emit functions với callback handling
  const startExam = useCallback(async (): Promise<SocketResponse> => {
    if (!socket || !match) {
      return { success: false, message: 'Socket không kết nối hoặc thiếu match ID' };
    }

    setExamState(prev => ({ ...prev, isLoading: true }));

    return new Promise((resolve) => {
      socket.emit('match:start', { matchId: match }, (response: SocketResponse) => {
        console.log('🚀 Start exam response:', response);
        
        if (!response.success) {
          setExamState(prev => ({ ...prev, isLoading: false }));
        }
        
        resolve(response);
      });
    });
  }, [socket, match]);

  const pauseExam = useCallback(async (): Promise<SocketResponse> => {
    if (!socket || !match) {
      return { success: false, message: 'Socket không kết nối hoặc thiếu match ID' };
    }

    setExamState(prev => ({ ...prev, isLoading: true }));

    return new Promise((resolve) => {
      socket.emit('match:pauseTimer', { matchId: match }, (response: SocketResponse) => {
        console.log('⏸️ Pause exam response:', response);
        
        if (!response.success) {
          setExamState(prev => ({ ...prev, isLoading: false }));
        }
        
        resolve(response);
      });
    });
  }, [socket, match]);

  const resumeExam = useCallback(async (): Promise<SocketResponse> => {
    if (!socket || !match) {
      return { success: false, message: 'Socket không kết nối hoặc thiếu match ID' };
    }

    setExamState(prev => ({ ...prev, isLoading: true }));

    return new Promise((resolve) => {
      socket.emit('match:resumeTimer', { matchId: match }, (response: SocketResponse) => {
        console.log('▶️ Resume exam response:', response);
        
        if (!response.success) {
          setExamState(prev => ({ ...prev, isLoading: false }));
        }
        
        resolve(response);
      });
    });
  }, [socket, match]);

  const stopExam = useCallback(async (): Promise<SocketResponse> => {
    if (!socket || !match) {
      return { success: false, message: 'Socket không kết nối hoặc thiếu match ID' };
    }

    setExamState(prev => ({ ...prev, isLoading: true }));

    return new Promise((resolve) => {
      socket.emit('match:end', { matchId: match }, (response: SocketResponse) => {
        console.log('🛑 Stop exam response:', response);
        
        if (!response.success) {
          setExamState(prev => ({ ...prev, isLoading: false }));
        }
        
        resolve(response);
      });
    });
  }, [socket, match]);

  const nextQuestion = useCallback(async (): Promise<SocketResponse> => {
    if (!socket || !match) {
      return { success: false, message: 'Socket không kết nối hoặc thiếu match ID' };
    }

    setExamState(prev => ({ ...prev, isLoading: true }));

    return new Promise((resolve) => {
      socket.emit('match:nextQuestion', { matchId: match }, (response: SocketResponse) => {
        console.log('➡️ Next question response:', response);
        
        if (!response.success) {
          setExamState(prev => ({ ...prev, isLoading: false }));
        }
        
        resolve(response);
      });
    });
  }, [socket, match]);

  return {
    // State
    examState,
    isConnected,
    
    // Actions
    startExam,
    pauseExam,
    resumeExam,
    stopExam,
    nextQuestion,
  };
}; 