import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Paper,
} from "@mui/material";
import {
  Quiz,
  Timer,
  Star,
  Category,
  Numbers,
  CheckCircle,
} from "@mui/icons-material";

interface QuestionData {
  id: number;
  content: string;
  intro?: string;
  questionType: string;
  difficulty: string;
  score: number;
  defaultTime: number;
  options: string[];
  correctAnswer?: number;
}

interface CurrentQuestionData {
  order: number;
  question: QuestionData;
}

interface CurrentQuestionProps {
  currentQuestionData?: CurrentQuestionData;
  isGameStarted: boolean;
  remainingTime: number;
  isLoading: boolean;
  isTimerPaused?: boolean;
}

const CurrentQuestion: React.FC<CurrentQuestionProps> = ({
  currentQuestionData,
  isGameStarted,
  remainingTime,
  isLoading,
  isTimerPaused = false,
}) => {
  const getTimerProgress = () => {
    if (remainingTime <= 0 || !currentQuestionData) return 0;
    const maxTime = currentQuestionData.question.defaultTime;
    return Math.max(0, Math.min(100, (remainingTime / maxTime) * 100));
  };

  const formatTime = (seconds: number) => {
    const timeValue = Math.max(0, Math.floor(seconds));
    const mins = Math.floor(timeValue / 60);
    const secs = timeValue % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimerColor = () => {
    if (remainingTime <= 10) return "error";
    if (remainingTime <= 30) return "warning";
    return "primary";
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

  // Debug logging cho props
  React.useEffect(() => {
    console.log("🔄 [CURRENT QUESTION] Props updated:", {
      hasCurrentQuestionData: !!currentQuestionData,
      isGameStarted,
      remainingTime,
      isLoading,
      isTimerPaused,
      questionOrder: currentQuestionData?.order,
      questionId: currentQuestionData?.question?.id,
      defaultTime: currentQuestionData?.question?.defaultTime,
      progress: currentQuestionData
        ? (
            (remainingTime / currentQuestionData.question.defaultTime) *
            100
          ).toFixed(1) + "%"
        : "N/A",
    });
  }, [
    currentQuestionData,
    isGameStarted,
    remainingTime,
    isLoading,
    isTimerPaused,
  ]);

  if (!isGameStarted) {
    return (
      <Card elevation={3} className="w-full border-l-4 border-l-blue-500">
        <CardContent className="p-6">
          <Box className="text-center py-12">
            <Box className="mb-4">
              <Quiz className="text-gray-300" style={{ fontSize: 60 }} />
            </Box>
            <Typography variant="h5" className="text-gray-500 mb-2 font-bold">
              Trận đấu chưa bắt đầu
            </Typography>
            <Typography variant="body1" className="text-gray-400">
              Câu hỏi sẽ hiển thị khi trận đấu bắt đầu
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (isLoading || !currentQuestionData) {
    return (
      <Card elevation={3} className="w-full border-l-4 border-l-blue-500">
        <CardContent className="p-6">
          <Box className="text-center py-12">
            <LinearProgress className="mb-3" />
            <Typography variant="h6" className="text-gray-500">
              🔄 Đang tải câu hỏi...
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const { order, question } = currentQuestionData;
  const timerProgress = getTimerProgress();

  return (
    <Card elevation={3} className="w-full border-l-4 border-l-blue-500">
      <CardContent className="p-6">
        {/* Question Header - Tương tự QuestionAnswer */}
        <Box className="flex items-center justify-between mb-4">
          <Box className="flex items-center gap-3">
            <Box className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-lg">
              <Quiz className="text-white" fontSize="medium" />
            </Box>
            <Box>
              <Typography variant="h6" className="font-bold text-gray-800 mb-1">
                Câu hỏi số {order}
              </Typography>
            </Box>
          </Box>

          <Box className="flex items-center gap-2">
            <Chip
              icon={<Timer />}
              label={formatTime(remainingTime)}
              color={getTimerColor()}
              size="medium"
              className={`font-mono text-base px-4 py-2 ${
                remainingTime <= 10 ? "animate-pulse" : ""
              }`}
            />
            {isTimerPaused && (
              <Chip
                label="⏸ Tạm dừng"
                color="warning"
                className="animate-pulse"
                size="small"
              />
            )}
          </Box>
        </Box>

        {/* Timer Progress Bar - Tương tự QuestionAnswer */}
        <Box className="mb-4">
          <LinearProgress
            variant="determinate"
            value={timerProgress}
            color={getTimerColor()}
            className="h-3 rounded-full shadow-inner"
          />
          <Box className="flex justify-between items-center mt-2">
            <Typography variant="caption" className="text-gray-500">
              Tiến độ: {timerProgress.toFixed(1)}%
            </Typography>
            <Typography variant="caption" className="text-gray-500">
              Tổng thời gian: {question.defaultTime || 0}s
            </Typography>
          </Box>
        </Box>

        {/* Question Info Tags - Cải thiện */}
        <Box className="flex flex-wrap gap-2 mb-4">
          <Chip
            icon={<Category />}
            label={
              question.questionType === "multiple_choice"
                ? "Trắc nghiệm"
                : question.questionType
            }
            variant="outlined"
            size="small"
            className="px-3 py-1"
          />
          <Chip
            icon={<Star />}
            label={`Độ khó: ${question.difficulty}`}
            color={getDifficultyColor(question.difficulty)}
            size="small"
            className="px-3 py-1"
          />
          <Chip
            icon={<Numbers />}
            label={`${question.score} điểm`}
            variant="outlined"
            size="small"
            className="px-3 py-1"
          />
        </Box>

        {/* Question Intro */}
        {question.intro && (
          <Paper className="p-3 mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
            <Typography
              variant="body2"
              className="text-blue-800 italic font-medium"
            >
              📝 {question.intro}
            </Typography>
          </Paper>
        )}

        {/* Question Content */}
        <Paper className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 mb-4">
          <Typography
            variant="body1"
            className="text-gray-800 font-bold mb-5 flex items-center gap-2"
          >
            <Box className="w-1 h-5 bg-blue-500 rounded-full" />
            📋 Nội dung câu hỏi
          </Typography>
          <Box
            className="text-gray-700 text-base leading-relaxed"
            dangerouslySetInnerHTML={{ __html: question.content }}
            sx={{
              "& p": { margin: "0.5em 0" },
              "& strong": { fontWeight: "bold" },
              "& em": { fontStyle: "italic" },
              "& ul, & ol": { paddingLeft: "1.5em", margin: "0.5em 0" },
              "& li": { margin: "0.25em 0" },
              "& img": { maxWidth: "100%", height: "auto" },
              "& code": {
                backgroundColor: "#f3f4f6",
                padding: "0.125em 0.25em",
                borderRadius: "0.25em",
                fontFamily: "monospace",
              },
            }}
          />
        </Paper>

        {/* Question Options - Cải thiện hiển thị */}
        {question.options && question.options.length > 0 && (
          <Paper className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200">
            <Box className="space-y-3">
              {question.options.map((option, index) => {
                const isCorrect = question.correctAnswer === index;
                return (
                  <Box
                    key={index}
                    className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-colors ${
                      isCorrect
                        ? "bg-green-50 border-green-300 hover:border-green-400"
                        : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Box
                      className={`flex-shrink-0 w-8 h-8 text-white rounded-full flex items-center justify-center font-bold text-sm ${
                        isCorrect ? "bg-green-500" : "bg-gray-500"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </Box>
                    <Box
                      className="text-gray-700 flex-1 leading-relaxed text-sm"
                      dangerouslySetInnerHTML={{ __html: option }}
                      sx={{
                        "& p": { margin: "0.25em 0" },
                        "& strong": { fontWeight: "bold" },
                        "& em": { fontStyle: "italic" },
                        "& img": { maxWidth: "100%", height: "auto" },
                        "& code": {
                          backgroundColor: "#f3f4f6",
                          padding: "0.125em 0.25em",
                          borderRadius: "0.25em",
                          fontFamily: "monospace",
                          fontSize: "0.9em",
                        },
                      }}
                    />
                    {isCorrect && (
                      <Box className="flex items-center gap-2">
                        <CheckCircle
                          className="text-green-600 flex-shrink-0"
                          fontSize="small"
                        />
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Paper>
        )}
      </CardContent>
    </Card>
  );
};

export default CurrentQuestion;
