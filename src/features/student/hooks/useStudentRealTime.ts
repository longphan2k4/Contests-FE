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
  joinMatchRoom: (matchId: number) => void;
  leaveMatchRoom: (matchId: number) => void;
}

// Socket event types
interface MatchStartedEvent {
  matchId: number;
  matchName: string;
  contestName: string;
  status: string;
  currentQuestion?: number;
  remainingTime?: number;
  currentQuestionData?: CurrentQuestionData;
}

interface QuestionChangedEvent {
  matchId: number;
  currentQuestion: number;
  remainingTime: number;
  currentQuestionData?: CurrentQuestionData;
}

interface TimerUpdatedEvent {
  matchId: number;
  remainingTime: number;
}

interface TimerPausedEvent {
  matchId: number;
  pausedBy: string;
}

interface TimerResumedEvent {
  matchId: number;
  resumedBy: string;
}

interface TimeUpEvent {
  matchId: number;
}

interface MatchEndedEvent {
  matchId: number;
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

export const useStudentRealTime = (matchId?: number): StudentRealTimeReturn => {
  const { socket, isConnected, joinMatchRoom, leaveMatchRoom } = useStudentSocket();
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

  // Join room khi có matchId và socket connected
  useEffect(() => {
    if (!isConnected || !matchId) return;
    
    console.log('🏠 [REALTIME HỌC SINH] Tham gia phòng trận đấu cho matchId:', matchId);
    joinMatchRoom(matchId);

    // Cleanup - leave room khi unmount
    return () => {
      console.log('🚪 [REALTIME HỌC SINH] Rời khỏi phòng trận đấu cho matchId:', matchId);
      leaveMatchRoom(matchId);
    };
  }, [isConnected, matchId, joinMatchRoom, leaveMatchRoom]);

  // Lắng nghe các socket events từ student namespace (tất cả events bây giờ đến từ 1 socket duy nhất)
  useEffect(() => {
    if (!socket) return;

    console.log('🎧 [REALTIME HỌC SINH] Đăng ký listeners cho student namespace...');

    // Event: Match started - chuyển từ dashboard sang waiting room VÀ hiển thị câu hỏi đầu tiên
    const handleMatchStarted = (data: MatchStartedEvent) => {
      console.log('🔥 [HỌC SINH] Nhận sự kiện match:started từ student namespace:', data);
      
      if (data.matchId === matchId) {
        console.log('🔥 [HỌC SINH] Trận đấu đã bắt đầu - cập nhật state và hiển thị câu hỏi đầu tiên...');
        
        // 🔥 NEW: Cập nhật state bao gồm câu hỏi đầu tiên nếu có
        const newState: Partial<StudentRealTimeState> = {
          matchStatus: 'ongoing',
          isMatchStarted: true
        };

        // Nếu có câu hỏi đầu tiên trong event match:started
        if (data.currentQuestionData && data.currentQuestion && data.remainingTime !== undefined) {
          console.log('🎯 [HỌC SINH] Nhận được câu hỏi đầu tiên cùng với match:started:', {
            questionOrder: data.currentQuestion,
            questionId: data.currentQuestionData.question.id,
            remainingTime: data.remainingTime
          });
          
          newState.currentQuestion = data.currentQuestionData;
          newState.remainingTime = data.remainingTime;
        } else {
          console.log('⏳ [HỌC SINH] Chưa có câu hỏi đầu tiên, đang chờ event match:questionChanged...');
        }
        
        updateState(newState);
      }
    };

    // Event: Question changed - cập nhật câu hỏi mới trong waiting room
    const handleQuestionChanged = (data: QuestionChangedEvent) => {
      console.log('🔥 [HỌC SINH] Nhận sự kiện match:questionChanged từ student namespace:', data);
      console.log('🔍 [DEBUG] Current matchId from hook:', matchId);
      console.log('🔍 [DEBUG] Received matchId from event:', data.matchId);
      
      if (data.currentQuestionData?.question) {
        console.log('📝 [HỌC SINH] Chi tiết câu hỏi nhận được:', {
          id: data.currentQuestionData.question.id,
          questionType: data.currentQuestionData.question.questionType,
          optionsCount: data.currentQuestionData.question.options?.length || 0,
          options: data.currentQuestionData.question.options
        });
      }
      
      if (data.matchId === matchId) {
        console.log('🔥 [HỌC SINH] Xử lý thay đổi câu hỏi trong waiting room...');
        
        const newState = {
          currentQuestion: data.currentQuestionData || null,
          remainingTime: data.remainingTime,
          isMatchStarted: true,
          matchStatus: 'ongoing'
        };
        
        console.log('🔍 [DEBUG] New state to update:', newState);
        updateState(newState);
      }
    };

    // Event: Timer updated - cập nhật thời gian còn lại
    const handleTimerUpdated = (data: TimerUpdatedEvent) => {
      if (data.matchId === matchId) {
        updateState({
          remainingTime: data.remainingTime
        });
      }
    };

    // Event: Timer paused
    const handleTimerPaused = (data: TimerPausedEvent) => {
      console.log('⏸️ [HỌC SINH] Timer tạm dừng:', data);
      if (data.matchId === matchId) {
        // Có thể thêm logic xử lý pause nếu cần
      }
    };

    // Event: Timer resumed
    const handleTimerResumed = (data: TimerResumedEvent) => {
      console.log('▶️ [HỌC SINH] Timer tiếp tục:', data);
      if (data.matchId === matchId) {
        // Có thể thêm logic xử lý resume nếu cần
      }
    };

    // Event: Time up
    const handleTimeUp = (data: TimeUpEvent) => {
      console.log('⏰ [HỌC SINH] Hết thời gian:', data);
      if (data.matchId === matchId) {
        updateState({
          remainingTime: 0
        });
      }
    };

    // Event: Match ended
    const handleMatchEnded = (data: MatchEndedEvent) => {
      console.log('🏁 [HỌC SINH] Trận đấu kết thúc:', data);
      if (data.matchId === matchId) {
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
    socket.on('match:questionChanged', handleQuestionChanged);
    socket.on('match:timerUpdated', handleTimerUpdated);
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

    socket.on('match:globalQuestionChanged', (data: QuestionChangedEvent) => {
      console.log('🌍 [REALTIME HỌC SINH] Global question changed event received (backup):', data);
      if (data.matchId === matchId) {
        console.log('🌍 [REALTIME HỌC SINH] Global question matched our matchId - processing...');
        handleQuestionChanged(data);
      } else {
        console.log('🌍 [REALTIME HỌC SINH] Global question for different match - ignoring');
      }
    });

    console.log('✅ [REALTIME HỌC SINH] Đã đăng ký tất cả event listeners cho student namespace');

    return () => {
      // Cleanup event listeners
      console.log('🧹 [REALTIME HỌC SINH] Dọn dẹp event listeners...');
      socket.off('match:started', handleMatchStarted);
      socket.off('match:questionChanged', handleQuestionChanged);
      socket.off('match:timerUpdated', handleTimerUpdated);
      socket.off('match:ended', handleMatchEnded);
      socket.off('match:timerPaused', handleTimerPaused);
      socket.off('match:timerResumed', handleTimerResumed);
      socket.off('match:timeUp', handleTimeUp);
      socket.off('match:answerSubmitted', handleAnswerSubmitted);
      socket.off('contestant:eliminated', handleContestantEliminated);
      socket.off('student:eliminated', handleStudentEliminated);
      socket.off('match:globalStarted', handleMatchStarted);
      socket.off('match:globalQuestionChanged', handleQuestionChanged);
      
      console.log('🧹 [REALTIME HỌC SINH] Đã dọn dẹp tất cả event listeners');
    };
  }, [socket, matchId, updateState, navigate]);

  return {
    realTimeState,
    isConnected,
    joinMatchRoom,
    leaveMatchRoom,
  };
}; 