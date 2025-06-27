import React from "react";
import ControlsOnline from "./ControlsOnline";
import CurrentQuestion from "./CurrentQuestion";
import { Box, Typography, Card } from "@mui/material";
import { AcademicCapIcon } from "@heroicons/react/24/outline";

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
  isGameStarted = false,
  remainingTime = 0,
  isLoading = false,
  isTimerPaused = false,
}) => {
  return (
    <Box className="space-y-6">
      {/* Header */}
      <Box className="mb-6">
        <Typography
          variant="h4"
          className="text-gray-800 font-bold flex items-center"
        >
          <AcademicCapIcon className="h-8 w-8 mr-3 text-blue-600" />
          Điều Khiển Thi Online
        </Typography>
      </Box>

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
          <ControlsOnline />
        </Card>
      </Box>
    </Box>
  );
};

export default OnlineExamControl;
