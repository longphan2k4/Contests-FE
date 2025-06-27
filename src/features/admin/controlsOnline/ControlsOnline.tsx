import React, { useState } from "react";
import {
  PlayIcon,
  PauseIcon,
  StopIcon,
  ForwardIcon,
} from "@heroicons/react/24/outline";
import { Chip, CircularProgress, Alert, Snackbar } from "@mui/material";
import { useAdminSocket } from "./hooks/useAdminSocket";

// interface ControlsOnlineProps {
//   // Props sẽ được thêm sau khi có logic socket
// }

const ControlsOnline: React.FC = () => {
  const {
    examState,
    isConnected,
    startExam,
    pauseExam,
    resumeExam,
    stopExam,
    nextQuestion,
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

  const showNotification = (
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
        showNotification("Kỳ thi đã bắt đầu thành công!", "success");
      } else {
        showNotification(
          response.message || "Không thể bắt đầu kỳ thi",
          "error"
        );
      }
    } catch (error) {
      showNotification("Có lỗi xảy ra khi bắt đầu kỳ thi", "error");
      console.error("Error starting exam:", error);
    }
  };

  const handlePauseResume = async () => {
    try {
      const response = examState.isPaused
        ? await resumeExam()
        : await pauseExam();
      if (response.success) {
        const action = examState.isPaused ? "tiếp tục" : "tạm dừng";
        showNotification(`Kỳ thi đã ${action} thành công!`, "success");
      } else {
        showNotification(
          response.message || "Không thể thực hiện thao tác",
          "error"
        );
      }
    } catch (error) {
      showNotification("Có lỗi xảy ra khi thực hiện thao tác", "error");
      console.error("Error pause/resume exam:", error);
    }
  };

  const handleStopExam = async () => {
    try {
      const response = await stopExam();
      if (response.success) {
        showNotification("Kỳ thi đã kết thúc thành công!", "success");
      } else {
        showNotification(
          response.message || "Không thể kết thúc kỳ thi",
          "error"
        );
      }
    } catch (error) {
      showNotification("Có lỗi xảy ra khi kết thúc kỳ thi", "error");
      console.error("Error stopping exam:", error);
    }
  };

  const handleNextQuestion = async () => {
    try {
      const response = await nextQuestion();
      if (response.success) {
        showNotification("Đã chuyển sang câu hỏi tiếp theo!", "success");
      } else {
        showNotification(
          response.message || "Không thể chuyển câu hỏi",
          "error"
        );
      }
    } catch (error) {
      showNotification("Có lỗi xảy ra khi chuyển câu hỏi", "error");
      console.error("Error next question:", error);
    }
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

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
                !examState.isStarted
                  ? "Chưa bắt đầu"
                  : examState.isPaused
                  ? "Tạm dừng"
                  : "Đang diễn ra"
              }
              color={
                !examState.isStarted
                  ? "default"
                  : examState.isPaused
                  ? "warning"
                  : "success"
              }
              variant="filled"
              size="small"
              className="font-semibold"
            />
            {examState.isStarted && (
              <div className="text-sm text-gray-600">
                Câu hỏi {examState.currentQuestion} | Thời gian còn lại:{" "}
                {Math.floor(examState.timeRemaining / 60)}:
                {(examState.timeRemaining % 60).toString().padStart(2, "0")}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <button
            onClick={handleStartExam}
            disabled={
              examState.isStarted || examState.isLoading || !isConnected
            }
            className={`px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors ${
              examState.isStarted || examState.isLoading || !isConnected
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            {examState.isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <PlayIcon className="h-5 w-5" />
            )}
            <span>Bắt Đầu Thi</span>
          </button>

          <button
            onClick={handlePauseResume}
            disabled={
              !examState.isStarted || examState.isLoading || !isConnected
            }
            className={`px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors ${
              !examState.isStarted || examState.isLoading || !isConnected
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : examState.isPaused
                ? "bg-yellow-600 text-white hover:bg-yellow-700"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {examState.isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <PauseIcon className="h-5 w-5" />
            )}
            <span>{examState.isPaused ? "Tiếp Tục" : "Tạm Dừng"}</span>
          </button>

          <button
            onClick={handleNextQuestion}
            disabled={
              !examState.isStarted ||
              examState.isPaused ||
              examState.isLoading ||
              !isConnected
            }
            className={`px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors ${
              !examState.isStarted ||
              examState.isPaused ||
              examState.isLoading ||
              !isConnected
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {examState.isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <ForwardIcon className="h-5 w-5" />
            )}
            <span>Câu Tiếp Theo</span>
          </button>

          <button
            onClick={handleStopExam}
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
            <span>Kết Thúc Thi</span>
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
