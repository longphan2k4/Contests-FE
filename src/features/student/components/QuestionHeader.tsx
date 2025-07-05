import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  LinearProgress,
} from "@mui/material";
import { Quiz, Timer, Star } from "@mui/icons-material";

interface QuestionHeaderProps {
  questionOrder: number;
  remainingTime: number;
  defaultTime: number;
  score: number;
  difficulty: string;
  questionType: string;
}

const QuestionHeader: React.FC<QuestionHeaderProps> = ({
  questionOrder,
  remainingTime,
  defaultTime,
  score,
  difficulty,
  questionType,
}) => {
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

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardContent>
        <Box className="flex items-center justify-between mb-3">
          <Box className="flex items-center gap-2">
            <Quiz className="text-blue-500" />
            <Typography variant="h6" className="text-gray-800 font-semibold">
              Câu hỏi số {questionOrder}
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
              label={`${score} điểm`}
              variant="outlined"
              size="small"
            />
          </Box>
        </Box>

        <Box className="flex flex-wrap gap-2 mb-3">
          <Chip
            label={`Độ khó: ${difficulty}`}
            color={getDifficultyColor(difficulty)}
            size="small"
          />
          <Chip
            label={
              questionType === "multiple_choice" ? "Trắc nghiệm" : "Đúng/Sai"
            }
            variant="outlined"
            size="small"
          />
        </Box>

        {/* Timer Progress */}
        <Box className="mb-3">
          <LinearProgress
            variant="determinate"
            value={Math.max(0, (remainingTime / defaultTime) * 100)}
            color={getTimerColor()}
            className="h-2 rounded"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default QuestionHeader;
