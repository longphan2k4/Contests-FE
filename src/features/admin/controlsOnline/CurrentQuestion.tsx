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
  isGameStarted,
  remainingTime,
  isLoading,
  isTimerPaused = false,
}) => {
  // Mock data thay vì logic thực tế
  const mockQuestionData: CurrentQuestionData = {
    order: 5,
    question: {
      id: 1,
      content:
        "Trong lập trình Java, từ khóa nào được sử dụng để kế thừa từ một lớp khác?",
      intro: "Câu hỏi về Java OOP",
      questionType: "multiple_choice",
      difficulty: "Alpha",
      score: 10,
      defaultTime: 60,
      options: ["extends", "implements", "inherit", "super"],
      correctAnswer: 0,
    },
  };

  const getTimerProgress = () => {
    if (remainingTime <= 0) return 0;
    const maxTime = mockQuestionData.question.defaultTime;
    return Math.max(0, (remainingTime / maxTime) * 100);
  };

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

  if (isLoading) {
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

  const { order, question } = mockQuestionData;

  return (
    <Card elevation={3} className="w-full border-l-4 border-l-blue-500">
      <CardContent className="p-6">
        {/* Question Header */}
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
              label={`${remainingTime}s`}
              color={
                remainingTime <= 10
                  ? "error"
                  : remainingTime <= 30
                  ? "warning"
                  : "primary"
              }
              className="font-mono text-base px-4 py-2"
              size="medium"
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

        {/* Timer Progress Bar */}
        <Box className="mb-4">
          <LinearProgress
            variant="determinate"
            value={getTimerProgress()}
            color={
              remainingTime <= 10
                ? "error"
                : remainingTime <= 30
                ? "warning"
                : "primary"
            }
            className="h-3 rounded-full shadow-inner"
          />
          <Box className="flex justify-end items-center mt-2">
            <Typography variant="caption" className="text-gray-500">
              Tổng thời gian: {question.defaultTime}s
            </Typography>
          </Box>
        </Box>

        {/* Question Info Tags */}
        <Box className="flex flex-wrap gap-2 mb-4">
          <Chip
            icon={<Category />}
            label="Trắc nghiệm"
            variant="outlined"
            size="small"
            className="px-3 py-1"
          />
          <Chip
            icon={<Star />}
            label={`Độ khó: ${question.difficulty}`}
            variant="outlined"
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
          <Typography className="text-gray-700 text-base leading-relaxed">
            {question.content}
          </Typography>
        </Paper>

        {/* Question Options */}
        <Paper className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200">
          <Box className="space-y-3">
            {question.options.map((option, index) => {
              const isCorrect = question.correctAnswer === index;
              return (
                <Box
                  key={index}
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                    isCorrect
                      ? "bg-blue-50 border-blue-200 hover:border-blue-300"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Box
                    className={`flex-shrink-0 w-8 h-8 text-white rounded-full flex items-center justify-center font-bold text-sm ${
                      isCorrect ? "bg-blue-500" : "bg-gray-500"
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </Box>
                  <Typography
                    variant="body2"
                    className="text-gray-700 flex-1 leading-relaxed"
                  >
                    {option}
                  </Typography>
                  {isCorrect && (
                    <CheckCircle
                      className="text-blue-600 flex-shrink-0"
                      fontSize="small"
                    />
                  )}
                </Box>
              );
            })}
          </Box>
        </Paper>
      </CardContent>
    </Card>
  );
};

export default CurrentQuestion;
