import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useStudentAuth } from "../hooks/useStudentAuth";
import { useStudentSocket } from "../hooks/useStudentSocket";
import { useNotification } from "../../../contexts/NotificationContext";
import type { ContestantInfo, Match } from "../types";
import {
  TrophyIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  Bars3Icon,
  XMarkIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

interface MatchEventData {
  matchId: number;
  matchName: string;
  contestName: string;
  status: string;
  currentQuestion?: number;
  remainingTime?: number;
}

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { getContestantInfo, isAuthenticated } = useStudentAuth();
  const { socket, isConnected, joinMatchRoom, leaveMatchRoom } =
    useStudentSocket();
  const { showSuccessNotification } = useNotification();
  const [contestantInfo, setContestantInfo] = useState<ContestantInfo | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    // Redirect nếu chưa đăng nhập
    // if (!isAuthenticated()) {
    //   navigate("/student/login");
    //   return;
    // }

    // Lấy thông tin contestant
    const info = getContestantInfo();
    if (info) {
      setContestantInfo(info);
    }
    setLoading(false);
  }, [isAuthenticated, getContestantInfo, navigate]);

  // Auto join all active matches when socket connects và có thông tin contestant
  useEffect(() => {
    if (!socket || !isConnected || !contestantInfo?.matches) return;

    console.log(
      "🔌 [DASHBOARD] Student socket connected, joining match rooms..."
    );

    contestantInfo.matches.forEach((match: Match) => {
      console.log(`🏠 [DASHBOARD] Joining room for match: ${match.id}`);
      joinMatchRoom(match.id);
    });

    // Cleanup - leave all rooms when component unmounts or dependencies change
    return () => {
      if (contestantInfo?.matches) {
        contestantInfo.matches.forEach((match: Match) => {
          console.log(`🚪 [DASHBOARD] Leaving room for match: ${match.id}`);
          leaveMatchRoom(match.id);
        });
      }
    };
  }, [
    socket,
    isConnected,
    contestantInfo?.matches,
    joinMatchRoom,
    leaveMatchRoom,
  ]);

  // Socket listeners cho realtime updates
  useEffect(() => {
    if (!socket) return;

    const handleMatchStarted = (data: MatchEventData) => {
      console.log("🚀 [DASHBOARD] Match started event received:", data);

      const isParticipating = contestantInfo?.matches?.some(
        (match) => match.id === data.matchId
      );

      if (isParticipating) {
        showSuccessNotification(
          `Bạn sẽ được chuyển đến phòng chờ để chuẩn bị tham gia thi đấu.`,
          `🎮 Trận đấu "${data.matchName}" đã bắt đầu!`,
          5000
        );

        // Delay một chút để user đọc thông báo trước khi chuyển trang
        setTimeout(() => {
          navigate(`/student/match/${data.matchId}`);
        }, 1500);
      }
    };

    const handleMatchUpdate = (data: MatchEventData) => {
      console.log("📝 [DASHBOARD] Match update received:", data);

      setContestantInfo((prev) => {
        if (!prev) return prev;

        const updatedMatches = prev.matches.map((match) => {
          if (match.id === data.matchId) {
            // Map socket status to Match status
            let mappedStatus: "upcoming" | "active" | "completed";
            if (data.status === "ongoing") {
              mappedStatus = "active";
            } else if (data.status === "finished") {
              mappedStatus = "completed";
            } else {
              mappedStatus = data.status as "upcoming" | "active" | "completed";
            }

            return {
              ...match,
              status: mappedStatus,
              currentQuestion: data.currentQuestion || match.currentQuestion,
              remainingTime: data.remainingTime || match.remainingTime,
            };
          }
          return match;
        });

        return {
          ...prev,
          matches: updatedMatches,
        };
      });
    };

    const handleMatchEnded = (data: MatchEventData) => {
      console.log("🏁 [DASHBOARD] Match ended event received:", data);
      handleMatchUpdate(data);
    };

    // Register socket listeners cho student namespace
    socket.on("match:started", handleMatchStarted);
    socket.on("match:statusUpdate", handleMatchUpdate);
    socket.on("match:timerUpdated", handleMatchUpdate);
    socket.on("match:ended", handleMatchEnded);

    // Backup global listener cho trường hợp không nhận được room event
    socket.on("match:globalStarted", (data: MatchEventData) => {
      console.log(
        "🌍 [DASHBOARD] Global match started event received (backup):",
        data
      );
      handleMatchStarted(data);
    });

    console.log(
      "🎧 [DASHBOARD] Socket listeners registered for student namespace"
    );

    // Cleanup function
    return () => {
      socket.off("match:started", handleMatchStarted);
      socket.off("match:statusUpdate", handleMatchUpdate);
      socket.off("match:timerUpdated", handleMatchUpdate);
      socket.off("match:ended", handleMatchEnded);
      socket.off("match:globalStarted", handleMatchStarted);
      console.log("🧹 [DASHBOARD] Socket listeners cleaned up");
    };
  }, [socket, contestantInfo, navigate, showSuccessNotification]);

  const getMatchStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "text-yellow-600 bg-yellow-100";
      case "active":
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
        return "Đang diễn ra";
      case "completed":
        return "Đã kết thúc";
      default:
        return "Không xác định";
    }
  };

  // Tính toán dữ liệu phân trang
  const paginatedMatches = useMemo(() => {
    if (!contestantInfo?.matches) return { matches: [], totalPages: 0 };

    // Sắp xếp theo ID giảm dần
    const sortedMatches = [...contestantInfo.matches].sort(
      (a, b) => b.id - a.id
    );

    // Tính toán phân trang
    const totalPages = Math.ceil(sortedMatches.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const matches = sortedMatches.slice(startIndex, endIndex);

    return { matches, totalPages };
  }, [contestantInfo?.matches, currentPage, itemsPerPage]);

  // Reset về trang 1 khi danh sách thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [contestantInfo?.matches?.length]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < paginatedMatches.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center w-full max-w-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (!contestantInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center w-full max-w-sm">
          <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Không tìm thấy thông tin
          </h2>
          <p className="text-gray-600 mb-4 text-sm">
            Không thể tải thông tin thí sinh. Vui lòng đăng nhập lại.
          </p>
          <button
            onClick={() => navigate("/student/login")}
            className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Đăng nhập lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Responsive Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Title - Responsive */}
            <div className="flex items-center space-x-4">
              <TrophyIcon className="w-8 h-8 text-indigo-600" />
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 leading-tight">
                  Student Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 truncate max-w-32 sm:max-w-none">
                  {contestantInfo.contestant.fullName}
                </p>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isConnected
                    ? "text-green-600 bg-green-100"
                    : "text-red-600 bg-red-100"
                }`}
              >
                {isConnected ? "🟢 Đã kết nối" : "🔴 Mất kết nối"}
              </div>
              <button className="text-red-600 hover:text-red-700 font-medium">
                Đăng xuất
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-2">
              {/* Connection Status - Mobile */}
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  isConnected
                    ? "text-green-600 bg-green-100"
                    : "text-red-600 bg-red-100"
                }`}
              >
                {isConnected ? "🟢" : "🔴"}
              </div>

              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {showMobileMenu ? (
                  <XMarkIcon className="w-6 h-6 text-gray-600" />
                ) : (
                  <Bars3Icon className="w-6 h-6 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          {showMobileMenu && (
            <div className="lg:hidden mt-3 pt-3 border-t border-gray-200">
              <div className="space-y-2">
                <div className="text-xs text-gray-500">
                  Kết nối: {isConnected ? "Ổn định" : "Mất kết nối"}
                </div>
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                  }}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content - Responsive Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8 space-y-6 lg:space-y-0">
          {/* Main Content - Desktop: 2 columns, Mobile: full width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contest Info Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <TrophyIcon className="w-6 h-6 text-yellow-500 mr-3" />
                <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
                  Thông tin cuộc thi
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg lg:text-xl font-semibold text-indigo-600 leading-tight">
                    {contestantInfo.contest.name}
                  </h3>
                </div>
              </div>
            </div>

            {/* Student Info Card - Mobile Only */}
            <div className="lg:hidden bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <UserIcon className="w-6 h-6 text-green-500 mr-3" />
                <h3 className="text-xl font-bold text-gray-800">
                  Thông tin cá nhân
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Họ tên</p>
                  <p className="font-semibold text-gray-800">
                    {contestantInfo.contestant.fullName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mã thí sinh</p>
                  <p className="font-semibold text-gray-800">
                    {contestantInfo.contestant.studentCode}
                  </p>
                </div>
              </div>
            </div>

            {/* Active Matches */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <ClockIcon className="w-6 h-6 text-blue-500 mr-3" />
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
                    Trận đấu đang diễn ra
                  </h2>
                </div>
                <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium">
                  {contestantInfo.matches.length}
                </span>
              </div>

              {contestantInfo.matches.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {paginatedMatches.matches.map((match) => (
                      <div
                        key={match.id}
                        className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                              {match.name}
                            </h3>

                            <div
                              className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getMatchStatusColor(
                                match.status
                              )}`}
                            >
                              {getStatusText(match.status)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {paginatedMatches.totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Hiển thị {(currentPage - 1) * itemsPerPage + 1} -{" "}
                        {Math.min(
                          currentPage * itemsPerPage,
                          contestantInfo.matches.length
                        )}{" "}
                        ( {contestantInfo.matches.length} trận đấu )
                      </div>

                      <div className="flex items-center space-x-2">
                        {/* Previous Button */}
                        <button
                          onClick={handlePrevPage}
                          disabled={currentPage === 1}
                          className={`p-2 rounded-lg transition-colors ${
                            currentPage === 1
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          <ChevronLeftIcon className="w-5 h-5" />
                        </button>

                        {/* Page Numbers */}
                        <div className="flex items-center space-x-1">
                          {Array.from(
                            { length: paginatedMatches.totalPages },
                            (_, i) => i + 1
                          ).map((page) => (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                currentPage === page
                                  ? "bg-indigo-600 text-white"
                                  : "text-gray-600 hover:bg-gray-100"
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                        </div>

                        {/* Next Button */}
                        <button
                          onClick={handleNextPage}
                          disabled={currentPage === paginatedMatches.totalPages}
                          className={`p-2 rounded-lg transition-colors ${
                            currentPage === paginatedMatches.totalPages
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          <ChevronRightIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <InformationCircleIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    Không có trận đấu nào
                  </h3>
                  <p className="text-gray-500">
                    Hiện tại không có trận đấu nào đang diễn ra.
                  </p>
                </div>
              )}
            </div>

            {/* Quick Guide - Mobile Only */}
            <div className="lg:hidden bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Hướng dẫn nhanh
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <ArrowRightIcon className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-600">
                    Nhấn "Tham gia trận đấu" để vào phòng chờ
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <ArrowRightIcon className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-600">
                    Chờ trận đấu bắt đầu và vào phòng thi
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <ArrowRightIcon className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-600">
                    Trả lời câu hỏi trong thời gian quy định
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <ArrowRightIcon className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-600">
                    Xem kết quả ngay sau khi gửi câu trả lời
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Desktop Only */}
          <div className="hidden lg:block space-y-6">
            {/* Student Info Card - Desktop Only */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <UserIcon className="w-6 h-6 text-green-500 mr-3" />
                <h3 className="text-xl font-bold text-gray-800">
                  Thông tin cá nhân
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Họ tên</p>
                  <p className="font-semibold text-gray-800">
                    {contestantInfo.contestant.fullName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mã thí sinh</p>
                  <p className="font-semibold text-gray-800">
                    {contestantInfo.contestant.studentCode}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Guide - Desktop Only */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Hướng dẫn nhanh
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <ArrowRightIcon className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-600">
                    Nhấn "Tham gia trận đấu" để vào phòng chờ
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <ArrowRightIcon className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-600">
                    Chờ trận đấu bắt đầu và vào phòng thi
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <ArrowRightIcon className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-600">
                    Trả lời câu hỏi trong thời gian quy định
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <ArrowRightIcon className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-600">
                    Xem kết quả ngay sau khi gửi câu trả lời
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
