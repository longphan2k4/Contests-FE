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

  // Socket event listeners setup
  useEffect(() => {
    if (!socket || !isConnected) {
      console.log('🔍 [STUDENT MATCH] Socket not ready, skipping event setup');
      return;
    }

    console.log('🎧 [STUDENT MATCH] Setting up socket event listeners');

    // Handle match events
    const handleMatchStarted = (data: MatchStartedEvent) => {
      console.log('🚀 [STUDENT MATCH] Match started event received:', data);
      setMatchData(prev => prev ? { ...prev, status: data.status } : null);
    };

    const handleQuestionChanged = (data: QuestionChangedEvent) => {
      console.log('❓ [STUDENT MATCH] Question changed event received:', data);
      setMatchData(prev => prev ? {
        ...prev,
        currentQuestion: data.currentQuestion,
        remainingTime: data.remainingTime
      } : null);
    };

    const handleTimerUpdated = (data: TimerUpdatedEvent) => {
      console.log('⏱️ [STUDENT MATCH] Timer updated event received:', data);
      setMatchData(prev => prev ? {
        ...prev,
        remainingTime: data.remainingTime
      } : null);
    };

    const handleMatchEnded = (data: MatchEndedEvent) => {
      console.log('🏁 [STUDENT MATCH] Match ended event received:', data);
      setMatchData(prev => prev ? { ...prev, status: data.status } : null);
    };

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

    // Cleanup function
    return () => {
      console.log('🧹 [STUDENT MATCH] Cleaning up event listeners');
      socket.off('match:started', handleMatchStarted);
      socket.off('match:questionChanged', handleQuestionChanged);
      socket.off('match:timerUpdated', handleTimerUpdated);
      socket.off('match:ended', handleMatchEnded);
      socket.off('student:eliminated', handleStudentEliminated);
    };
  }, [socket, isConnected]);

  return {
    // State
    matchData,
    results,
    loading,
    error,
    isConnected,

    // Actions
    joinMatch,
    getMatchStatus,
  };
}; 