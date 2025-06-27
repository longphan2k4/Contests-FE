import React, { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStudentAuth } from "../hooks/useStudentAuth";
import { useStudentRealTime } from "../hooks/useStudentRealTime";
import QuestionAnswer from "../components/QuestionAnswer";
import {
  UserGroupIcon,
  TrophyIcon,
  ExclamationTriangleIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";

const StudentWaitingRoom: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useStudentAuth();

  // Redirect nếu chưa đăng nhập
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/student/login");
    }
  }, [isAuthenticated, navigate]);

  const parsedMatchId = matchId ? parseInt(matchId) : 0;

  // Mock data đơn giản để test QuestionAnswer - sẽ được thay thế bằng real API sau
  const currentMatch = useMemo(
    () => ({
      id: parsedMatchId,
      name: `Trận đấu ${parsedMatchId}`,
      status: "upcoming",
      currentQuestion: 0,
      remainingTime: 0,
    }),
    [parsedMatchId]
  );

  const contestantInfo = {
    student: {
      fullName: "Học sinh Demo",
      studentCode: "HS001",
    },
    contest: {
      name: "Contest Demo",
      slug: "contest-demo",
      status: "active",
    },
    round: {
      name: "Vòng loại",
    },
    status: "compete",
  };

  const isJoined = true;
  const isConnected = true;

  // Sử dụng real-time hook để lắng nghe events
  const { realTimeState, isConnected: isRealTimeConnected } =
    useStudentRealTime(parsedMatchId);

  const isRealTimeStarted = realTimeState.isMatchStarted;

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

  if (!currentMatch || !contestantInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Không tìm thấy trận đấu
          </h2>
          <p className="text-gray-600">
            Trận đấu với ID {matchId} không tồn tại hoặc bạn không có quyền truy
            cập.
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
                  Thí sinh: {contestantInfo.student.fullName}
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
              {isJoined && (
                <div className="px-3 py-1 rounded-full text-sm font-medium text-blue-600 bg-blue-100">
                  ✅ Đã tham gia
                </div>
              )}
              {isRealTimeStarted && (
                <div className="px-3 py-1 rounded-full text-sm font-medium text-orange-600 bg-orange-100 animate-pulse">
                  🔥 Đang thi
                </div>
              )}
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
                    {contestantInfo.contest.name}
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Trạng thái cuộc thi</p>
                    <div
                      className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        contestantInfo.contest.status
                      )}`}
                    >
                      {getStatusText(contestantInfo.contest.status)}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Vòng thi</p>
                    <p className="font-semibold text-gray-800">
                      {contestantInfo.round.name}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Thông tin thí sinh</p>
                    <p className="font-semibold text-gray-800">
                      {contestantInfo.student.fullName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {contestantInfo.student.studentCode}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* QuestionAnswer Component - Chiếm toàn bộ chiều rộng */}
            <QuestionAnswer
              currentQuestion={realTimeState.currentQuestion}
              remainingTime={realTimeState.remainingTime}
              matchId={parsedMatchId}
              isConnected={isConnected && isRealTimeConnected}
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
                      {contestantInfo.contest.name}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500">
                        Trạng thái cuộc thi
                      </p>
                      <div
                        className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          contestantInfo.contest.status
                        )}`}
                      >
                        {getStatusText(contestantInfo.contest.status)}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500">Vòng thi</p>
                      <p className="font-semibold text-gray-800">
                        {contestantInfo.round.name}
                      </p>
                    </div>
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
                      {contestantInfo.student.fullName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Mã thí sinh</p>
                    <p className="font-semibold text-gray-800">
                      {contestantInfo.student.studentCode}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Trạng thái</p>
                    <div
                      className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                        contestantInfo.status === "compete"
                          ? "text-green-600 bg-green-100"
                          : contestantInfo.status === "eliminated"
                          ? "text-red-600 bg-red-100"
                          : "text-gray-600 bg-gray-100"
                      }`}
                    >
                      {contestantInfo.status === "compete"
                        ? "Đang thi đấu"
                        : contestantInfo.status === "eliminated"
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
    </div>
  );
};

export default StudentWaitingRoom;
