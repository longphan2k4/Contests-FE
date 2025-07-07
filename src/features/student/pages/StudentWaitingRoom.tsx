import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStudentRealTime } from "../hooks/useStudentRealTime";
import StudentApiService from "../services/api";
import {
  UserGroupIcon,
  TrophyIcon,
  ExclamationTriangleIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { useAntiCheat } from "../hooks/useAntiCheat";
import { Dialog, DialogContent, Typography, Button } from "@mui/material";
import { useNotification } from "../../../contexts/NotificationContext";
import { QuestionAnswerRefactored } from "../components";
import { useStudentContext } from "../contexts/StudentContext";
import type { Match } from "../types";

const StudentWaitingRoom: React.FC = () => {
  const { matchSlug } = useParams<{ matchSlug: string }>();
  const navigate = useNavigate();
  const { showSuccessNotification } = useNotification();
  const {
    contestantInfo,
    setContestantInfo,
    registrationNumber,
    setRegistrationNumber,
  } = useStudentContext();

  // 🔥 NEW: State for banned status, lifted up from QuestionAnswer
  const [isBanned, setIsBanned] = useState(false);
  const [banMessage, setBanMessage] = useState("");
  const handleContestantBanned = (message: string) => {
    setIsBanned(true);
    setBanMessage(message);
  };

  const [loading, setLoading] = useState(true);
  const [regLoading, setRegLoading] = useState(false);

  // Khi vào trang: lấy profile và registrationNumber nếu chưa có
  useEffect(() => {
    const isMounted = true;
    setLoading(true);
    if (!contestantInfo) {
      StudentApiService.getProfileStudent()
        .then((data) => {
          if (isMounted) setContestantInfo(data.data);
        })
        .catch(() => {
          if (isMounted) setContestantInfo(null);
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [contestantInfo, setContestantInfo]);

  // Lấy registrationNumber nếu chưa có và đã có contestantInfo
  useEffect(() => {
    if (contestantInfo && !registrationNumber && matchSlug) {
      setRegLoading(true);
      const contestantId = contestantInfo.contestant.id;
      let matchId: number | null = null;
      const match = contestantInfo.matches.find(
        (m: Match) => m.slug === matchSlug || m.id === parseInt(matchSlug)
      );
      if (match) matchId = match.id;
      if (contestantId && matchId) {
        StudentApiService.getRegistrationNumber(contestantId, matchId)
          .then((res) => {
            if (
              res.success &&
              res.data &&
              typeof res.data.registrationNumber === "number"
            ) {
              setRegistrationNumber(res.data.registrationNumber);
            }
          })
          .catch(() => {
            setRegistrationNumber(null);
          })
          .finally(() => setRegLoading(false));
      } else {
        setRegLoading(false);
      }
    }
  }, [contestantInfo, registrationNumber, matchSlug, setRegistrationNumber]);

  // Redirect nếu không có thông tin thí sinh hoặc registrationNumber
  useEffect(() => {
    if (!loading && !regLoading && !contestantInfo) {
      navigate("/student/login");
    }
  }, [loading, regLoading, contestantInfo, registrationNumber, navigate]);

  // 🔥 FIX: Tìm match bằng slug thay vì ID - với fallback cho ID
  const currentMatch = useMemo(() => {
    if (!contestantInfo?.matches || !matchSlug) return null;
    let match = contestantInfo.matches.find((m: Match) => m.slug === matchSlug);
    if (!match) {
      const matchId = parseInt(matchSlug);
      if (!isNaN(matchId)) {
        match = contestantInfo.matches.find((m: Match) => m.id === matchId);
      }
    }
    if (!match) {
      return null;
    }
    return {
      id: match.id,
      slug: match.slug || matchSlug,
      name: match.name,
      status: match.status,
      currentQuestion: match.currentQuestion,
      remainingTime: match.remainingTime,
    };
  }, [contestantInfo?.matches, matchSlug]);

  // 🔥 NEW: Tạo contestantInfo object từ dữ liệu thực tế
  const realContestantInfo = useMemo(() => {
    if (!contestantInfo) return null;
    return {
      student: {
        fullName: contestantInfo.contestant.fullName,
        studentCode: contestantInfo.contestant.studentCode,
      },
      contest: {
        name: contestantInfo.contest.name,
        slug: contestantInfo.contest.slug,
        status: "active",
      },
      round: {
        name: "Vòng thi",
      },
      status: "compete",
    };
  }, [contestantInfo]);

  const isConnected = true;
  const { realTimeState, isConnected: isRealTimeConnected } =
    useStudentRealTime(matchSlug);
  const isRealTimeStarted = realTimeState.isMatchStarted;

  useEffect(() => {
    if (realTimeState.isRescued) {
      showSuccessNotification(
        "Bạn đã được cứu trợ! Hãy tiếp tục thi đấu",
        "success"
      );
    }
  }, [realTimeState.isRescued, showSuccessNotification]);
  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "text-yellow-600 bg-yellow-100";
      case "active":
      case "ongoing":
        return "text-green-600 bg-green-100";
      case "completed":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "upcoming":
        return "Sắp diễn ra";
      case "active":
      case "ongoing":
        return "Đang diễn ra";
      case "completed":
        return "Đã kết thúc";
      default:
        return "Không xác định";
    }
  };

  // 🛡️ State cho modal xác nhận fullscreen
  const [showFullscreenConfirm, setShowFullscreenConfirm] = useState(false);
  const [fullscreenError, setFullscreenError] = useState<string | null>(null);

  // 🛡️ Sử dụng hook anti-cheat để lấy enterFullscreen
  const { enterFullscreen, isFullscreen } = useAntiCheat();

  // Khi vào trang, nếu chưa fullscreen thì hiện modal
  useEffect(() => {
    if (!isFullscreen) {
      setShowFullscreenConfirm(true);
      setFullscreenError(null);
    } else {
      setShowFullscreenConfirm(false);
      setFullscreenError(null);
    }
  }, [isFullscreen]);

  // Handler xác nhận vào fullscreen trong modal
  const handleConfirmFullscreen = useCallback(async () => {
    const success = await enterFullscreen();
    if (success) {
      setShowFullscreenConfirm(false);
      setFullscreenError(null);
    } else {
      setFullscreenError(
        "Không thể vào chế độ toàn màn hình. Vui lòng thử lại hoặc kiểm tra trình duyệt!"
      );
    }
  }, [enterFullscreen]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Đang tải thông tin thí sinh...
          </h2>
          <p className="text-gray-600">Vui lòng chờ trong giây lát</p>
        </div>
      </div>
    );
  }

  if (!contestantInfo || !realContestantInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Không tìm thấy trận đấu
          </h2>
          <p className="text-gray-600">
            Trận đấu với ID {matchSlug} không tồn tại hoặc bạn không có quyền
            truy cập.
          </p>
          <button
            onClick={() => navigate("/student/dashboard")}
            className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Về Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <TrophyIcon className="w-8 h-8 text-indigo-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {isRealTimeStarted
                    ? "Phòng thi trực tuyến"
                    : "Phòng chờ thi đấu"}
                </h1>
                <p className="text-sm text-gray-500">
                  Thí sinh: {realContestantInfo.student.fullName}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isConnected && isRealTimeConnected
                    ? "text-green-600 bg-green-100"
                    : "text-red-600 bg-red-100"
                }`}
              >
                {isConnected && isRealTimeConnected
                  ? "🟢 Đã kết nối"
                  : "🔴 Mất kết nối"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Nếu trận đấu đã bắt đầu và có câu hỏi, hiển thị component QuestionAnswer */}
        {isRealTimeStarted && realTimeState.currentQuestion && (
          <div className="mb-8">
            {/* Contest Info - Di chuyển lên trên để hiển thị thông tin cuộc thi */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <TrophyIcon className="w-6 h-6 text-yellow-500 mr-2" />
                Thông tin cuộc thi
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-indigo-600">
                    {realContestantInfo.contest.name}
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Trạng thái cuộc thi</p>
                    <div
                      className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        realContestantInfo.contest.status
                      )}`}
                    >
                      {getStatusText(realContestantInfo.contest.status)}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Vòng thi</p>
                    <p className="font-semibold text-gray-800">
                      {realContestantInfo.round.name}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Thông tin thí sinh</p>
                    <p className="font-semibold text-gray-800">
                      {realContestantInfo.student.fullName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {realContestantInfo.student.studentCode}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* QuestionAnswer Component - Chiếm toàn bộ chiều rộng */}
            <QuestionAnswerRefactored
              currentQuestion={realTimeState.currentQuestion}
              remainingTime={realTimeState.remainingTime}
              matchId={currentMatch?.id || 0}
              isConnected={isConnected && isRealTimeConnected}
              isBanned={isBanned}
              banMessage={banMessage}
              onContestantBanned={handleContestantBanned}
              isEliminated={realTimeState.isEliminated}
              eliminationMessage={realTimeState.eliminationMessage}
              isRescued={realTimeState.isRescued}
            />
          </div>
        )}

        {/* Layout khi chưa có câu hỏi hoặc chưa bắt đầu */}
        {(!isRealTimeStarted || !realTimeState.currentQuestion) && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contest Info */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <TrophyIcon className="w-6 h-6 text-yellow-500 mr-2" />
                  Thông tin cuộc thi
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-indigo-600">
                      {realContestantInfo.contest.name}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500">
                        Trạng thái cuộc thi
                      </p>
                      <div
                        className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          realContestantInfo.contest.status
                        )}`}
                      >
                        {getStatusText(realContestantInfo.contest.status)}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500">Vòng thi</p>
                      <p className="font-semibold text-gray-800">
                        {realContestantInfo.round.name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thông báo quy định chống gian lận */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-400 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-orange-800 mb-4 flex items-center">
                  🛡️ Quy định chống gian lận
                </h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start space-x-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>
                      Bắt buộc vào chế độ <strong>toàn màn hình</strong> khi làm
                      bài
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>
                      Không được <strong>chuyển tab</strong> hoặc minimize cửa
                      sổ
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>
                      Không được sử dụng <strong>Copy/Paste</strong>{" "}
                      (Ctrl+C/V/X)
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>
                      Không được mở <strong>menu chuột phải</strong>
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>
                      Không được mở <strong>Developer Tools</strong> (F12)
                    </span>
                  </div>
                  <div className="mt-4 p-3 bg-orange-100 rounded-lg border border-orange-200">
                    <p className="text-orange-800 font-medium text-center">
                      ⚠️ Vi phạm quá <strong>3 lần</strong> sẽ bị kết thúc bài
                      thi!
                    </p>
                  </div>
                </div>
              </div>

              {/* Hiển thị thông báo chờ khi chưa có câu hỏi */}
              {isRealTimeStarted && !realTimeState.currentQuestion && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="text-center py-8">
                    <QuestionMarkCircleIcon className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      Đang chờ câu hỏi
                    </h3>
                    <p className="text-gray-600">
                      Giáo viên sẽ bắt đầu câu hỏi đầu tiên trong giây lát...
                    </p>
                    <div className="mt-4 animate-pulse">
                      <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        <span className="text-blue-700 font-medium">
                          Sẵn sàng thi đấu
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Student Info */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <UserGroupIcon className="w-5 h-5 text-green-500 mr-2" />
                  Thông tin thí sinh
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Họ tên</p>
                    <p className="font-semibold text-gray-800">
                      {realContestantInfo.student.fullName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Mã thí sinh</p>
                    <p className="font-semibold text-gray-800">
                      {realContestantInfo.student.studentCode}
                    </p>
                  </div>
                  {contestantInfo.contestant.class && (
                    <div>
                      <p className="text-sm text-gray-500">Lớp</p>
                      <p className="font-semibold text-gray-800">
                        {contestantInfo.contestant.class}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">Trạng thái</p>
                    <div
                      className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                        realContestantInfo.status === "compete"
                          ? "text-green-600 bg-green-100"
                          : realContestantInfo.status === "eliminated"
                          ? "text-red-600 bg-red-100"
                          : "text-gray-600 bg-gray-100"
                      }`}
                    >
                      {realContestantInfo.status === "compete"
                        ? "Đang thi đấu"
                        : realContestantInfo.status === "eliminated"
                        ? "Đã bị loại"
                        : "Hoàn thành"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal xác nhận fullscreen */}
      {showFullscreenConfirm && (
        <Dialog open fullWidth maxWidth="xs">
          <DialogContent>
            <Typography variant="h6" gutterBottom align="center">
              Cho phép chế độ toàn màn hình
            </Typography>
            <Button
              variant="contained"
              color="error"
              size="large"
              onClick={handleConfirmFullscreen}
              sx={{ display: "block", mx: "auto", mt: 2 }}
            >
              Xác nhận
            </Button>
            {fullscreenError && (
              <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                {fullscreenError}
              </Typography>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default StudentWaitingRoom;
