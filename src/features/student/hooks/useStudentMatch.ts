import { useState, useEffect } from "react";
import { useStudentSocket } from "./useStudentSocket";

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

interface MediaData {
  id: string;
  type: "image" | "video" | "audio";
  url: string;
  thumbnail?: string;
  title?: string;
  description?: string;
}

interface QuestionShownEvent {
  matchId: number;
  matchSlug: string;
  currentQuestion: number;
  currentQuestionData: {
    order: number;
    question: {
      id: number;
      intro?: string;
      content: string;
      questionType: string;
      difficulty: string;
      defaultTime: number;
      score: number;
      options: string[];
      media?: MediaData[];
    };
  };
}

interface TimerUpdatedEvent {
  timeRemaining: number;
  isActive: boolean;
  isPaused: boolean;
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
  const { socket, isConnected } = useStudentSocket();
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [results, setResults] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Join match room
  const joinMatch = (matchSlug: string) => {
    if (!socket || !isConnected) {
      setError("Kết nối socket không khả dụng");
      return;
    }

    setLoading(true);

    socket.emit(
      "student:joinMatch",
      { matchSlug },
      (response: JoinMatchResponse) => {
        if (response.success) {
          getMatchStatus();
        } else {
          setError(response.message);
        }
        setLoading(false);
      }
    );
  };

  // Get current match status
  const getMatchStatus = () => {
    if (!socket || !isConnected) {
      return;
    }

    socket.emit("student:getMatchStatus", (response: MatchStatusResponse) => {
      if (response.success) {
        setMatchData(response.data.matchData);
        setResults(response.data.results || []);
        setError(null);
      } else {
        setError(response.message);
      }
    });
  };

  // Socket event listeners setup
  useEffect(() => {
    if (!socket || !isConnected) {
      return;
    }

    // Handle match events
    const handleMatchStarted = (data: MatchStartedEvent) => {
      setMatchData((prev) => (prev ? { ...prev, status: data.status } : null));
    };

    const handleQuestionShown = (data: QuestionShownEvent) => {
      setMatchData((prev) =>
        prev
          ? {
              ...prev,
              currentQuestion: data.currentQuestion,
              remainingTime: prev.remainingTime,
            }
          : null
      );
    };

    const handleTimerUpdated = (data: TimerUpdatedEvent) => {
      setMatchData((prev) =>
        prev
          ? {
              ...prev,
              remainingTime: data.timeRemaining,
            }
          : null
      );
    };

    const handleMatchEnded = (data: MatchEndedEvent) => {
      setMatchData((prev) => (prev ? { ...prev, status: data.status } : null));
    };

    const handleStudentEliminated = (data: StudentEliminatedEvent) => {
      setError(data.message);
    };

    // Register event listeners
    socket.on("match:started", handleMatchStarted);
    socket.on("match:questionShown", handleQuestionShown);
    socket.on("timer:update", handleTimerUpdated);
    socket.on("match:ended", handleMatchEnded);
    socket.on("student:eliminated", handleStudentEliminated);


    // Cleanup function
    return () => {
      socket.off("match:started", handleMatchStarted);
      socket.off("match:questionShown", handleQuestionShown);
      socket.off("timer:update", handleTimerUpdated);
      socket.off("match:ended", handleMatchEnded);
      socket.off("student:eliminated", handleStudentEliminated);
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
