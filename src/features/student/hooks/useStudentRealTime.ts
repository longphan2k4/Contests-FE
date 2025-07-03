import { useState, useEffect, useCallback } from 'react';
import { useStudentSocket } from './useStudentSocket';
import { useNavigate } from 'react-router-dom';

interface QuestionData {
  id: number;
  content: string;
  intro?: string;
  questionType: string;
  difficulty: string;
  score: number;
  defaultTime: number;
  options: string[];
  correctAnswer?: string;
  explanation?: string;
}

interface CurrentQuestionData {
  order: number;
  question: QuestionData;
}

interface StudentRealTimeState {
  currentQuestion: CurrentQuestionData | null;
  remainingTime: number;
  matchStatus: string;
  isMatchStarted: boolean;
  lastUpdated: string;
}

interface StudentRealTimeReturn {
  realTimeState: StudentRealTimeState;
  isConnected: boolean;
  joinMatchRoom: (matchSlug: string) => void;
  leaveMatchRoom: (matchSlug: string) => void;
}

// Socket event types
interface MatchStartedEvent {
  matchSlug: string;
  matchName: string;
  contestName: string;
  status: string;
  currentQuestion?: number;
  remainingTime?: number;
  currentQuestionData?: CurrentQuestionData;
}

interface QuestionShownEvent {
  matchSlug: string;
  matchName?: string;
  currentQuestion: number;
  remainingTime?: number;
  currentQuestionData: CurrentQuestionData;
}

interface TimerUpdatedEvent {
  timeRemaining: number;
  isActive: boolean;
  isPaused: boolean;
}

interface TimerPausedEvent {
  matchSlug: string;
  pausedBy: string;
}

interface TimerResumedEvent {
  matchSlug: string;
  resumedBy: string;
}

interface TimeUpEvent {
  matchSlug: string;
}

interface MatchEndedEvent {
  matchSlug: string;
  status: string;
}

interface AnswerSubmittedEvent {
  contestantId: number;
  studentName: string;
  studentCode: string;
  questionOrder: number;
  isCorrect: boolean;
  submittedAt: string;
  matchId: number;
  progress: {
    answeredQuestions: number;
    totalQuestions: number;
  };
}

interface ContestantEliminatedEvent {
  contestantId: number;
  studentName: string;
  studentCode: string;
  questionOrder: number;
  eliminationReason: string;
  eliminatedAt: string;
  matchId: number;
}

interface StudentEliminatedEvent {
  message: string;
  questionOrder: number;
  eliminatedAt: string;
  correctAnswer: string;
  explanation: string;
  redirectTo: string;
}

