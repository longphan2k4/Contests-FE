import React, { useState } from "react";
import ControlsOnline from "./ControlsOnline";
import CurrentQuestion from "./CurrentQuestion";
import { Box, Typography, Card, Switch } from "@mui/material";
import { AcademicCapIcon } from "@heroicons/react/24/outline";
import { useAdminSocket } from "./hooks/useAdminSocket";
import { useParams } from "react-router-dom";
import { useMatchInfo } from "./hooks/useControls";

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

interface OnlineExamControlProps {
  currentQuestionData?: CurrentQuestionData;
  isGameStarted?: boolean;
  remainingTime?: number;
  isLoading?: boolean;
  isTimerPaused?: boolean;
}

const OnlineExamControl: React.FC<OnlineExamControlProps> = ({
  currentQuestionData,
  isGameStarted: propIsGameStarted,
  remainingTime: propRemainingTime,
  isLoading: propIsLoading,
  isTimerPaused: propIsTimerPaused,
}) => {
  const { match } = useParams();

  // Fetch match data từ API
  const { data: matchResponse } = useMatchInfo(match ?? null);


  // Sử dụng dữ liệu từ socket hook
  const { examState } = useAdminSocket();

  // Ưu tiên dữ liệu từ socket hook
  const isGameStarted = examState.isStarted || propIsGameStarted || false;
  const remainingTime = examState.timeRemaining || propRemainingTime || 0;
  const isLoading = examState.isLoading || propIsLoading || false;
  const isTimerPaused = examState.isPaused || propIsTimerPaused || false;

  const [isOnlineMode, setIsOnlineMode] = useState(false);

  return (
    <Box className="space-y-6">
      {/* Header */}
      <Box className="mb-6">
        <div className="flex items-center justify-between">
          <Typography
            variant="h4"
            className="text-gray-800 font-bold flex items-center"
          >
            <AcademicCapIcon className="h-8 w-8 mr-3 text-blue-600" />
            Điều Khiển Thi Online
          </Typography>
          {/* Switch bật/tắt mode online */}
          <div className="flex items-center space-x-2">
            <span
              className={`font-semibold ${
                isOnlineMode ? "text-blue-600" : "text-gray-400"
              }`}
            >
              Online
            </span>
            <Switch
              checked={isOnlineMode}
              onChange={(e) => setIsOnlineMode(e.target.checked)}
              color="primary"
              inputProps={{ "aria-label": "Bật/tắt mode online" }}
            />
          </div>
        </div>
      </Box>
      {isOnlineMode && (
        <Box className="flex flex-col ">
          <Card elevation={3} className="h-fit">
            <CurrentQuestion
              currentQuestionData={currentQuestionData}
              isGameStarted={isGameStarted}
              remainingTime={remainingTime}
              isLoading={isLoading}
              isTimerPaused={isTimerPaused}
            />
          </Card>

          <Card elevation={3} className="h-fit mt-4">
            <ControlsOnline matchData={matchResponse?.data || null} />
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default OnlineExamControl;
