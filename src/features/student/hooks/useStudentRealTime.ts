import { useState, useEffect, useCallback } from "react";
import { useStudentSocket } from "./useStudentSocket";
import { useNavigate } from "react-router-dom";
import { useStudentAuth } from "./useStudentAuth";

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
  isEliminated: boolean;
  eliminationMessage: string;
  isRescued: boolean;
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

interface StudentEliminatedEvent {
  message: string;
  questionOrder: number;
  eliminatedAt: string;
  correctAnswer: string;
  explanation: string;
  redirectTo: string;
}

interface StudentRescuedEvent {
  rescuedContestantIds: number[];
  message: string;
}

export const useStudentRealTime = (
  matchIdentifier?: string | number
): StudentRealTimeReturn => {
  const { socket, isConnected, joinMatchForAnswering, leaveMatchRoom } =
    useStudentSocket();
  const { getContestantInfo } = useStudentAuth();
  const navigate = useNavigate();

  const [realTimeState, setRealTimeState] = useState<StudentRealTimeState>({
    currentQuestion: null,
    remainingTime: 0,
    matchStatus: "upcoming",
    isMatchStarted: false,
    isEliminated: false,
    eliminationMessage: "",
    isRescued: false,
    lastUpdated: new Date().toISOString(),
  });

  // Update real-time state
  const updateState = useCallback((updates: Partial<StudentRealTimeState>) => {
    setRealTimeState((prev) => ({
      ...prev,
      ...updates,
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  // Join room khi có matchIdentifier và socket connected
  useEffect(() => {
    if (!isConnected || !matchIdentifier) return;

    // 🔥 FIX: Sử dụng matchIdentifier (có thể là slug hoặc ID) để join room
    const matchSlug =
      typeof matchIdentifier === "string"
        ? matchIdentifier
        : matchIdentifier.toString();

    joinMatchForAnswering(matchSlug, () => {

    });

    // Cleanup - leave room khi unmount
    return () => {
      leaveMatchRoom(matchSlug);
    };
  }, [isConnected, matchIdentifier, joinMatchForAnswering, leaveMatchRoom]);

  // Lắng nghe các socket events từ student namespace (tất cả events bây giờ đến từ 1 socket duy nhất)
  useEffect(() => {
    if (!socket) return;



    // Event: Match started - chuyển từ dashboard sang waiting room VÀ hiển thị câu hỏi đầu tiên
    const handleMatchStarted = (data: MatchStartedEvent) => {


      // 🔥 FIX: So sánh cả slug và ID
      const matchIdString = matchIdentifier?.toString();
      const isMatchingSlug = data.matchSlug === matchIdentifier;
      const isMatchingId = data.matchSlug === matchIdString;



      if (isMatchingSlug || isMatchingId) {


        // 🔥 NEW: CHỈ cập nhật trạng thái match bắt đầu, KHÔNG xử lý câu hỏi
        updateState({
          matchStatus: "ongoing",
          isMatchStarted: true,
          // 🔥 REMOVED: currentQuestion, remainingTime - sẽ được cập nhật khi admin hiển thị câu hỏi
        });


      } 
    };

    // Event: Question changed - cập nhật câu hỏi mới trong waiting room
    const handleQuestionShown = (data: QuestionShownEvent) => {
      // 🔥 FIX: So sánh cả slug và ID
      const matchIdString = matchIdentifier?.toString();
      const isMatchingSlug = data.matchSlug === matchIdentifier;
      const isMatchingId = data.matchSlug === matchIdString;

      if (isMatchingSlug || isMatchingId) {
        const newState = {
          currentQuestion: data.currentQuestionData || null,
          remainingTime: data.remainingTime || 0, // 🔥 FIX: Dùng remainingTime từ event
          isMatchStarted: true,
          matchStatus: "ongoing",
        };

        updateState(newState);
      }
    };

    // Event: Timer updated - cập nhật thời gian còn lại
    const handleTimerUpdated = (data: TimerUpdatedEvent) => {
      updateState({
        remainingTime: data.timeRemaining,
      });
    };

    // Event: Timer paused
    const handleTimerPaused = (data: TimerPausedEvent) => {
      if (data.matchSlug === matchIdentifier) {
        // Có thể thêm logic xử lý pause nếu cần
      }
    };

    // Event: Timer resumed
    const handleTimerResumed = (data: TimerResumedEvent) => {
      if (data.matchSlug === matchIdentifier) {
        // Có thể thêm logic xử lý resume nếu cần
      }
    };

    // Event: Time up
    const handleTimeUp = (data: TimeUpEvent) => {
      if (data.matchSlug === matchIdentifier) {
        updateState({
          remainingTime: 0,
        });
      }
    };

    // Event: Match ended
    const handleMatchEnded = (data: MatchEndedEvent) => {
      if (data.matchSlug === matchIdentifier) {
        updateState({
          matchStatus: data.status,
          isMatchStarted: false,
          remainingTime: 0,
        });

        // Auto redirect sau 3 giây
        setTimeout(() => {
          navigate("/student/dashboard");
        }, 3000);
      }
    };

    // Event: Student eliminated (cho chính thí sinh bị loại)
    const handleStudentEliminated = (data: StudentEliminatedEvent) => {
      // 🔥 NEW: State is now the single source of truth.
      // The UI component will be responsible for showing notifications.
      updateState({
        isEliminated: true,
        eliminationMessage:
          data.message || "Bạn đã bị loại do trả lời sai hoặc hết giờ.",
        isRescued: false, // Reset rescue status when eliminated
      });
    };

    // 🔥 NEW: Event: Thí sinh được cứu trợ
    const handleStudentRescued = (data: StudentRescuedEvent) => {
      const contestantInfo = getContestantInfo();

      if (
        contestantInfo &&
        data.rescuedContestantIds.includes(
          contestantInfo.contestant.registrationNumber
        )
      ) {
        // Cập nhật trạng thái để component có thể phản ứng
        // The UI component will show a notification based on this state change.
        updateState({
          isEliminated: false,
          eliminationMessage: "",
          isRescued: true, // Mark as rescued
        });

        // 🔥 NEW: Reset rescue status after a short delay to allow UI to react
        setTimeout(() => {
          updateState({ isRescued: false });
        }, 2000); // 2 seconds delay
      }
    };

    // Đăng ký tất cả event listeners cho student namespace (chỉ 1 socket duy nhất)
    socket.on("match:started", handleMatchStarted);
    socket.on("match:questionShown", handleQuestionShown);
    socket.on("timer:update", handleTimerUpdated);
    socket.on("match:ended", handleMatchEnded);
    socket.on("match:timerPaused", handleTimerPaused);
    socket.on("match:timerResumed", handleTimerResumed);
    socket.on("match:timeUp", handleTimeUp);
    socket.on("student:eliminated", handleStudentEliminated);
    socket.on("student:rescued", handleStudentRescued);

    // Backup global listener cho global events (không cần matchId check)
    socket.on("match:globalStarted", (data: MatchStartedEvent) => {
      handleMatchStarted(data);
    });

    socket.on("match:globalQuestionShown", (data: QuestionShownEvent) => {
      if (data.matchSlug === matchIdentifier) {
        handleQuestionShown(data);
      }
    });

    return () => {
      // Cleanup event listeners
      socket.off("match:started", handleMatchStarted);
      socket.off("match:questionShown", handleQuestionShown);
      socket.off("timer:update", handleTimerUpdated);
      socket.off("match:ended", handleMatchEnded);
      socket.off("match:timerPaused", handleTimerPaused);
      socket.off("match:timerResumed", handleTimerResumed);
      socket.off("match:timeUp", handleTimeUp);
      socket.off("student:eliminated", handleStudentEliminated);
      socket.off("match:globalStarted", handleMatchStarted);
      socket.off("match:globalQuestionShown", handleQuestionShown);
      socket.off("student:rescued", handleStudentRescued);
    };
  }, [
    socket,
    matchIdentifier,
    updateState,
    navigate,
    realTimeState.remainingTime,
    getContestantInfo,
  ]);

  return {
    realTimeState,
    isConnected,
    joinMatchRoom: (matchSlug: string) => joinMatchForAnswering(matchSlug),
    leaveMatchRoom,
  };
};
