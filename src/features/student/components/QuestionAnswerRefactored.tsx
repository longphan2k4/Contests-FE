import React, { useState, useEffect, useCallback, useRef } from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { Quiz } from "@mui/icons-material";
import { useStudentSocket } from "../hooks/useStudentSocket";
import {
  SubmitAnswerService,
  BanContestantService,
} from "../services/submitAnswerService";
import { useNotification } from "../../../contexts/NotificationContext";
import { useAntiCheat, type AntiCheatViolation } from "../hooks/useAntiCheat";
import AntiCheatWarning from "./AntiCheatWarning";
import RescueAnimation from "./RescueAnimation";
import type { SubmitAnswerResponse } from "../services/submitAnswerService";

// Import các component con đã tách
import QuestionHeader from "./QuestionHeader";
import QuestionContent from "./QuestionContent";
import QuestionOptions from "./QuestionOptions";
import QuestionResult from "./QuestionResult";
import AntiCheatStatus from "./AntiCheatStatus";
import OtherStudentNotification from "./OtherStudentNotification";
import MediaModal from "./MediaModal";
import EssayInput from "./EssayInput";
// import DebugStatus from "./DebugStatus";

interface MediaData {
  id: string;
  type: "image" | "video" | "audio";
  url: string;
  thumbnail?: string;
  title?: string;
  description?: string;
}

interface QuestionData {
  id: number;
  content: string;
  intro?: string;
  questionType: string; // Đây là field chính xác từ server
  difficulty: string;
  score: number;
  defaultTime: number;
  options: string[];
  correctAnswer?: string;
  explanation?: string;
  media?: MediaData[];
}

interface CurrentQuestionData {
  order: number;
  question: QuestionData;
}

interface QuestionAnswerProps {
  currentQuestion: CurrentQuestionData | null;
  remainingTime: number;
  matchId: number;
  isConnected: boolean;
  isBanned: boolean;
  banMessage: string;
  onContestantBanned: (message: string) => void;
  isEliminated: boolean;
  eliminationMessage: string;
  isRescued: boolean;
}

interface OtherStudentAnswer {
  studentName: string;
  isCorrect: boolean;
  questionOrder: number;
  submittedAt: string;
  contestantId: number;
}

