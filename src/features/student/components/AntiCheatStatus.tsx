import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";

interface AntiCheatStatusProps {
  isMonitoring: boolean;
  isFullscreen: boolean;
  warningCount: number;
  maxViolations: number;
}

const AntiCheatStatus: React.FC<AntiCheatStatusProps> = ({
  isMonitoring,
  warningCount,
  maxViolations,
}) => {
  return (
    <Card className="border-l-4 border-l-orange-500 bg-gradient-to-r from-orange-50 to-red-50">
      <CardContent className="py-3">
        <Box className="flex items-center justify-between">
          <Box className="flex items-center gap-3">
            <Typography
              variant="subtitle1"
              className="font-bold text-orange-800"
            >
              🛡️ chống gian lận
            </Typography>
            <div
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                isMonitoring
                  ? "text-green-600 bg-green-100"
                  : "text-red-600 bg-red-100"
              }`}
            >
              {isMonitoring ? "🟢" : "🔴 "}
            </div>
          </Box>

          <Box className="flex items-center gap-2">



            {/* Violation Count */}
            {warningCount > 0 && (
              <div className="px-2 py-1 rounded-full text-xs font-medium text-red-600 bg-red-100">
                ⚠️ Vi phạm: {warningCount}/{maxViolations}
              </div>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AntiCheatStatus;
