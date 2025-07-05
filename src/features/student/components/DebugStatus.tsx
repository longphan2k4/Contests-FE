import React from "react";
import { Box, Typography, Card, CardContent, Chip } from "@mui/material";

interface DebugStatusProps {
  isEliminated: boolean;
  isBanned: boolean;
  isSubmitted: boolean;
  canShowResult: boolean;
  hasAnswerResult: boolean;
  eliminationMessage: string;
  banMessage: string;
  selectedAnswer: string;
}

const DebugStatus: React.FC<DebugStatusProps> = ({
  isEliminated,
  isBanned,
  isSubmitted,
  canShowResult,
  hasAnswerResult,
  eliminationMessage,
  banMessage,
  selectedAnswer,
}) => {
  return (
    <Card className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 mb-4">
      <CardContent className="py-3">
        <Typography
          variant="subtitle1"
          className="font-bold text-purple-800 mb-2"
        >
          🔍 Debug Status
        </Typography>

        <Box className="grid grid-cols-2 gap-2 text-sm">
          <Box className="space-y-1">
            <Box className="flex items-center gap-2">
              <Chip
                size="small"
                label={isEliminated ? "ELIMINATED" : "NOT ELIMINATED"}
                color={isEliminated ? "error" : "success"}
                className="text-xs"
              />
            </Box>

            <Box className="flex items-center gap-2">
              <Chip
                size="small"
                label={isBanned ? "BANNED" : "NOT BANNED"}
                color={isBanned ? "error" : "success"}
                className="text-xs"
              />
            </Box>

            <Box className="flex items-center gap-2">
              <Chip
                size="small"
                label={isSubmitted ? "SUBMITTED" : "NOT SUBMITTED"}
                color={isSubmitted ? "primary" : "default"}
                className="text-xs"
              />
            </Box>
          </Box>

          <Box className="space-y-1">
            <Box className="flex items-center gap-2">
              <Chip
                size="small"
                label={canShowResult ? "CAN SHOW RESULT" : "CANNOT SHOW RESULT"}
                color={canShowResult ? "success" : "warning"}
                className="text-xs"
              />
            </Box>

            <Box className="flex items-center gap-2">
              <Chip
                size="small"
                label={
                  hasAnswerResult ? "HAS ANSWER RESULT" : "NO ANSWER RESULT"
                }
                color={hasAnswerResult ? "success" : "default"}
                className="text-xs"
              />
            </Box>

            <Box className="flex items-center gap-2">
              <Chip
                size="small"
                label={
                  selectedAnswer ? `ANSWER: ${selectedAnswer}` : "NO ANSWER"
                }
                color={selectedAnswer ? "primary" : "default"}
                className="text-xs"
              />
            </Box>
          </Box>
        </Box>

        {(eliminationMessage || banMessage) && (
          <Box className="mt-2 p-2 bg-gray-100 rounded text-xs">
            <Typography variant="caption" className="font-medium text-gray-700">
              Messages:
            </Typography>
            {eliminationMessage && (
              <Typography variant="caption" className="block text-red-600">
                Elimination: {eliminationMessage}
              </Typography>
            )}
            {banMessage && (
              <Typography variant="caption" className="block text-red-600">
                Ban: {banMessage}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default DebugStatus;