const QuestionAnswerRefactored: React.FC<QuestionAnswerProps> = ({
  currentQuestion,
  remainingTime,
  matchId,
  isBanned,
  banMessage,
  onContestantBanned,
  isEliminated,
  eliminationMessage,
  isRescued,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasJoinedMatch, setHasJoinedMatch] = useState(false);
  const [answerResult, setAnswerResult] = useState<{
    isCorrect: boolean;
    correctAnswer: string | number[];
    explanation?: string;
    score: number;
    eliminated: boolean;
    questionOrder: number;
    submittedAt: string;
  } | null>(null);

  // 🔥 NEW: State để track elimination status
  const [isEliminatedState, setIsEliminatedState] = useState(isEliminated);
  const [eliminationMessageState, setEliminationMessageState] =
    useState<string>(eliminationMessage);

  // 🎉 NEW: Rescue animation states
  const [showRescueAnimation, setShowRescueAnimation] = useState(false);
  const [isInRescueMode, setIsInRescueMode] = useState(false);
  const [rescueMessage, setRescueMessage] = useState("");
  const [justRescued, setJustRescued] = useState(false);

  // NEW: State để lưu kết quả tạm thời từ server (chưa hiển thị)
  const [pendingResult, setPendingResult] = useState<{
    isCorrect: boolean;
    correctAnswer: string | number[];
    explanation?: string;
    score: number;
    eliminated: boolean;
    questionOrder: number;
    submittedAt: string;
  } | null>(null);

  const [latestAnswer, setLatestAnswer] = useState<OtherStudentAnswer | null>(
    null
  );
  const [showNotification, setShowNotification] = useState(false);
  const [isApiSubmitting, setIsApiSubmitting] = useState(false);
  const [canShowResult, setCanShowResult] = useState(false);

  // State cho media modal
  const [selectedMedia, setSelectedMedia] = useState<MediaData | null>(null);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);

  // 🛡️ NEW: Anti-cheat states
  const [showAntiCheatWarning, setShowAntiCheatWarning] = useState(false);
  const antiCheatWarningTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    socket: studentSocket,
    isConnected: isStudentSocketConnected,
    joinMatchForAnswering,
  } = useStudentSocket();

  const {
    showSuccessNotification,
    showErrorNotification,
    showWarningNotification,
  } = useNotification();

  // 🛡️ NEW: Anti-cheat callbacks
  const handleViolation = useCallback(
    (violation: AntiCheatViolation) => {
      setShowAntiCheatWarning(true);
      showWarningNotification(
        `⚠️ Phát hiện vi phạm: ${violation.description}`,
        "Cảnh báo chống gian lận",
        4000
      );
      if (antiCheatWarningTimer.current) {
        clearTimeout(antiCheatWarningTimer.current);
      }
      antiCheatWarningTimer.current = setTimeout(() => {
        setShowAntiCheatWarning(false);
      }, 5000);
    },
    [showWarningNotification]
  );

  const handleAntiCheatTerminate = useCallback(() => {
    showErrorNotification(
      "Bài thi đã bị kết thúc do vi phạm quy định chống gian lận!",
      "Kết thúc bài thi",
      0
    );
  }, [showErrorNotification]);

  const handleWarningContinue = useCallback(() => {
    setShowAntiCheatWarning(false);
    if (antiCheatWarningTimer.current) {
      clearTimeout(antiCheatWarningTimer.current);
    }
  }, []);

  const handleWarningTerminate = useCallback(() => {
    handleAntiCheatTerminate();
    setShowAntiCheatWarning(false);
    if (antiCheatWarningTimer.current) {
      clearTimeout(antiCheatWarningTimer.current);
    }
  }, [handleAntiCheatTerminate]);
  
  //tuankiet: Tat anticheat tam thoi
  const ENABLE_ANTICHEAT = false;
  // 🛡️ NEW: Anti-cheat hook
  const {
    violations,
    warningCount,
    //quy
    // isFullscreen,
    startMonitoring,
    stopMonitoring,
    resetViolations, // 🔥 NEW: Thêm resetViolations
    maxViolations,
    isMonitoring,
  } = useAntiCheat(
    {
      enableFullscreen: ENABLE_ANTICHEAT,
      enableTabSwitchDetection: ENABLE_ANTICHEAT,
      enableCopyPasteBlocking: ENABLE_ANTICHEAT,
      enableContextMenuBlocking: ENABLE_ANTICHEAT,
      enableDevToolsBlocking: ENABLE_ANTICHEAT,
      maxViolations: 3,
      warningBeforeTermination: true,
    },
    handleViolation,
    handleAntiCheatTerminate
  );
  useEffect(() => {
    if (isBanned && !isRescued) {
      stopMonitoring();
    }
  }, [isBanned, isRescued, stopMonitoring]);
  // 🛡️ NEW: Start anti-cheat monitoring khi có câu hỏi
  useEffect(() => {
    if (currentQuestion && (!isEliminatedState || isRescued)) {
      startMonitoring();
    }
    return () => {
      stopMonitoring();
    };
  }, [
    currentQuestion,
    isEliminatedState,
    isRescued,
    startMonitoring,
    stopMonitoring,
  ]);

  // 🛡️ NEW: Gọi API ban khi đủ số lần vi phạm
  useEffect(() => {
    if (warningCount >= maxViolations && matchId && !isBanned && !isRescued) {
      const banContestant = async () => {
        try {
          const violationTypes = violations.map((v) => v.type).join(", ");
          const reason = `Vi phạm ${warningCount} lần: ${violationTypes}. Hệ thống tự động cấm tham gia.`;

          const response = await BanContestantService.banContestant(
            matchId,
            "anti_cheat_multiple_violations",
            warningCount,
            reason,
            "ANTI_CHEAT_SYSTEM"
          );

          if (response.success) {
            onContestantBanned(
              response.message ||
              "Bạn đã bị cấm thi do vi phạm quy chế nhiều lần."
            );
          } else {
            console.error(
              "❌ [BAN] Không thể ban contestant:",
              response.message
            );
            showErrorNotification("Bạn đã bị cấm trước đó!", "Cấm", 0);
          }
        } catch (error) {
          console.error("💥 [BAN] Lỗi khi gọi API ban:", error);
          showErrorNotification(
            "Lỗi kết nối khi xử lý cấm tham gia!",
            "Lỗi kết nối",
            0
          );
        }
      };

      banContestant();
    }
  }, [
    warningCount,
    maxViolations,
    matchId,
    violations,
    showErrorNotification,
    isBanned,
    isRescued,
    onContestantBanned,
  ]);

  // Join match để có thể submit answer
  useEffect(() => {
    if (
      isStudentSocketConnected &&
      matchId &&
      joinMatchForAnswering &&
      !hasJoinedMatch
    ) {
      joinMatchForAnswering(matchId.toString(), (response) => {
        if (response?.success) {
          setHasJoinedMatch(true);
        }
      });
    }
  }, [
    isStudentSocketConnected,
    matchId,
    joinMatchForAnswering,
    hasJoinedMatch,
    studentSocket,
  ]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (antiCheatWarningTimer.current) {
        clearTimeout(antiCheatWarningTimer.current);
      }
    };
  }, []);

  // Reset khi có câu hỏi mới
  useEffect(() => {
    if (currentQuestion) {
      setSelectedAnswer("");
      setIsSubmitted(false);
      setAnswerResult(null);
      setPendingResult(null);
      setLatestAnswer(null);
      setShowNotification(false);
      setCanShowResult(false);
      setJustRescued(false);
    }
  }, [currentQuestion]);

  // 🔥 NEW: Set canShowResult chỉ khi remainingTime < 1
  //tuankiet: ko kich hoat theo thoi gian
  // useEffect(() => {
  //   if (remainingTime < 1 && !canShowResult) {
  //     setCanShowResult(true);
  //   }
  // }, [remainingTime, canShowResult]);
  studentSocket?.on("show-answer",()=>{
    setCanShowResult(true)
  })

  // 🔥 NEW: Sync local state with props from parent
  useEffect(() => {
    setIsEliminatedState(isEliminated);
    setEliminationMessageState(eliminationMessage);
  }, [isEliminated, eliminationMessage]);

  // 🔥 NEW: Logic hiển thị kết quả khi có pendingResult
  useEffect(() => {
    // 🔧 SỬA: Chỉ hiển thị kết quả khi canShowResult = true (remainingTime < 1)
    if (pendingResult && canShowResult && !answerResult) {
      setAnswerResult(pendingResult);
      setPendingResult(null);

      // 🔥 NEW: Thông báo kết quả
      if (pendingResult.isCorrect) {
        showSuccessNotification(
          `🎉 Chính xác! Bạn được +${pendingResult.score} điểm`,
          "Câu trả lời đúng!",
          4000
        );
      } else {
        showErrorNotification(
          `❌ Câu trả lời chưa đúng. Đáp án đúng: "${pendingResult.correctAnswer}"`,
          "Câu trả lời sai",
          4000
        );
      }
    }
  }, [
    pendingResult,
    canShowResult,
    answerResult,
    showSuccessNotification,
    showErrorNotification,
    showWarningNotification,
  ]);

  // 🔥 NEW: Sync elimination state từ answerResult
  useEffect(() => {
    if (answerResult?.eliminated && !isEliminatedState) {
      setIsEliminatedState(true);
      setEliminationMessageState("Bạn đã bị loại do trả lời sai câu hỏi.");
    }
  }, [answerResult?.eliminated, isEliminatedState]);

  // 🎉 NEW: Effect để xử lý rescue animation
  useEffect(() => {
    if (isRescued && !showRescueAnimation) {
      setIsInRescueMode(true);
      setShowRescueAnimation(true);
      setRescueMessage("Bạn được một cơ hội mới!");

      setIsEliminatedState(false);
      setEliminationMessageState("");

      // 🔥 NEW: Reset số lần vi phạm về 0 khi được cứu trợ
      resetViolations();

      showSuccessNotification(
        "🎉 Bạn đã được cứu trợ thành công!",
        "Cứu trợ",
        3000
      );
    }
  }, [
    isRescued,
    showRescueAnimation,
    showSuccessNotification,
    resetViolations,
  ]);

  // 🎉 NEW: Callback khi rescue animation hoàn thành
  const handleRescueAnimationComplete = useCallback(() => {
    setShowRescueAnimation(false);
    setIsInRescueMode(false);
    setJustRescued(true);

    setSelectedAnswer("");
    setIsSubmitted(false);
    setAnswerResult(null);
    setPendingResult(null);
    setIsEliminatedState(false);
  }, []);

  // 🚀 NEW: Submit answer using API instead of socket
  const handleSubmitAnswer = async (currentAnswer?: string) => {
    if (isBanned && !isRescued) {
      alert(`🚫 ${banMessage || "Bạn đã bị cấm tham gia trận đấu này."}`);
      return;
    }
    if (isEliminatedState && !isRescued) {
      alert(`🚫 ${eliminationMessageState || "Bạn đã bị loại khỏi trận đấu"}`);
      return;
    }

    const answerToSubmit = currentAnswer || selectedAnswer;

    if (!currentQuestion?.question) {
      alert("Không có câu hỏi để trả lời!");
      return;
    }

    try {
      setIsSubmitted(true);
      setIsApiSubmitting(true);

      const finalAnswer = answerToSubmit || "[KHÔNG CHỌN ĐÁP ÁN]";

      const selectedIndex =
        finalAnswer === "[KHÔNG CHỌN ĐÁP ÁN]"
          ? -1
          : currentQuestion.question.options.indexOf(finalAnswer);
      const selectedOptions = selectedIndex !== -1 ? [selectedIndex] : [];

      const correctAnswerIndex = currentQuestion.question.correctAnswer
        ? currentQuestion.question.options.indexOf(
          currentQuestion.question.correctAnswer
        )
        : -1;
      const correctAnswers =
        correctAnswerIndex !== -1 ? [correctAnswerIndex] : [];

      const response: SubmitAnswerResponse =
        await SubmitAnswerService.submitAnswer(
          matchId,
          currentQuestion.order,
          finalAnswer,
          selectedOptions,
          correctAnswers
        );

      if (response.success) {
        const result = {
          isCorrect: response.data.result.isCorrect,
          correctAnswer: response.data.result.correctAnswer || "",
          explanation: response.data.result.explanation || "",
          score: response.data.result.score || 0,
          eliminated: response.data.result.eliminated || false,
          questionOrder: currentQuestion.order,
          submittedAt: response.data.result.submittedAt,
        };

        setPendingResult(result);

        showSuccessNotification(
          finalAnswer === "[KHÔNG CHỌN ĐÁP ÁN]"
            ? "Đã bỏ qua câu hỏi này!"
            : `Đã gửi đáp án: "${finalAnswer}"`,
          "Gửi thành công",
          3000
        );
      } else {
        showErrorNotification(
          `Không thể gửi đáp án: ${response.message}`,
          "Gửi thất bại",
          5000
        );
      }
    } catch (error) {
      console.error("💥 [API SUBMIT] Lỗi khi gửi đáp án:", error);
      showErrorNotification(
        "Lỗi kết nối khi gửi đáp án. Vui lòng thử lại!",
        "Lỗi kết nối",
        5000
      );
      setIsSubmitted(false);
    } finally {
      setIsApiSubmitting(false);
    }
  };

  // 🔧 UPDATE: Auto-submit logic với rescue protection
  useEffect(() => {
    if (
      remainingTime === 0 &&
      !isSubmitted &&
      (!isEliminatedState || isRescued) &&
      (!isBanned || isRescued) &&
      !isInRescueMode &&
      !showRescueAnimation &&
      !justRescued &&
      !isApiSubmitting &&
      currentQuestion
    ) {
      const answerToSubmit = selectedAnswer || "[KHÔNG CHỌN ĐÁP ÁN]";
      handleSubmitAnswer(answerToSubmit);
    }
  }, [
    remainingTime,
    isSubmitted,
    isEliminatedState,
    isBanned,
    isRescued,
    isInRescueMode,
    showRescueAnimation,
    justRescued,
    isApiSubmitting,
    currentQuestion,
    selectedAnswer,
    handleSubmitAnswer,
  ]);

  // NEW: Listen for other students' answers
  useEffect(() => {
    if (!studentSocket) return;

    const handleOtherStudentAnswer = (data: {
      contestantId: number;
      studentName: string;
      questionOrder: number;
      isCorrect: boolean;
      submittedAt: string;
      matchId: number;
    }) => {
      if (
        data.questionOrder === currentQuestion?.order &&
        data.matchId === matchId &&
        !isSubmitted
      ) {
        const newAnswer: OtherStudentAnswer = {
          studentName: data.studentName,
          isCorrect: data.isCorrect,
          questionOrder: data.questionOrder,
          submittedAt: data.submittedAt,
          contestantId: data.contestantId,
        };

        setLatestAnswer(newAnswer);
        setShowNotification(true);

        setTimeout(() => {
          setShowNotification(false);
        }, 3000);
      }
    };

    studentSocket.on("match:answerSubmitted", handleOtherStudentAnswer);

    return () => {
      studentSocket.off("match:answerSubmitted", handleOtherStudentAnswer);
    };
  }, [studentSocket, currentQuestion?.order, matchId, isSubmitted]);

  // Khi answerResult.eliminated chuyển sang true, cập nhật luôn state loại
  useEffect(() => {
    if (answerResult?.eliminated && !isEliminatedState) {
      setIsEliminatedState(true);
    }
  }, [answerResult?.eliminated, isEliminatedState]);

  const handleAnswerSelect = (answer: string) => {
    if (isBanned && !isRescued) {
      alert(`🚫 ${banMessage || "Bạn đã bị cấm tham gia trận đấu này."}`);
      return;
    }
    if (isEliminatedState && !isRescued) {
      alert(`🚫 ${eliminationMessageState || "Bạn đã bị loại khỏi trận đấu"}`);
      return;
    }

    if (!isSubmitted) {
      setSelectedAnswer(answer);
    }
  };

  // Xử lý media
  const handleMediaClick = (media: MediaData) => {
    setSelectedMedia(media);
    setMediaModalOpen(true);
  };

  const handleCloseMediaModal = () => {
    setMediaModalOpen(false);
    setSelectedMedia(null);
  };

  if (!currentQuestion) {
    return (
      <Card className="mb-4">
        <CardContent>
          <Box className="text-center py-8">
            <Quiz className="text-gray-400 mb-2" style={{ fontSize: 48 }} />
            <Typography variant="h6" className="text-gray-500">
              Đang chờ câu hỏi...
            </Typography>
            <Typography variant="body2" className="text-gray-400">
              Giáo viên sẽ bắt đầu câu hỏi trong giây lát
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box className="space-y-4 relative">
      {/* 🔍 DEBUG: Debug Status */}
      {/* <DebugStatus
        isEliminated={isEliminatedState}
        isBanned={isBanned}
        isSubmitted={isSubmitted}
        canShowResult={canShowResult}
        hasAnswerResult={!!answerResult}
        eliminationMessage={eliminationMessageState}
        banMessage={banMessage}
        selectedAnswer={selectedAnswer}
      /> */}

      {/* 🛡️ Anti-cheat Warning Modal */}
      <AntiCheatWarning
        violations={violations}
        warningCount={warningCount}
        maxViolations={maxViolations}
        onContinue={handleWarningContinue}
        onTerminate={handleWarningTerminate}
        isVisible={showAntiCheatWarning}
      />

      {/* 🛡️ Anti-cheat Status Header */}
      <AntiCheatStatus
        isMonitoring={isMonitoring}
        //quy
        // isFullscreen={isFullscreen}
        warningCount={warningCount}
        maxViolations={maxViolations}
      />

      {/* Toast Notification cho thí sinh khác trả lời */}
      <OtherStudentNotification
        showNotification={showNotification}
        latestAnswer={latestAnswer}
        onClose={() => setShowNotification(false)}
      />

      {/* Timer và thông tin câu hỏi */}
      <QuestionHeader
        questionOrder={currentQuestion.order}
        remainingTime={remainingTime}
        defaultTime={currentQuestion.question.defaultTime}
        score={currentQuestion.question.score}
        difficulty={currentQuestion.question.difficulty}
        questionType={currentQuestion.question.questionType}
      />

      {/* Nội dung câu hỏi + options chung nền trắng */}
      <QuestionContent
        intro={currentQuestion.question.intro}
        content={currentQuestion.question.content}
        media={currentQuestion.question.media}
        onMediaClick={handleMediaClick}
      >
        {(() => {
          const isActuallyEliminated =
            isEliminatedState || !!answerResult?.eliminated;

          const questionType =
            currentQuestion.question.questionType?.toLowerCase();

          if (questionType === "essay") {
            return (
              <EssayInput
                value={selectedAnswer}
                isSubmitted={isSubmitted}
                isEliminated={isActuallyEliminated}
                isBanned={isBanned}
                banMessage={banMessage}
                isApiSubmitting={isApiSubmitting}
                isRescued={isRescued}
                isInRescueMode={isInRescueMode}
                onAnswerChange={setSelectedAnswer}
                onSubmitAnswer={() => handleSubmitAnswer()}
              />
            );
          } else {
            return (
              <QuestionOptions
                options={currentQuestion.question.options}
                selectedAnswer={selectedAnswer}
                isSubmitted={isSubmitted}
                isEliminated={isActuallyEliminated}
                isBanned={isBanned}
                banMessage={banMessage}
                eliminationMessage={eliminationMessageState}
                answerResult={answerResult}
                canShowResult={canShowResult}
                isApiSubmitting={isApiSubmitting}
                isRescued={isRescued}
                isInRescueMode={isInRescueMode}
                onAnswerSelect={handleAnswerSelect}
                onSubmitAnswer={() => handleSubmitAnswer()}
              />
            );
          }
        })()}
      </QuestionContent>

      {/* Kết quả */}
      <QuestionResult
        answerResult={answerResult}
        selectedAnswer={selectedAnswer}
        canShowResult={canShowResult}
        pendingResult={pendingResult}
        isSubmitted={isSubmitted}
      />

      {/* Media Modal */}
      <MediaModal
        selectedMedia={selectedMedia}
        isOpen={mediaModalOpen}
        onClose={handleCloseMediaModal}
      />

      {/* Rescue Animation */}
      {showRescueAnimation && (
        <RescueAnimation
          isVisible={showRescueAnimation}
          rescueMessage={rescueMessage}
          onAnimationComplete={handleRescueAnimationComplete}
        />
      )}
    </Box>
  );
};

export default QuestionAnswerRefactored;
