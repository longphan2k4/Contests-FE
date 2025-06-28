import { useState, useEffect } from 'react';
import { useStudentSocket } from './useStudentSocket';

export interface MatchData {
  matchId: number;
  matchName: string;
  contestName: string;
  currentQuestion: number;
  remainingTime: number;
  status: string;
}

export interface MatchResult {
  questionOrder: number;
  isCorrect: boolean;
  submittedAt: string;
}

// Socket response types
interface JoinMatchResponse {
  success: boolean;
  message: string;
  data?: MatchData;
}

interface MatchStatusResponse {
  success: boolean;
  message: string;
  data: {
    matchData: MatchData;
    results: MatchResult[];
  };
}

interface SubmitAnswerResponse {
  success: boolean;
  message: string;
  result?: {
    isCorrect: boolean;
    questionOrder: number;
    submittedAt: string;
    eliminated?: boolean;
    score?: number;
    correctAnswer?: string;
    explanation?: string;
  };
}

// Socket event types
interface MatchStartedEvent {
  matchId: number;
  matchName: string;
  contestName: string;
  status: string;
}

interface QuestionChangedEvent {
  matchId: number;
  currentQuestion: number;
  remainingTime: number;
}

interface TimerUpdatedEvent {
  matchId: number;
  remainingTime: number;
}

interface MatchEndedEvent {
  matchId: number;
  status: string;
}

interface StudentEliminatedEvent {
  message: string;
  questionOrder: number;
  eliminatedAt: string;
  correctAnswer: string;
  explanation: string;
}