export const useStudentRealTime = (matchIdentifier?: string | number): StudentRealTimeReturn => {
  const { socket, isConnected, joinMatchForAnswering, leaveMatchRoom } = useStudentSocket();
  const navigate = useNavigate();
  
  const [realTimeState, setRealTimeState] = useState<StudentRealTimeState>({
    currentQuestion: null,
    remainingTime: 0,
    matchStatus: 'upcoming',
    isMatchStarted: false,
    lastUpdated: new Date().toISOString()
  });

  // Update real-time state
  const updateState = useCallback((updates: Partial<StudentRealTimeState>) => {
    setRealTimeState(prev => ({
      ...prev,
      ...updates,
      lastUpdated: new Date().toISOString()
    }));
  }, []);

  // Join room khi có matchIdentifier và socket connected
  useEffect(() => {
    if (!isConnected || !matchIdentifier) return;
    
    console.log('🏠 [REALTIME HỌC SINH] Tham gia phòng trận đấu cho matchIdentifier:', matchIdentifier);
    // 🔥 FIX: Sử dụng matchIdentifier (có thể là slug hoặc ID) để join room
    const matchSlug = typeof matchIdentifier === 'string' ? matchIdentifier : matchIdentifier.toString();
    console.log('🔧 [REALTIME HỌC SINH] Converted matchSlug:', matchSlug);
    
    joinMatchForAnswering(matchSlug, (response) => {
      if (response?.success) {
        console.log('✅ [REALTIME HỌC SINH] Đã join match thành công để nhận timer events:', response);
        console.log('🏠 [REALTIME HỌC SINH] Room name từ backend:', response.roomName);
      } else {
        console.error('❌ [REALTIME HỌC SINH] Không thể join match để nhận timer events:', response?.message);
      }
    });

    // Cleanup - leave room khi unmount
    return () => {
      console.log('🚪 [REALTIME HỌC SINH] Rời khỏi phòng trận đấu cho matchIdentifier:', matchIdentifier);
      leaveMatchRoom(matchSlug);
    };
  }, [isConnected, matchIdentifier, joinMatchForAnswering, leaveMatchRoom]);

  // Lắng nghe các socket events từ student namespace (tất cả events bây giờ đến từ 1 socket duy nhất)
  useEffect(() => {
    if (!socket) return;

    console.log('🎧 [REALTIME HỌC SINH] Đăng ký listeners cho student namespace...');

    // Event: Match started - chuyển từ dashboard sang waiting room VÀ hiển thị câu hỏi đầu tiên
    const handleMatchStarted = (data: MatchStartedEvent) => {
      console.log('🔥 [HỌC SINH] Nhận sự kiện match:started từ student namespace:', data);
      
      // 🔥 FIX: So sánh cả slug và ID
      const matchIdString = matchIdentifier?.toString();
      const isMatchingSlug = data.matchSlug === matchIdentifier;
      const isMatchingId = data.matchSlug === matchIdString;
      
      console.log('🔍 [DEBUG] Comparing:', {
        dataMatchSlug: data.matchSlug,
        matchIdentifier: matchIdentifier,
        matchIdString: matchIdString,
        isMatchingSlug: isMatchingSlug,
        isMatchingId: isMatchingId
      });
      
      if (isMatchingSlug || isMatchingId) {
        console.log('🔥 [HỌC SINH] Trận đấu đã bắt đầu - CHỈ cập nhật trạng thái, chờ admin hiển thị câu hỏi...');
        
        // 🔥 NEW: CHỈ cập nhật trạng thái match bắt đầu, KHÔNG xử lý câu hỏi
        updateState({
          matchStatus: 'ongoing',
          isMatchStarted: true
          // 🔥 REMOVED: currentQuestion, remainingTime - sẽ được cập nhật khi admin hiển thị câu hỏi
        });
        
        console.log('✅ [HỌC SINH] Đã cập nhật trạng thái match started, đang chờ admin hiển thị câu hỏi...');
      } else {
        console.log('⏭️ [HỌC SINH] Event match:started không phải cho trận đấu này, bỏ qua');
      }
    };

    // Event: Question changed - cập nhật câu hỏi mới trong waiting room
    const handleQuestionShown = (data: QuestionShownEvent) => {
      console.log('🔥 [HỌC SINH] Nhận sự kiện match:questionShown từ admin - HIỂN THỊ CÂU HỎI:', data);
      console.log('🔍 [DEBUG] Current matchId from hook:', matchIdentifier);
      console.log('🔍 [DEBUG] Received matchId from event:', data.matchSlug);
      
      if (data.currentQuestionData?.question) {
        console.log('📝 [HỌC SINH] Chi tiết câu hỏi admin vừa hiển thị:', {
          id: data.currentQuestionData.question.id,
          questionType: data.currentQuestionData.question.questionType,
          optionsCount: data.currentQuestionData.question.options?.length || 0,
          options: data.currentQuestionData.question.options
        });
      }
      
      // 🔥 FIX: So sánh cả slug và ID
      const matchIdString = matchIdentifier?.toString();
      const isMatchingSlug = data.matchSlug === matchIdentifier;
      const isMatchingId = data.matchSlug === matchIdString;
      
      console.log('🔍 [DEBUG] Question comparing:', {
        dataMatchSlug: data.matchSlug,
        matchIdentifier: matchIdentifier,
        matchIdString: matchIdString,
        isMatchingSlug: isMatchingSlug,
        isMatchingId: isMatchingId
      });
      
      if (isMatchingSlug || isMatchingId) {
        console.log('🔥 [HỌC SINH] ✅ ADMIN VỪA HIỂN THỊ CÂU HỎI - Xử lý hiển thị câu hỏi trong waiting room...');
        console.log('⏰ [HỌC SINH] remainingTime từ event:', data.remainingTime);
        
        const newState = {
          currentQuestion: data.currentQuestionData || null,
          remainingTime: data.remainingTime || 0, // 🔥 FIX: Dùng remainingTime từ event
          isMatchStarted: true,
          matchStatus: 'ongoing'
        };
        
        console.log('🔍 [DEBUG] New state to update:', newState);
        updateState(newState);
      } else {
        console.log('⏭️ [HỌC SINH] Event match:questionShown không phải cho trận đấu này, bỏ qua');
      }
    };

    // Event: Timer updated - cập nhật thời gian còn lại
    const handleTimerUpdated = (data: TimerUpdatedEvent) => {
      console.log('⏰ [HỌC SINH] Timer update từ timer.event.ts:', data);
      console.log('🔍 [DEBUG] Current matchId:', matchIdentifier);
      console.log('🔍 [DEBUG] Socket connected:', isConnected);
      console.log('🔍 [DEBUG] Current realTimeState:', realTimeState);
      
      updateState({
        remainingTime: data.timeRemaining
      });
      
      console.log('✅ [HỌC SINH] Đã cập nhật remainingTime thành:', data.timeRemaining);
    };

    // Event: Timer paused
    const handleTimerPaused = (data: TimerPausedEvent) => {
      console.log('⏸️ [HỌC SINH] Timer tạm dừng:', data);
      if (data.matchSlug === matchIdentifier) {
        // Có thể thêm logic xử lý pause nếu cần
      }
    };

    // Event: Timer resumed
    const handleTimerResumed = (data: TimerResumedEvent) => {
      console.log('▶️ [HỌC SINH] Timer tiếp tục:', data);
      if (data.matchSlug === matchIdentifier) {
        // Có thể thêm logic xử lý resume nếu cần
      }
    };

    // Event: Time up
    const handleTimeUp = (data: TimeUpEvent) => {
      console.log('⏰ [HỌC SINH] Hết thời gian:', data);
      if (data.matchSlug === matchIdentifier) {
        updateState({
          remainingTime: 0
        });
      }
    };

    // Event: Match ended
    const handleMatchEnded = (data: MatchEndedEvent) => {
      console.log('🏁 [HỌC SINH] Trận đấu kết thúc:', data);
      if (data.matchSlug === matchIdentifier) {
        updateState({
          matchStatus: data.status,
          isMatchStarted: false,
          remainingTime: 0
        });

        // Auto redirect sau 3 giây
        setTimeout(() => {
          navigate('/student/dashboard');
        }, 3000);
      }
    };

    // Event: Answer submitted (thông báo về câu trả lời của các thí sinh khác)
    const handleAnswerSubmitted = (data: AnswerSubmittedEvent) => {
      console.log('📝 [HỌC SINH] Thí sinh khác đã trả lời:', {
        studentName: data.studentName,
        questionOrder: data.questionOrder,
        isCorrect: data.isCorrect
      });
      // Chỉ log, không cần update state
    };

    // Event: Contestant eliminated (thông báo thí sinh khác bị loại)
    const handleContestantEliminated = (data: ContestantEliminatedEvent) => {
      console.log('🚫 [HỌC SINH] Thí sinh khác bị loại:', {
        studentName: data.studentName,
        reason: data.eliminationReason
      });
      // Chỉ log, không cần update state
    };

    // Event: Student eliminated (cho chính thí sinh bị loại)
    const handleStudentEliminated = (data: StudentEliminatedEvent) => {
      console.log('🚫 [HỌC SINH] Bạn đã bị loại:', data);

      alert(`${data.message}\n\nCâu trả lời đúng: ${data.correctAnswer}\nGiải thích: ${data.explanation}`);

      updateState({
        matchStatus: 'eliminated',
        isMatchStarted: false
      });

      setTimeout(() => {
        navigate(data.redirectTo || '/student/dashboard');
      }, 5000);
    };

    // Đăng ký tất cả event listeners cho student namespace (chỉ 1 socket duy nhất)
    socket.on('match:started', handleMatchStarted);
    socket.on('match:questionShown', handleQuestionShown);
    socket.on('timer:update', handleTimerUpdated);
    socket.on('match:ended', handleMatchEnded);
    socket.on('match:timerPaused', handleTimerPaused);
    socket.on('match:timerResumed', handleTimerResumed);
    socket.on('match:timeUp', handleTimeUp);
    socket.on('match:answerSubmitted', handleAnswerSubmitted);
    socket.on('contestant:eliminated', handleContestantEliminated);
    socket.on('student:eliminated', handleStudentEliminated);

    // Backup global listener cho global events (không cần matchId check)
    socket.on('match:globalStarted', (data: MatchStartedEvent) => {
      console.log('🌍 [REALTIME HỌC SINH] Global match started event received (backup):', data);
      handleMatchStarted(data);
    });

    socket.on('match:globalQuestionShown', (data: QuestionShownEvent) => {
      console.log('🌍 [REALTIME HỌC SINH] Global question shown event received (backup):', data);
      if (data.matchSlug === matchIdentifier) {
        console.log('🌍 [REALTIME HỌC SINH] Global question matched our matchId - processing...');
        handleQuestionShown(data);
      } else {
        console.log('🌍 [REALTIME HỌC SINH] Global question for different match - ignoring');
      }
    });

    console.log('✅ [REALTIME HỌC SINH] Đã đăng ký tất cả event listeners cho student namespace');

    return () => {
      // Cleanup event listeners
      console.log('🧹 [REALTIME HỌC SINH] Dọn dẹp event listeners...');
      socket.off('match:started', handleMatchStarted);
      socket.off('match:questionShown', handleQuestionShown);
      socket.off('timer:update', handleTimerUpdated);
      socket.off('match:ended', handleMatchEnded);
      socket.off('match:timerPaused', handleTimerPaused);
      socket.off('match:timerResumed', handleTimerResumed);
      socket.off('match:timeUp', handleTimeUp);
      socket.off('match:answerSubmitted', handleAnswerSubmitted);
      socket.off('contestant:eliminated', handleContestantEliminated);
      socket.off('student:eliminated', handleStudentEliminated);
      socket.off('match:globalStarted', handleMatchStarted);
      socket.off('match:globalQuestionShown', handleQuestionShown);
      
      console.log('🧹 [REALTIME HỌC SINH] Đã dọn dẹp tất cả event listeners');
    };
  }, [socket, matchIdentifier, updateState, navigate, realTimeState.remainingTime]);

  return {
    realTimeState,
    isConnected,
    joinMatchRoom: (matchSlug: string) => joinMatchForAnswering(matchSlug),
    leaveMatchRoom,
  };
}; 