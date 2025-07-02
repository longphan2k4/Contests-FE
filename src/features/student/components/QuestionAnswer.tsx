import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Alert,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Chip,
  Divider,
  IconButton,
  AlertTitle,
  Dialog,
  DialogContent,
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  Timer,
  Quiz,
  Send,
  Star,
  Person,
  Notifications,
  Close,
  ZoomIn,
  PlayArrow,
  VolumeUp,
} from "@mui/icons-material";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { useStudentSocket } from "../hooks/useStudentSocket";
import { useStudentMatch } from "../hooks/useStudentMatch";
import { SubmitAnswerService } from "../services/submitAnswerService";
import { useNotification } from "../../../contexts/NotificationContext";
import type { SubmitAnswerResponse } from "../services/submitAnswerService";

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
  questionType: string;
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
}

interface OtherStudentAnswer {
  studentName: string;
  isCorrect: boolean;
  questionOrder: number;
  submittedAt: string;
  contestantId: number;
}

const QuestionAnswer: React.FC<QuestionAnswerProps> = ({
  currentQuestion,
  remainingTime,
  matchId,
  isConnected,
}) => {
  console.log(
    "🔍 [COMPONENT v2024-12-20-16:45] QuestionAnswer render với props:",
    {
      hasCurrentQuestion: !!currentQuestion,
      remainingTime,
      matchId,
      isConnected,
      timestamp: new Date().toISOString(),
    }
  );

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
  const [isEliminated, setIsEliminated] = useState(false);
  const [eliminationMessage, setEliminationMessage] = useState<string>("");

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

  // NEW: State để lưu thông báo về thí sinh khác
  const [otherStudentAnswers, setOtherStudentAnswers] = useState<
    OtherStudentAnswer[]
  >([]);
  const [latestAnswer, setLatestAnswer] = useState<OtherStudentAnswer | null>(
    null
  );
  const [showNotification, setShowNotification] = useState(false);

  // 🚀 NEW: State cho API submission
  const [isApiSubmitting, setIsApiSubmitting] = useState(false);

  // 🔥 NEW: State để kiểm soát việc hiển thị kết quả (chỉ khi hết thời gian)
  const [canShowResult, setCanShowResult] = useState(false);

  // State cho media modal
  const [selectedMedia, setSelectedMedia] = useState<MediaData | null>(null);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);

  const {
    socket: studentSocket,
    isConnected: isStudentSocketConnected,
    joinMatchForAnswering,
  } = useStudentSocket();

  // Chỉ lấy isSubmitting từ useStudentMatch, không dùng submitAnswer
  const { isSubmitting } = useStudentMatch();

  // 🔥 NEW: Sử dụng notification context
  const {
    showSuccessNotification,
    showErrorNotification,
    showWarningNotification,
  } = useNotification();

  // Join match để có thể submit answer (set socket.matchId) - chạy ngay khi component mount
  useEffect(() => {
    console.log("🔍 [COMPONENT] useEffect joinMatchForAnswering triggered:", {
      isStudentSocketConnected: isStudentSocketConnected,
      matchId,
      hasJoinMatchForAnswering: !!joinMatchForAnswering,
      socketRef: !!studentSocket,
      hasJoinedMatch,
    });

    if (
      isStudentSocketConnected &&
      matchId &&
      joinMatchForAnswering &&
      !hasJoinedMatch
    ) {
      console.log(
        "🎯 [COMPONENT] Đang join match để có thể trả lời câu hỏi...",
        matchId
      );
      joinMatchForAnswering(matchId, (response) => {
        console.log("📨 [COMPONENT] Join match response:", response);
        if (response?.success) {
          console.log("✅ [COMPONENT] Đã join match thành công để trả lời");
          setHasJoinedMatch(true);
        } else {
          console.error(
            "❌ [COMPONENT] Không thể join match để trả lời:",
            response?.message
          );
        }
      });
    } else {
      console.log("⚠️ [COMPONENT] Chưa thể join match - chờ kết nối:", {
        isStudentSocketConnected: isStudentSocketConnected,
        matchId,
        hasJoinMatchForAnswering: !!joinMatchForAnswering,
        hasJoinedMatch,
      });
    }
  }, [
    isStudentSocketConnected,
    matchId,
    joinMatchForAnswering,
    hasJoinedMatch,
    studentSocket,
  ]);

  // Reset khi có câu hỏi mới
  useEffect(() => {
    if (currentQuestion) {
      setSelectedAnswer("");
      setIsSubmitted(false);
      setAnswerResult(null);
      setPendingResult(null); // Reset kết quả tạm thời
      setOtherStudentAnswers([]); // Reset thông báo thí sinh khác
      setLatestAnswer(null);
      setShowNotification(false);
      setCanShowResult(false); // 🔥 NEW: Reset trạng thái hiển thị kết quả
      // 🔥 NEW: Reset elimination state khi chuyển câu hỏi (nếu không bị loại)
      if (!isEliminated) {
        console.log(
          "🔄 [COMPONENT] Reset trạng thái cho câu hỏi mới:",
          currentQuestion.order
        );
      }
    }
  }, [currentQuestion, isEliminated]);

  // 🔥 NEW: Set canShowResult khi hết thời gian
  useEffect(() => {
    if (remainingTime === 0 && !canShowResult) {
      console.log("⏰ [COMPONENT] Cho phép hiển thị kết quả vì hết thời gian");
      setCanShowResult(true);
    }
  }, [remainingTime, canShowResult]);

  // 🔥 NEW: Listen for elimination events
  useEffect(() => {
    if (!studentSocket) return;

    const handleStudentEliminated = (data: {
      message: string;
      questionOrder: number;
      eliminatedAt: string;
      correctAnswer: string;
      explanation?: string;
      redirectTo?: string;
    }) => {
      console.log("🚫 [ELIMINATION] Thí sinh bị loại:", data);

      setIsEliminated(true);
      setEliminationMessage(data.message);

      // Hiển thị thông báo elimination
      alert(
        `🚫 ${data.message}\n\nĐáp án đúng: ${data.correctAnswer}\n${
          data.explanation || ""
        }`
      );

      // Có thể redirect sau một khoảng thời gian
      if (data.redirectTo) {
        setTimeout(() => {
          if (data.redirectTo) {
            window.location.href = data.redirectTo;
          }
        }, 5000); // 5 giây
      }
    };

    studentSocket.on("student:eliminated", handleStudentEliminated);

    return () => {
      studentSocket.off("student:eliminated", handleStudentEliminated);
    };
  }, [studentSocket]);

  // NEW: Logic hiển thị kết quả khi thời gian < 1 giây
  useEffect(() => {
    if (pendingResult && canShowResult && !answerResult) {
      console.log("⏰ [RESULT] Hiển thị kết quả vì canShowResult = true");
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

      // 🔥 NEW: Update elimination status từ result với delay để user thấy kết quả trước
      if (pendingResult.eliminated) {
        setTimeout(() => {
          setIsEliminated(true);
          // 🔥 NEW: Thông báo bị loại với delay
          showWarningNotification(
            "⚠️ Bạn đã bị loại khỏi trận đấu! Bạn vẫn có thể theo dõi các câu hỏi tiếp theo.",
            "Bị loại",
            6000
          );
          console.log(
            "🚫 [ELIMINATION] Hiển thị thông báo loại sau khi show kết quả"
          );
        }, 4000); // Delay 4 giây để user đọc kết quả trước
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

  // Tự động submit khi hết thời gian
  useEffect(() => {
    if (
      remainingTime === 0 &&
      !isSubmitted &&
      !isEliminated &&
      currentQuestion // ❌ BỎ điều kiện selectedAnswer
    ) {
      console.log(
        "⏰ [COMPONENT] Tự động submit khi hết thời gian" +
          (selectedAnswer
            ? ` với đáp án: ${selectedAnswer}`
            : " KHÔNG CÓ ĐÁP ÁN")
      );
      handleSubmitAnswer(selectedAnswer || "[KHÔNG CHỌN ĐÁP ÁN]"); // 🔧 Submit với đáp án mặc định
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    remainingTime,
    isSubmitted,
    isEliminated,
    currentQuestion, // ❌ BỎ selectedAnswer khỏi dependency
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
      console.log("📝 [HỌC SINH] Thí sinh khác đã gửi câu trả lời:", {
        studentName: data.studentName,
        isCorrect: data.isCorrect,
        questionOrder: data.questionOrder,
      });

      // Chỉ hiển thị nếu là câu hỏi hiện tại và chưa submit
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

        // Cập nhật danh sách
        setOtherStudentAnswers((prev) => {
          const existingIndex = prev.findIndex(
            (answer) => answer.contestantId === data.contestantId
          );

          if (existingIndex >= 0) {
            const updated = [...prev];
            updated[existingIndex] = newAnswer;
            return updated;
          } else {
            return [...prev, newAnswer];
          }
        });

        // Hiển thị notification toast
        setLatestAnswer(newAnswer);
        setShowNotification(true);

        // Tự động ẩn notification sau 3 giây
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

  const handleAnswerSelect = (answer: string) => {
    // 🔥 NEW: Block eliminated students from selecting answers
    if (isEliminated) {
      console.log("🚫 [BLOCKED] Thí sinh đã bị loại không thể chọn đáp án");
      alert(`🚫 ${eliminationMessage || "Bạn đã bị loại khỏi trận đấu"}`);
      return;
    }

    if (!isSubmitted) {
      setSelectedAnswer(answer);
      console.log("📝 [COMPONENT] Chọn đáp án:", answer);
    }
  };

  // 🚀 NEW: Submit answer using API instead of socket
  const handleSubmitAnswer = async (currentAnswer?: string) => {
    // 🔥 Block eliminated students from submitting answers
    if (isEliminated) {
      console.log("🚫 [BLOCKED] Thí sinh đã bị loại không thể submit");
      alert(`🚫 ${eliminationMessage || "Bạn đã bị loại khỏi trận đấu"}`);
      return;
    }

    const answerToSubmit = currentAnswer || selectedAnswer;

    console.log("📤 [API SUBMIT] Bắt đầu submit answer qua API:", {
      answerToSubmit,
      questionOrder: currentQuestion?.order,
      matchId,
      hasCurrentQuestion: !!currentQuestion,
      isEliminated,
      isNoAnswerSelected: !answerToSubmit, // 🔧 Log để tracking
    });

    // 🔧 SỬA: Chỉ cảnh báo nhưng vẫn cho phép submit với đáp án trống
    if (!answerToSubmit || !answerToSubmit.trim()) {
      console.warn(
        "⚠️ [API SUBMIT] Không có đáp án được chọn - sẽ submit như trả lời sai"
      );
      // ❌ BỎ alert và return, để tiếp tục submit
      // alert("Vui lòng chọn một đáp án!");
      // return;
    }

    if (!currentQuestion?.question) {
      console.error("❌ [API SUBMIT] Không có câu hỏi để trả lời");
      alert("Không có câu hỏi để trả lời!");
      return;
    }

    try {
      console.log("📤 [API SUBMIT] Đang gửi đáp án qua API...");
      setIsSubmitted(true); // Set submitted trước để tránh double click
      setIsApiSubmitting(true);

      // 🔧 XỬ LÝ: Nếu không có đáp án, dùng giá trị mặc định
      const finalAnswer = answerToSubmit || "[KHÔNG CHỌN ĐÁP ÁN]";

      // Chuyển đổi answer thành selectedOptions (chỉ số của đáp án được chọn)
      const selectedIndex =
        finalAnswer === "[KHÔNG CHỌN ĐÁP ÁN]"
          ? -1 // 🔧 -1 nghĩa là không chọn đáp án nào
          : currentQuestion.question.options.indexOf(finalAnswer);
      const selectedOptions = selectedIndex !== -1 ? [selectedIndex] : [];

      // Tìm correctAnswers (chỉ số của đáp án đúng)
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
          finalAnswer, // 🔧 Dùng finalAnswer thay vì answerToSubmit
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

        // Lưu kết quả vào pendingResult thay vì answerResult để đợi thời gian < 1s
        console.log(
          "📋 [API SUBMIT] Lưu kết quả vào pendingResult, đợi hết thời gian để hiển thị"
        );
        setPendingResult(result);

        // 🔥 NEW: Thông báo đã gửi câu trả lời thành công
        showSuccessNotification(
          finalAnswer === "[KHÔNG CHỌN ĐÁP ÁN]"
            ? "Đã bỏ qua câu hỏi này!"
            : `Đã gửi đáp án: "${finalAnswer}"`,
          "Gửi thành công",
          3000
        );

        if (result.isCorrect) {
          console.log(
            `✅ [API SUBMIT] Câu trả lời chính xác! Điểm: ${result.score} (sẽ hiển thị khi hết thời gian)`
          );
        } else {
          console.log(
            `❌ [API SUBMIT] Câu trả lời sai. Đáp án đúng: ${result.correctAnswer} (sẽ hiển thị khi hết thời gian)`
          );
        }
      } else {
        console.error("❌ [API SUBMIT] Gửi đáp án thất bại:", response.message);
        // 🔥 NEW: Thông báo lỗi khi gửi thất bại
        showErrorNotification(
          `Không thể gửi đáp án: ${response.message}`,
          "Lỗi gửi đáp án"
        );
      }
    } catch (error) {
      console.error("💥 [API SUBMIT] Lỗi khi submit answer:", error);
      // 🔥 NEW: Thông báo lỗi kết nối
      showErrorNotification(
        "Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet!",
        "Lỗi kết nối"
      );
      alert("Lỗi kết nối. Vui lòng thử lại!");
    } finally {
      setIsApiSubmitting(false);
    }
  };

  const getOptionClass = (option: string) => {
    if (!canShowResult) {
      return selectedAnswer === option
        ? "bg-blue-100 border-blue-500 text-blue-800 shadow-md"
        : "bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300";
    }

    // Đã submit - hiển thị kết quả với màu sắc rõ ràng
    const isCorrectAnswer = option === answerResult?.correctAnswer;
    const isUserSelection = option === selectedAnswer;

    if (isCorrectAnswer) {
      return "bg-green-100 border-green-500 text-green-800 shadow-lg border-2";
    }

    if (isUserSelection && !answerResult?.isCorrect) {
      return "bg-red-100 border-red-500 text-red-800 shadow-lg border-2";
    }

    return "bg-gray-50 border-gray-200 text-gray-500 opacity-60";
  };

  const getResultIcon = (option: string) => {
    if (!canShowResult || !answerResult) return null;

    const isCorrectAnswer = option === answerResult.correctAnswer;
    const isUserSelection = option === selectedAnswer;

    if (isCorrectAnswer) {
      return (
        <Box className="flex items-center gap-2">
          <CheckCircle className="text-green-600 text-xl" />
          <Chip
            label="ĐÚNG"
            size="small"
            className="bg-green-600 text-white font-bold"
          />
        </Box>
      );
    }

    if (isUserSelection && !answerResult.isCorrect) {
      return (
        <Box className="flex items-center gap-2">
          <Cancel className="text-red-600 text-xl" />
          <Chip
            label="SAI"
            size="small"
            className="bg-red-600 text-white font-bold"
          />
        </Box>
      );
    }

    return null;
  };

  const getTimerColor = () => {
    if (remainingTime <= 10) return "error";
    if (remainingTime <= 30) return "warning";
    return "primary";
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "alpha":
        return "success";
      case "beta":
        return "warning";
      case "gamma":
        return "error";
      default:
        return "default";
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

  // Component MediaGrid tối ưu cho mobile
  const MediaGrid: React.FC<{ mediaList: MediaData[] }> = ({ mediaList }) => {
    if (!mediaList || mediaList.length === 0) return null;

    const getGridLayout = (count: number) => {
      // Tối ưu cho mobile: luôn 1 cột trên mobile, 2 cột trên tablet+
      switch (count) {
        case 1:
          return "grid-cols-1";
        case 2:
          return "grid-cols-1 sm:grid-cols-2";
        case 3:
          return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
        case 4:
        default:
          return "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4";
      }
    };

    const renderMediaItem = (media: MediaData, index: number) => {
      const commonClasses =
        "relative cursor-pointer rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-all duration-200 group active:scale-95";

      return (
        <Box
          key={media.id}
          className={commonClasses}
          onClick={() => handleMediaClick(media)}
          sx={{ touchAction: "manipulation" }} // Tối ưu cho touch
        >
          {/* Overlay với icon - larger cho mobile */}
          <Box className="absolute inset-0  bg-opacity-50 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-200 z-10 flex items-center justify-center">
            <Box className="flex flex-col items-center text-white">
              {media.type === "image" && <ZoomIn className="text-4xl mb-2" />}
              {media.type === "video" && (
                <PlayArrow className="text-4xl mb-2" />
              )}
              {media.type === "audio" && <VolumeUp className="text-4xl mb-2" />}
              <Typography
                variant="body2"
                className="text-center px-2 font-medium"
              >
                {media.type === "image" && "Xem ảnh"}
                {media.type === "video" && "Phát video"}
                {media.type === "audio" && "Nghe audio"}
              </Typography>
            </Box>
          </Box>

          {/* Media content - responsive height */}
          {media.type === "image" && (
            <>
              <div className="flex justify-center items-center w-full h-64 rounded-xl overflow-hidden bg-white">
                <img
                  src={media.url}
                  alt={media.title || `Media ${index + 1}`}
                  className="max-w-full h-full object-contain object-center bg-white"
                  onClick={() => handleMediaClick(media)}
                />
                {/* Icon góc phải */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                  <PhotoIcon className="w-4 h-4 text-gray-600" />
                </div>
                {/* Counter nếu có nhiều ảnh */}
                {currentQuestion &&
                  currentQuestion.question.media &&
                  currentQuestion.question.media.length > 1 && (
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                      <span className="text-xs font-medium text-gray-700">
                        {index + 1}/{currentQuestion.question.media.length}
                      </span>
                    </div>
                  )}
              </div>
            </>
          )}

          {media.type === "video" && (
            <Box className="relative">
              <video
                src={media.url}
                poster={media.thumbnail}
                className="w-full h-32 xs:h-36 sm:h-40 md:h-44 object-cover"
                muted
                preload="metadata"
              />
              <Box className="absolute inset-0 flex items-center justify-center">
                <PlayArrow className="text-white text-5xl bg-black bg-opacity-60 rounded-full p-3" />
              </Box>
            </Box>
          )}

          {media.type === "audio" && (
            <Box className="h-32 xs:h-36 sm:h-40 md:h-44 bg-gradient-to-br from-purple-400 to-purple-600 flex flex-col items-center justify-center text-white">
              <VolumeUp className="text-5xl mb-3" />
              <Typography
                variant="body2"
                className="text-center px-3 font-medium"
              >
                {media.title || "File âm thanh"}
              </Typography>
            </Box>
          )}
        </Box>
      );
    };

    return (
      <Box className="space-y-3">
        <Box
          className={`grid gap-3 ${getGridLayout(
            mediaList.slice(0, 4).length
          )}`}
        >
          {mediaList
            .slice(0, 4)
            .map((media, index) => renderMediaItem(media, index))}
        </Box>
        {mediaList.length > 4 && (
          <Typography variant="caption" className="text-gray-500 italic">
            * Hiển thị 4/{mediaList.length} media đầu tiên
          </Typography>
        )}
      </Box>
    );
  };

  // Media Modal tối ưu cho mobile
  const MediaModal: React.FC = () => {
    if (!selectedMedia) return null;

    return (
      <Dialog
        open={mediaModalOpen}
        onClose={handleCloseMediaModal}
        maxWidth="lg"
        fullWidth
        fullScreen // Full screen trên mobile để tối ưu
        PaperProps={{
          className: "m-0 sm:m-2 max-h-screen sm:max-h-[90vh] sm:rounded-lg",
        }}
      >
        <DialogContent className="p-2 sm:p-4 relative h-full flex flex-col">
          {/* Close Button - larger cho mobile */}
          <IconButton
            onClick={handleCloseMediaModal}
            className="absolute top-2 right-2 z-10 bg-black bg-opacity-60 text-white hover:bg-opacity-80"
            size="large"
          >
            <Close />
          </IconButton>

          {/* Media Content */}
          <Box className="flex-1 flex flex-col items-center justify-center p-4">
            {selectedMedia.type === "image" && (
              <img
                src={selectedMedia.url}
                alt={selectedMedia.title || "Media"}
                className="max-w-full max-h-full object-contain rounded-lg"
                style={{ maxHeight: "calc(100vh - 150px)" }}
              />
            )}

            {selectedMedia.type === "video" && (
              <video
                src={selectedMedia.url}
                controls
                autoPlay
                playsInline // Quan trọng cho mobile
                className="max-w-full max-h-full rounded-lg"
                style={{ maxHeight: "calc(100vh - 150px)" }}
                poster={selectedMedia.thumbnail}
              />
            )}

            {selectedMedia.type === "audio" && (
              <Box className="w-full max-w-md p-6 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg text-white text-center">
                <VolumeUp className="text-8xl mb-4" />
                <Typography variant="h6" className="mb-4 font-bold">
                  {selectedMedia.title || "File âm thanh"}
                </Typography>
                <audio
                  src={selectedMedia.url}
                  controls
                  autoPlay
                  className="w-full"
                  style={{ minHeight: "40px" }}
                />
              </Box>
            )}
          </Box>

          {/* Media Info - Bottom section */}
          {(selectedMedia.title || selectedMedia.description) && (
            <Box className="bg-gray-50 p-4 rounded-t-lg mt-auto">
              {selectedMedia.title && (
                <Typography
                  variant="h6"
                  className="font-bold text-gray-800 mb-2"
                >
                  {selectedMedia.title}
                </Typography>
              )}
              {selectedMedia.description && (
                <Typography variant="body2" className="text-gray-600">
                  {selectedMedia.description}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    );
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
      {/* Toast Notification cho thí sinh khác trả lời */}
      {showNotification && latestAnswer && (
        <Box
          className="fixed top-4 right-4 z-50 bg-white border-l-4 border-orange-500 shadow-lg rounded-lg p-4 min-w-80 animate-slide-in-right"
          style={{ zIndex: 9999 }}
        >
          <Box className="flex items-center justify-between">
            <Box className="flex items-center gap-2">
              <Notifications className="text-orange-500 text-xl" />
              <Box>
                <Typography
                  variant="body2"
                  className="font-medium text-gray-800"
                >
                  {latestAnswer.studentName.split(" - ")[0]} đã trả lời
                </Typography>
                <Box className="flex items-center gap-2 mt-1">
                  <Chip
                    size="small"
                    label={latestAnswer.isCorrect ? "ĐÚNG" : "SAI"}
                    color={latestAnswer.isCorrect ? "success" : "error"}
                    className="text-xs font-bold"
                  />
                  <Typography variant="caption" className="text-gray-500">
                    {new Date(latestAnswer.submittedAt).toLocaleTimeString(
                      "vi-VN"
                    )}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <IconButton
              size="small"
              onClick={() => setShowNotification(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <Cancel />
            </IconButton>
          </Box>
        </Box>
      )}

      {/* Timer và thông tin câu hỏi */}
      <Card className="border-l-4 border-l-blue-500">
        <CardContent>
          <Box className="flex items-center justify-between mb-3">
            <Box className="flex items-center gap-2">
              <Quiz className="text-blue-500" />
              <Typography variant="h6" className="text-gray-800 font-semibold">
                Câu hỏi số {currentQuestion.order}
              </Typography>
            </Box>

            <Box className="flex items-center gap-2">
              <Chip
                icon={<Timer />}
                label={formatTime(remainingTime)}
                color={getTimerColor()}
                size="small"
                className={remainingTime <= 10 ? "animate-pulse" : ""}
              />
              <Chip
                icon={<Star />}
                label={`${currentQuestion.question.score} điểm`}
                variant="outlined"
                size="small"
              />
            </Box>
          </Box>

          <Box className="flex flex-wrap gap-2 mb-3">
            <Chip
              label={`Độ khó: ${currentQuestion.question.difficulty}`}
              color={getDifficultyColor(currentQuestion.question.difficulty)}
              size="small"
            />
            <Chip
              label={
                currentQuestion.question.questionType === "multiple_choice"
                  ? "Trắc nghiệm"
                  : "Đúng/Sai"
              }
              variant="outlined"
              size="small"
            />
          </Box>

          {/* Timer Progress */}
          <Box className="mb-3">
            <LinearProgress
              variant="determinate"
              value={Math.max(
                0,
                (remainingTime / currentQuestion.question.defaultTime) * 100
              )}
              color={getTimerColor()}
              className="h-2 rounded"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Compact indicator của số thí sinh đã trả lời */}
      {otherStudentAnswers.length > 0 && !isSubmitted && (
        <Alert
          severity="info"
          className="border border-blue-200"
          icon={<Person />}
        >
          <Box className="flex items-center justify-between w-full">
            <Typography variant="body2" className="text-blue-800">
              <strong>{otherStudentAnswers.length}</strong> thí sinh khác đã
              hoàn thành câu hỏi này
            </Typography>
            <Box className="flex items-center gap-1">
              {otherStudentAnswers.slice(0, 3).map((answer) => (
                <Chip
                  key={answer.contestantId}
                  size="small"
                  label={answer.isCorrect ? "✓" : "✗"}
                  color={answer.isCorrect ? "success" : "error"}
                  className="text-xs min-w-8"
                />
              ))}
              {otherStudentAnswers.length > 3 && (
                <Typography variant="caption" className="text-gray-500 ml-1">
                  +{otherStudentAnswers.length - 3}
                </Typography>
              )}
            </Box>
          </Box>
        </Alert>
      )}

      {/* Nội dung câu hỏi */}
      <Card>
        <CardContent>
          {currentQuestion.question.intro && (
            <Typography variant="body2" className="text-gray-600 mb-3 italic">
              📝 {currentQuestion.question.intro}
            </Typography>
          )}

          <Box
            className="text-gray-800 mb-4 text-lg font-semibold"
            dangerouslySetInnerHTML={{
              __html: currentQuestion.question.content,
            }}
          />

          <Divider className="mb-4" />

          {/* Media Grid */}
          {currentQuestion.question.media &&
            currentQuestion.question.media.length > 0 && (
              <Box className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <MediaGrid mediaList={currentQuestion.question.media} />
              </Box>
            )}

          {/* Các lựa chọn */}
          {/* 🔥 NEW: Ẩn options nếu thí sinh bị loại */}
          {!isEliminated && (
            <FormControl component="fieldset" className="w-full">
              <RadioGroup
                value={selectedAnswer}
                onChange={(e) => handleAnswerSelect(e.target.value)}
              >
                <Box className="space-y-3">
                  {currentQuestion.question.options?.map((option, index) => (
                    <Box
                      key={index}
                      className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${getOptionClass(
                        option
                      )}`}
                      onClick={() => !isSubmitted && handleAnswerSelect(option)}
                    >
                      <Box className="flex items-center justify-between">
                        <FormControlLabel
                          value={option}
                          control={<Radio disabled={isSubmitted} />}
                          label={
                            <Typography variant="body1" className="font-medium">
                              {String.fromCharCode(65 + index)}. {option}
                            </Typography>
                          }
                          className="m-0 flex-1"
                        />
                        {getResultIcon(option)}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </RadioGroup>
            </FormControl>
          )}

          {/* 🔥 NEW: Hiển thị thông báo elimination thay cho options */}
          {isEliminated && (
            <Alert
              severity="error"
              icon={<Cancel />}
              className="border-2 border-red-500 bg-red-50 mb-4"
            >
              <AlertTitle>Error</AlertTitle>
              <Box className="space-y-3">
                <Typography variant="h6" className="font-bold text-red-800">
                  Bạn đã bị loại khỏi trận đấu!
                </Typography>
                <Typography variant="body2" className="text-red-600">
                  💡 Bạn vẫn có thể theo dõi câu hỏi nhưng không thể trả lời.
                </Typography>

                {/* Hiển thị đáp án đúng nếu có */}
                {answerResult?.correctAnswer && (
                  <Box className="bg-red-100 p-3 rounded-lg border border-red-300">
                    <Typography
                      variant="body2"
                      className="text-red-800 font-medium"
                    >
                      📝 Đáp án đúng:{" "}
                      <span className="font-bold">
                        {answerResult.correctAnswer}
                      </span>
                    </Typography>
                    {answerResult.explanation && (
                      <Typography variant="body2" className="text-red-700 mt-1">
                        💡 Giải thích: {answerResult.explanation}
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            </Alert>
          )}

          {/* Nút submit */}
          {/* 🔥 NEW: Ẩn submit button nếu thí sinh bị loại */}
          {!isSubmitted && !isEliminated && (
            <Box className="flex justify-end mt-4">
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<Send />}
                onClick={() => handleSubmitAnswer()}
                disabled={!selectedAnswer || isApiSubmitting || isSubmitting}
                className="px-8 py-3"
              >
                {isApiSubmitting || isSubmitting ? "Đang xử lý..." : "Xác nhận"}
              </Button>
            </Box>
          )}

          {/* Thông báo đã gửi, đang chờ hiển thị kết quả */}
          {isSubmitted && pendingResult && !answerResult && !canShowResult && (
            <Alert severity="info" className="mt-3 border-2 border-blue-200">
              <Box className="flex items-center gap-2">
                <Typography
                  variant="body1"
                  className="font-medium text-blue-800"
                >
                  Đã gửi{" "}
                  {selectedAnswer === "[KHÔNG CHỌN ĐÁP ÁN]"
                    ? "yêu cầu bỏ qua câu hỏi" // 🔧 Thông báo khác khi không chọn
                    : "đáp án"}{" "}
                  thành công!
                </Typography>
              </Box>
              <Typography variant="body2" className="text-blue-600 mt-1">
                Kết quả sẽ được hiển thị khi hết thời gian...
              </Typography>
            </Alert>
          )}

          {/* Kết quả */}
          {canShowResult && answerResult && (
            <Box className="mt-6 space-y-4">
              {/* Alert kết quả chính */}
              <Alert
                severity={answerResult.isCorrect ? "success" : "error"}
                className="border-2"
                icon={
                  answerResult.isCorrect ? (
                    <CheckCircle className="text-2xl" />
                  ) : (
                    <Cancel className="text-2xl" />
                  )
                }
              >
                <Box className="space-y-2">
                  <Typography variant="h6" className="font-bold">
                    {answerResult.isCorrect
                      ? `🎉 Chính xác! +${answerResult.score} điểm`
                      : selectedAnswer === "[KHÔNG CHỌN ĐÁP ÁN]"
                      ? " Bạn không chọn đáp án nào!" // 🔧 Thông báo đặc biệt
                      : " Chưa đúng rồi!"}
                  </Typography>

                  <Typography variant="body1" className="font-medium">
                    <span className="text-gray-700">Đáp án của bạn: </span>
                    <span
                      className={
                        answerResult.isCorrect
                          ? "text-green-700"
                          : "text-red-700"
                      }
                    >
                      {selectedAnswer === "[KHÔNG CHỌN ĐÁP ÁN]"
                        ? "❌ Không chọn đáp án nào" // 🔧 Hiển thị rõ ràng hơn
                        : selectedAnswer}
                    </span>
                  </Typography>

                  {!answerResult.isCorrect && (
                    <Typography variant="body1" className="font-medium">
                      <span className="text-gray-700">Đáp án đúng: </span>
                      <span className="text-green-700 font-bold">
                        {answerResult.correctAnswer}
                      </span>
                    </Typography>
                  )}

                  <Box className="flex items-center gap-4 text-sm text-gray-600">
                    <span>
                      📊 Điểm số: <strong>{answerResult.score}</strong>
                    </span>
                    <span>
                      📝 Câu số: <strong>{answerResult.questionOrder}</strong>
                    </span>
                    <span>
                      ⏰ Nộp lúc:{" "}
                      <strong>
                        {new Date(
                          answerResult.submittedAt
                        ).toLocaleTimeString()}
                      </strong>
                    </span>
                  </Box>
                </Box>
              </Alert>

              {/* Cảnh báo bị loại */}
              {answerResult.eliminated && (
                <Alert
                  severity="error"
                  className="border-2 border-red-500 bg-red-50"
                >
                  <Typography variant="h6" className="font-bold text-red-800">
                    ⚠️ Bạn đã bị loại khỏi trận đấu!
                  </Typography>
                  <Typography variant="body2" className="text-red-700 mt-1">
                    {selectedAnswer === "[KHÔNG CHỌN ĐÁP ÁN]"
                      ? "Do không chọn đáp án nào" // 🔧 Thông báo cụ thể
                      : "Do trả lời sai câu hỏi"}
                  </Typography>
                </Alert>
              )}

              {/* Giải thích */}
              {answerResult.explanation && (
                <Box className="bg-blue-50 border-2 border-blue-200 p-4 rounded-lg">
                  <Typography
                    variant="subtitle1"
                    className="text-blue-800 font-bold mb-2 flex items-center gap-2"
                  >
                    💡 Giải thích chi tiết:
                  </Typography>
                  <Typography
                    variant="body1"
                    className="text-blue-700 leading-relaxed"
                  >
                    {answerResult.explanation}
                  </Typography>
                </Box>
              )}

              {/* Thống kê nhanh */}
              <Box className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                <Typography
                  variant="subtitle2"
                  className="text-gray-800 font-bold mb-2"
                >
                  📈 Thống kê câu trả lời:
                </Typography>
                <Box className="grid grid-cols-2 gap-4 text-sm">
                  <Box>
                    <span className="text-gray-600">Kết quả:</span>
                    <span
                      className={`ml-2 font-bold ${
                        answerResult.isCorrect
                          ? "text-green-600"
                          : "text-green-600"
                      }`}
                    >
                      {answerResult.isCorrect ? "ĐÚNG ✓" : "SAI ✗"}
                    </span>
                  </Box>
                  <Box>
                    <span className="text-gray-600">Điểm được:</span>
                    <span className="ml-2 font-bold text-blue-600">
                      {answerResult.score} điểm
                    </span>
                  </Box>
                  <Box>
                    <span className="text-gray-600">Trạng thái:</span>
                    <span
                      className={`ml-2 font-bold ${
                        answerResult.eliminated
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {answerResult.eliminated ? "BỊ LOẠI" : "TIẾP TỤC"}
                    </span>
                  </Box>
                  <Box>
                    <span className="text-gray-600">Đáp án:</span>
                    <span className="ml-2 font-bold text-gray-800">
                      {selectedAnswer === "[KHÔNG CHỌN ĐÁP ÁN]"
                        ? "Không chọn" // 🔧 Hiển thị ngắn gọn
                        : selectedAnswer?.substring(0, 10) +
                          (selectedAnswer?.length > 10 ? "..." : "")}
                    </span>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Media Modal */}
      <MediaModal />
    </Box>
  );
};

export default QuestionAnswer;
