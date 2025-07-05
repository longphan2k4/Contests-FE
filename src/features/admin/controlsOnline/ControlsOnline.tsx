import React, { useState, useEffect } from "react";
import { PlayIcon } from "@heroicons/react/24/outline";
import { CircularProgress, Alert, Snackbar } from "@mui/material";
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
  const { examState, isConnected, startExam } = useAdminSocket();

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

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
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
          <div className="mb-3">
            {matchData?.status === "ongoing" || examState.isStarted ? (
              <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-700 font-medium">
                  Học sinh có thể nhận câu hỏi (trận đã bắt đầu)
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 bg-orange-50 border border-orange-200 rounded-lg p-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-orange-700 font-medium">
                  ⚠️ Học sinh chưa thể nhận câu hỏi (cần bắt đầu trận trước)
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center mb-4">
          {/* Row 1: Start Match và Show Question */}
          <button
            onClick={handleStartExam}
            disabled={
              (matchData && matchData.status !== "upcoming") ||
              examState.isStarted ||
              examState.isLoading ||
              !isConnected
            }
            className={`px-20 py-4 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors ${
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
