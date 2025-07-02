import React, { useState, useEffect } from "react";
import {
  PlayIcon,
  PauseIcon,
  StopIcon,
  EyeIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { Chip, CircularProgress, Alert, Snackbar } from "@mui/material";
import { useAdminSocket } from "./hooks/useAdminSocket";

interface MatchData {
  id: number;
  slug: string;
  name: string;
  currentQuestion: number;
  remainingTime: number;
  status: "upcoming" | "ongoing" | "finished";
  totalQuestions: number;
  defaultTime: number;
}

interface ControlsOnlineProps {
  matchData?: MatchData | null;
}

const ControlsOnline: React.FC<ControlsOnlineProps> = ({ matchData }) => {
  const {
    examState,
    isConnected,
    startExam,
    showQuestion,
    playTimer,
    pauseTimer,
    resetTimer,
  } = useAdminSocket();

  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  const showToast = (
    message: string,
    severity: "success" | "error" | "info"
  ) => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const handleStartExam = async () => {
    try {
      const response = await startExam();
      if (response.success) {
        showToast("Trận đấu đã bắt đầu thành công!", "success");
      } else {
        showToast(response.message || "Không thể bắt đầu trận đấu", "error");
      }
    } catch (error) {
      showToast("Có lỗi xảy ra khi bắt đầu trận đấu", "error");
      console.error("Error starting exam:", error);
    }
  };

  const handleShowQuestion = async () => {
    try {
      const response = await showQuestion();
      if (response?.success) {
        showToast("Đã hiển thị câu hỏi cho thí sinh!", "success");
      } else {
        showToast(response?.message || "Không thể hiển thị câu hỏi", "error");
      }
    } catch (error) {
      showToast("Có lỗi xảy ra khi hiển thị câu hỏi", "error");
      console.error("Error showing question:", error);
    }
  };

  const handlePlayTimer = async () => {
    try {
      const response = await playTimer();
      if (response.success) {
        showToast("Đã bắt đầu bộ đếm thời gian!", "success");
      } else {
        showToast(response.message || "Không thể bắt đầu timer", "error");
      }
    } catch (error) {
      showToast("Có lỗi xảy ra khi bắt đầu timer", "error");
      console.error("Error playing timer:", error);
    }
  };

  const handlePauseTimer = async () => {
    try {
      const response = await pauseTimer();
      if (response.success) {
        showToast("Đã tạm dừng bộ đếm thời gian!", "success");
      } else {
        showToast(response.message || "Không thể tạm dừng timer", "error");
      }
    } catch (error) {
      showToast("Có lỗi xảy ra khi tạm dừng timer", "error");
      console.error("Error pausing timer:", error);
    }
  };

  const handleResetTimer = async () => {
    try {
      const response = await resetTimer();
      if (response.success) {
        showToast("Đã reset bộ đếm thời gian!", "success");
      } else {
        showToast(response.message || "Không thể reset timer", "error");
      }
    } catch (error) {
      showToast("Có lỗi xảy ra khi reset timer", "error");
      console.error("Error resetting timer:", error);
    }
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    console.log("📊 [CONTROLS UI] matchData ban đầu:", matchData);
    if (matchData) {
      console.log("📊 [CONTROLS UI] matchData.status:", matchData.status);
      console.log("📊 [CONTROLS UI] matchData details:", {
        id: matchData.id,
        name: matchData.name,
        status: matchData.status,
        currentQuestion: matchData.currentQuestion,
        remainingTime: matchData.remainingTime,
      });
    }
  }, [matchData]);

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      {!isConnected && (
        <Alert severity="warning" className="mb-4">
          Mất kết nối socket. Đang thử kết nối lại...
        </Alert>
      )}

      {/* Điều khiển chính */}
      <div className="bg-white p-6 rounded-xl w-full border-l-4 border-l-blue-500">
        {/* Trạng thái thi */}
        <div className="mb-4 rounded-lg">
          <div className="flex items-center space-x-3 cursor-help">
            <Chip
              label={
                matchData
                  ? matchData.status === "ongoing"
                    ? examState.isPaused
                      ? "Tạm dừng"
                      : "Đang diễn ra"
                    : matchData.status === "finished"
                    ? "Đã kết thúc"
                    : "Chưa bắt đầu"
                  : !examState.isStarted
                  ? "Chưa bắt đầu"
                  : examState.isPaused
                  ? "Tạm dừng"
                  : "Đang diễn ra"
              }
              color={
                matchData
                  ? matchData.status === "ongoing"
                    ? examState.isPaused
                      ? "warning"
                      : "success"
                    : matchData.status === "finished"
                    ? "error"
                    : "default"
                  : !examState.isStarted
                  ? "default"
                  : examState.isPaused
                  ? "warning"
                  : "success"
              }
              variant="filled"
              size="small"
              className="font-semibold"
            />

            {/* Hiển thị timer info */}
            {examState.isStarted && (
              <>
                <Chip
                  label={`Thời gian: ${examState.timeRemaining}s`}
                  color="info"
                  variant="outlined"
                  size="small"
                  icon={<ClockIcon className="h-4 w-4" />}
                />
                <Chip
                  label={
                    examState.questionShown
                      ? "Câu hỏi đã hiển thị"
                      : "Chưa hiển thị câu hỏi"
                  }
                  color={examState.questionShown ? "success" : "warning"}
                  variant="outlined"
                  size="small"
                />
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Row 1: Start Match và Show Question */}
          <button
            onClick={handleStartExam}
            disabled={
              (matchData && matchData.status !== "upcoming") ||
              examState.isStarted ||
              examState.isLoading ||
              !isConnected
            }
            className={`px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors ${
              (matchData && matchData.status !== "upcoming") ||
              examState.isStarted ||
              examState.isLoading ||
              !isConnected
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            {examState.isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <PlayIcon className="h-5 w-5" />
            )}
            <span>
              {(matchData && matchData.status !== "upcoming") ||
              examState.isStarted
                ? "Đã bắt đầu"
                : "Bắt Đầu Trận"}
            </span>
          </button>

          <button
            onClick={handleShowQuestion}
            disabled={
              !examState.isStarted || examState.isLoading || !isConnected
            }
            className={`px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors ${
              !examState.isStarted || examState.isLoading || !isConnected
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-purple-500 text-white hover:bg-purple-600"
            }`}
          >
            {examState.isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
            <span>Hiển Thị Câu Hỏi</span>
          </button>
        </div>

        {/* Timer Controls */}
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={handlePlayTimer}
            disabled={
              !examState.isStarted ||
              !examState.questionShown ||
              examState.isLoading ||
              !isConnected
            }
            className={`px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors ${
              !examState.isStarted ||
              !examState.questionShown ||
              examState.isLoading ||
              !isConnected
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {examState.isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <PlayIcon className="h-5 w-5" />
            )}
            <span>Bắt Đầu Timer</span>
          </button>

          <button
            onClick={handlePauseTimer}
            disabled={
              !examState.isStarted || examState.isLoading || !isConnected
            }
            className={`px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors ${
              !examState.isStarted || examState.isLoading || !isConnected
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-yellow-600 text-white hover:bg-yellow-700"
            }`}
          >
            {examState.isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <PauseIcon className="h-5 w-5" />
            )}
            <span>Tạm Dừng Timer</span>
          </button>

          <button
            onClick={handleResetTimer}
            disabled={
              !examState.isStarted || examState.isLoading || !isConnected
            }
            className={`px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors ${
              !examState.isStarted || examState.isLoading || !isConnected
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            {examState.isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <StopIcon className="h-5 w-5" />
            )}
            <span>Reset Timer</span>
          </button>
        </div>
      </div>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ControlsOnline;