export const useStudentMatch = () => {
  console.log('🎮 [STUDENT MATCH] Khởi tạo hook useStudentMatch');
  
  const { socket, isConnected } = useStudentSocket();
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [results, setResults] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log('🔍 [STUDENT MATCH] Socket status:', { 
    connected: isConnected, 
    socketId: socket?.id || 'none' 
  });

  // Join match room
  const joinMatch = (matchId: number) => {
    console.log('🏠 [STUDENT MATCH] Attempting to join match:', matchId);
    
    if (!socket || !isConnected) {
      console.log('❌ [STUDENT MATCH] Cannot join match - socket not connected');
      setError('Kết nối socket không khả dụng');
      return;
    }

    setLoading(true);
    console.log('📤 [STUDENT MATCH] Emitting student:joinMatch event');
    
    socket.emit('student:joinMatch', { matchId }, (response: JoinMatchResponse) => {
      console.log('📥 [STUDENT MATCH] Received joinMatch response:', response);
      
      if (response.success) {
        console.log('✅ [STUDENT MATCH] Joined match successfully');
        getMatchStatus();
      } else {
        console.log('❌ [STUDENT MATCH] Failed to join match:', response.message);
        setError(response.message);
      }
      setLoading(false);
    });
  };

  // Get current match status
  const getMatchStatus = () => {
    console.log('📊 [STUDENT MATCH] Getting match status');
    
    if (!socket || !isConnected) {
      console.log('❌ [STUDENT MATCH] Cannot get status - socket not connected');
      return;
    }

    socket.emit('student:getMatchStatus', (response: MatchStatusResponse) => {
      console.log('📥 [STUDENT MATCH] Received match status:', response);
      
      if (response.success) {
        setMatchData(response.data.matchData);
        setResults(response.data.results || []);
        setError(null);
        console.log('✅ [STUDENT MATCH] Match status updated successfully');
      } else {
        console.log('❌ [STUDENT MATCH] Failed to get match status:', response.message);
        setError(response.message);
      }
    });
  };

  // Submit answer
  const submitAnswer = (matchId: number, questionOrder: number, answer: string) => {
    console.log('🚀 [FE - SUBMIT DEBUG] ===== BẮT ĐẦU SUBMIT ANSWER TỪ FE =====');
    console.log('📋 [FE - SUBMIT DEBUG] Thông tin submit:', {
      matchId,
      questionOrder,
      answer: answer.substring(0, 100) + '...',
      answerLength: answer.length,
      timestamp: new Date().toISOString()
    });

    setIsSubmitting(true);

    return new Promise<SubmitAnswerResponse>((resolve, reject) => {
      if (!socket) {
        const error = 'Socket not connected';
        console.error('❌ [FE - SUBMIT DEBUG] Socket chưa kết nối');
        setIsSubmitting(false);
        reject(new Error(error));
        return;
      }

      console.log('🔍 [FE - SUBMIT DEBUG] Socket đã kết nối, chuẩn bị gửi data...');

      const answerData = {
        matchId,
        questionOrder,
        answer,
        submittedAt: new Date().toISOString()
      };

      console.log('📤 [STUDENT MATCH] Emitting student:submitAnswer event:', answerData);
      console.log('📤 [FE - SUBMIT DEBUG] Dữ liệu gửi đi:', {
        matchId: answerData.matchId,
        questionOrder: answerData.questionOrder,
        answer: answerData.answer.substring(0, 50) + '...',
        submittedAt: answerData.submittedAt
      });

      // Timeout để tránh treo
      const timeout = setTimeout(() => {
        console.error('⏰ [FE - SUBMIT DEBUG] Timeout - BE không response trong 10s');
        setIsSubmitting(false);
        reject(new Error('Timeout waiting for response'));
      }, 10000);

      socket.emit('student:submitAnswer', answerData, (response: SubmitAnswerResponse) => {
        clearTimeout(timeout);
        setIsSubmitting(false);
        
        console.log('📬 [FE - SUBMIT DEBUG] Nhận response từ BE:', {
          success: response?.success,
          message: response?.message,
          hasResult: !!response?.result,
          timestamp: new Date().toISOString()
        });

        if (response?.result) {
          console.log('📊 [FE - SUBMIT DEBUG] Chi tiết kết quả:', {
            isCorrect: response.result.isCorrect,
            questionOrder: response.result.questionOrder,
            submittedAt: response.result.submittedAt,
            eliminated: response.result.eliminated,
            score: response.result.score,
            hasCorrectAnswer: !!response.result.correctAnswer,
            hasExplanation: !!response.result.explanation
          });
        }

        if (response.success) {
          console.log('✅ [FE - SUBMIT DEBUG] Submit thành công!');
          console.log('🚀 [FE - SUBMIT DEBUG] ===== HOÀN THÀNH SUBMIT ANSWER =====');
          resolve(response);
        } else {
          console.error('❌ [FE - SUBMIT DEBUG] Submit thất bại:', response.message);
          console.log('🚀 [FE - SUBMIT DEBUG] ===== KẾT THÚC SUBMIT ANSWER (LỖI) =====');
          reject(new Error(response.message || 'Failed to submit answer'));
        }
      });

      console.log('📡 [FE - SUBMIT DEBUG] Đã emit event, đang chờ response từ BE...');
    });
  };

  // Listen for match events
  useEffect(() => {
    if (!socket) {
      console.log('⏳ [STUDENT MATCH] Socket not ready, skipping event listeners');
      return;
    }

    console.log('🎧 [STUDENT MATCH] Setting up match event listeners');

    // Listen for match started
    const handleMatchStarted = (data: MatchStartedEvent) => {
      console.log('📢 [STUDENT MATCH] Match started event received:', data);
      if (matchData && matchData.matchId === data.matchId) {
        console.log('✅ [STUDENT MATCH] Updating match status to ongoing');
        setMatchData(prev => prev ? { ...prev, status: 'ongoing' } : null);
      }
    };

    // Listen for question changed
    const handleQuestionChanged = (data: QuestionChangedEvent) => {
      console.log('📢 [STUDENT MATCH] Question changed event received:', data);
      if (matchData && matchData.matchId === data.matchId) {
        console.log('✅ [STUDENT MATCH] Updating current question and timer');
        setMatchData(prev => prev ? {
          ...prev,
          currentQuestion: data.currentQuestion,
          remainingTime: data.remainingTime
        } : null);
      }
    };

    // Listen for timer updates
    const handleTimerUpdated = (data: TimerUpdatedEvent) => {
      if (matchData && matchData.matchId === data.matchId) {
        setMatchData(prev => prev ? {
          ...prev,
          remainingTime: data.remainingTime
        } : null);
      }
    };

    // Listen for match ended
    const handleMatchEnded = (data: MatchEndedEvent) => {
      console.log('📢 [STUDENT MATCH] Match ended event received:', data);
      if (matchData && matchData.matchId === data.matchId) {
        console.log('✅ [STUDENT MATCH] Updating match status to finished');
        setMatchData(prev => prev ? { ...prev, status: 'finished' } : null);
      }
    };

    // Listen for elimination
    const handleStudentEliminated = (data: StudentEliminatedEvent) => {
      console.log('🚫 [STUDENT MATCH] Student eliminated event received:', data);
      setError(data.message);
    };

    // Register event listeners
    socket.on('match:started', handleMatchStarted);
    socket.on('match:questionChanged', handleQuestionChanged);
    socket.on('match:timerUpdated', handleTimerUpdated);
    socket.on('match:ended', handleMatchEnded);
    socket.on('student:eliminated', handleStudentEliminated);

    console.log('✅ [STUDENT MATCH] Event listeners registered successfully');

    return () => {
      console.log('🧹 [STUDENT MATCH] Cleaning up event listeners');
      socket.off('match:started', handleMatchStarted);
      socket.off('match:questionChanged', handleQuestionChanged);
      socket.off('match:timerUpdated', handleTimerUpdated);
      socket.off('match:ended', handleMatchEnded);
      socket.off('student:eliminated', handleStudentEliminated);
    };
  }, [socket, matchData]);

  console.log('📊 [STUDENT MATCH] Current state:', {
    matchData: matchData ? `${matchData.matchName} (${matchData.matchId})` : 'none',
    resultsCount: results.length,
    loading,
    error: error || 'none'
  });

  return {
    matchData,
    results,
    loading,
    error,
    joinMatch,
    getMatchStatus,
    submitAnswer,
    isSubmitting,
    // Expose socket connection status
    isConnected
  };
}; 