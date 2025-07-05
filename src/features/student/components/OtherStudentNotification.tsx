import React from "react";
import { Box, Typography, Chip, IconButton } from "@mui/material";
import { Notifications, Cancel } from "@mui/icons-material";

interface OtherStudentAnswer {
  studentName: string;
  isCorrect: boolean;
  questionOrder: number;
  submittedAt: string;
  contestantId: number;
}

interface OtherStudentNotificationProps {
  showNotification: boolean;
  latestAnswer: OtherStudentAnswer | null;
  onClose: () => void;
}

const OtherStudentNotification: React.FC<OtherStudentNotificationProps> = ({
  showNotification,
  latestAnswer,
  onClose,
}) => {
  if (!showNotification || !latestAnswer) return null;

  return (
    <Box
      className="fixed top-4 right-4 z-50 bg-white border-l-4 border-orange-500 shadow-lg rounded-lg p-4 min-w-80 animate-slide-in-right"
      style={{ zIndex: 9999 }}
    >
      <Box className="flex items-center justify-between">
        <Box className="flex items-center gap-2">
          <Notifications className="text-orange-500 text-xl" />
          <Box>
            <Typography variant="body2" className="font-medium text-gray-800">
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
                {new Date(latestAnswer.submittedAt).toLocaleTimeString("vi-VN")}
              </Typography>
            </Box>
          </Box>
        </Box>
        <IconButton
          size="small"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <Cancel />
        </IconButton>
      </Box>
    </Box>
  );
};

export default OtherStudentNotification;
