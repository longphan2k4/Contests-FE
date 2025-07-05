import { useEffect, useCallback, useState } from 'react';
import { useSocket } from '@contexts/SocketContext';
import { useParams } from 'react-router-dom';
import { useMatchInfo } from './useControls';

// Định nghĩa types cho socket responses
interface SocketResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

// 🔥 NEW: Interface cho join room response
interface JoinRoomResponse {
  success: boolean;
  message: string;
  roomName?: string;
  matchId?: string | number | null;
}

// 🔥 UPDATE: Interface cho show question response data (thay vì next question)
interface ShowQuestionResponseData {
  currentQuestion: number;
  remainingTime: number;
  defaultTime?: number;
  matchId?: string | number;
  totalQuestions?: number;
}

interface MatchStartData {
  matchId: string;
  currentQuestion: number;
  timeRemaining: number;
  status: 'started' | 'paused' | 'stopped';
  defaultTime?: number;
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
  defaultTime: number;
  questionShown: boolean; // 🔥 NEW: Trạng thái câu hỏi đã được hiển thị
  totalQuestions?: number;
  status: string;
}

export const useAdminSocket = () => {
  const { socket, isConnected } = useSocket();
  const { match } = useParams<{ match: string }>();
  
  const { data: matchResponse } = useMatchInfo(match || '');
  const matchData = matchResponse?.data;
  
  const [examState, setExamState] = useState<ExamState>({
    isStarted: false,
    isPaused: false,
    isLoading: false,
    currentQuestion: 1,
    timeRemaining: 0,
    defaultTime: 0,
    questionShown: false, // 🔥 NEW: Thêm state cho question shown
    totalQuestions: 0,
    status: 'not-started',
  });

  // Event listeners cho admin socket
  useEffect(() => {
    if (!socket) return;


    // 🔥 UPDATE: Join room khi kết nối vào match-control namespace
    if (isConnected && match && matchData) {
      const joinData = {
        matchSlug: match,
        matchId: matchData.id
      };
      
      
      // 🔥 UPDATE: Sử dụng event mới từ match-control
      socket.emit('match:join', joinData, (response: JoinRoomResponse) => {
        if (response.success) {
          console.log('✅ [ADMIN SOCKET] Đã join room thành công:', response.roomName);
        } else {
          console.error('❌ [ADMIN SOCKET] Lỗi join room:', response.message);
        }
      });
    }

    const handleMatchStarted = (data: MatchStartData) => {
      
      const currentMatchId = matchData?.id;
      const eventMatchId = typeof data.matchId === 'string' ? parseInt(data.matchId) : data.matchId;
      
      if (!currentMatchId || eventMatchId !== currentMatchId) {
        return;
      }
      
      setExamState(prev => ({
        ...prev,
        isStarted: true,
        isPaused: false,
        currentQuestion: data.currentQuestion,
        timeRemaining: data.timeRemaining,
        defaultTime: data.defaultTime || 60,
        isLoading: false,
        questionShown: false, // 🔥 NEW: Reset question shown state
      }));
    };

    // 🔥 NEW: Handler cho show question event
    const handleQuestionShown = (data: ShowQuestionResponseData) => {
      
      const currentMatchId = matchData?.id;
      const eventMatchId = typeof data.matchId === 'string' ? parseInt(data.matchId) : data.matchId;
      
      if (!currentMatchId || eventMatchId !== currentMatchId) {
        return;
      }
      
      setExamState(prev => ({
        ...prev,
        currentQuestion: data.currentQuestion,
        questionShown: true, // 🔥 NEW: Đánh dấu câu hỏi đã được hiển thị
        isLoading: false,
      }));
    };

    // 🔥 NEW: Handler cho timer events từ shared timer
    const handleTimerUpdate = (data: TimerData) => {
      setExamState(prev => ({
        ...prev,
        timeRemaining: data.timeRemaining,
        isPaused: data.isPaused,
      }));
    };

    const handleTimerEnded = () => {
      setExamState(prev => ({
        ...prev,
        timeRemaining: 0,
        isPaused: true,
      }));
    };

    // 🔥 UPDATE: Đăng ký event listeners mới
    socket.on('match:started', handleMatchStarted);
    socket.on('match:questionShown', handleQuestionShown); // 🔥 FIX: Sửa từ match:showQuestion thành match:questionShown
    socket.on('timer:update', handleTimerUpdate); // 🔥 NEW: Listen for timer updates
    socket.on('timer:ended', handleTimerEnded); // 🔥 NEW: Listen for timer end

    return () => {
      socket.off('match:started', handleMatchStarted);
      socket.off('match:questionShown', handleQuestionShown); // 🔥 FIX: Sửa từ match:showQuestion thành match:questionShown
      socket.off('timer:update', handleTimerUpdate);
      socket.off('timer:ended', handleTimerEnded);
    };
  }, [socket, isConnected, match, matchData]);

  const startExam = useCallback(async (): Promise<SocketResponse> => {
    if (!socket || !match || !matchData) {
      return { success: false, message: 'Socket không kết nối, thiếu match slug hoặc match data' };
    }

    setExamState(prev => ({ ...prev, isLoading: true }));

    return new Promise((resolve) => {
      socket.emit('match:start', { matchId: matchData.id }, (response: SocketResponse) => {
        
        if (response.success) {
          setExamState(prev => ({
            ...prev,
            isStarted: true,
            isPaused: false,
            isLoading: false,
            currentQuestion: 1,
            timeRemaining: 0,
            questionShown: false, // 🔥 NEW: Reset question shown state
          }));
        } else {
          setExamState(prev => ({ ...prev, isLoading: false }));
        }
        
        resolve(response);
      });
    });
  }, [socket, match, matchData]);

  const showQuestion = useCallback(async (): Promise<SocketResponse> => {
    if (!isConnected || examState.isLoading || !examState || !socket || !match) {
      return { success: false, message: 'Socket không kết nối hoặc thiếu dữ liệu cần thiết' };
    }

    setExamState(prev => ({ ...prev, isLoading: true }));
    
    return new Promise<SocketResponse>((resolve) => {
      const timeout = setTimeout(() => {
        setExamState(prev => ({ ...prev, isLoading: false }));
        resolve({ success: false, message: 'Timeout' });
      }, 10000);
      

      
      // 🔥 FIX: Chỉ hiển thị câu hiện tại, không tăng currentQuestion
      socket.emit('match:showQuestion', { 
        match: match
      }, (response: SocketResponse) => {
        clearTimeout(timeout);
        setExamState(prev => ({ ...prev, isLoading: false }));
        
        if (response?.success && response.data) {
          const responseData = response.data as ShowQuestionResponseData;
          
          setExamState(prev => ({
            ...prev,
            currentQuestion: responseData?.currentQuestion || prev.currentQuestion,
            totalQuestions: responseData?.totalQuestions || prev.totalQuestions,
            status: 'question-shown'
          }));
        }
        
        resolve(response);
      });
    });
  }, [socket, isConnected, examState.isLoading, match]);

  // 🔥 NEW: Timer control functions
  const playTimer = useCallback(async (): Promise<SocketResponse> => {
    if (!socket || !match) {
      return { success: false, message: 'Socket không kết nối hoặc thiếu match' };
    }

    return new Promise((resolve) => {
      socket.emit('timer:play', { match: match }, (response: SocketResponse) => {
        resolve(response);
      });
    });
  }, [socket, match]);

  const pauseTimer = useCallback(async (): Promise<SocketResponse> => {
    if (!socket || !match) {
      return { success: false, message: 'Socket không kết nối hoặc thiếu match' };
    }

    return new Promise((resolve) => {
      socket.emit('timer:pause', { match: match }, (response: SocketResponse) => {
        resolve(response);
      });
    });
  }, [socket, match]);

  const resetTimer = useCallback(async (): Promise<SocketResponse> => {
    if (!socket || !match) {
      return { success: false, message: 'Socket không kết nối hoặc thiếu match' };
    }

    return new Promise((resolve) => {
      socket.emit('timer:reset', { match: match }, (response: SocketResponse) => {
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
    showQuestion,
    
    // 🔥 NEW: Timer controls
    playTimer,
    pauseTimer,
    resetTimer,
  };
}; 