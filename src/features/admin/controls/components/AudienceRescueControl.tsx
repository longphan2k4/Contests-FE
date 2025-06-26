import React, { useState, useEffect } from "react";
import {
  QrCodeIcon,
  ChartBarIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import {
  GetListRescues,
  updateRescueQuestionOrder,
  updateRescueStatus,
} from "../service/api";
import type { ListRescue } from "../type/control.type";

interface AudienceRescueControlProps {
  matchSlug?: string;
  currentQuestionOrder?: number; // questionOrder từ currentQuestion API
  currentQuestionNumber?: number; // currentQuestion từ matchInfo API
  totalQuestions?: number; // tổng số câu hỏi
  onShowQR: (rescueId: number) => void;
  onShowChart: (rescueId: number) => void;
  onHideAll: () => void;
}

const AudienceRescueControl: React.FC<AudienceRescueControlProps> = ({
  matchSlug,
  currentQuestionOrder,
  currentQuestionNumber,
  totalQuestions,
  onShowQR,
  onShowChart,
  onHideAll,
}) => {
  const [currentView, setCurrentView] = useState<"none" | "qr" | "chart">(
    "none"
  );
  const [selectedRescueId, setSelectedRescueId] = useState<number | null>(null);
  const [rescues, setRescues] = useState<ListRescue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load danh sách rescue khi có matchSlug
  useEffect(() => {
    if (matchSlug) {
      loadRescues();
    }
  }, [matchSlug]);

  const loadRescues = async () => {
    if (!matchSlug) return;

    setLoading(true);
    setError(null);
    try {
      const response = await GetListRescues(matchSlug);
      if (response.success) {
        setRescues(response.data);

        // Chỉ auto select rescue đầu tiên có status notUsed khi chưa có rescue nào được chọn
        if (!selectedRescueId) {
          const firstAvailable = response.data.find(
            (rescue: ListRescue) => rescue.status === "notUsed"
          );
          if (firstAvailable) {
            setSelectedRescueId(firstAvailable.id);
          }
        }
      } else {
        setError("Không thể tải danh sách rescue");
      }
    } catch (err) {
      setError("Lỗi khi tải danh sách rescue");
      console.error("Error loading rescues:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleShowQR = async () => {
    if (!selectedRescueId || !currentQuestionOrder) return;

    try {
      setLoading(true);

      // 1. Cập nhật questionOrder cho rescue
      await updateRescueQuestionOrder(selectedRescueId, currentQuestionOrder);

      // 3. Hiển thị QR
      setCurrentView("qr");
      onShowQR(selectedRescueId);
    } catch (err) {
      setError("Lỗi khi cập nhật rescue");
      console.error("Error updating rescue:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleShowChart = async () => {
    if (!selectedRescueId) return;
    // 2. Cập nhật status thành "used"
    await updateRescueStatus(selectedRescueId, "used");
    // 4. Reload lại danh sách rescue để cập nhật status mới
    await loadRescues();

    setCurrentView("chart");
    onShowChart(selectedRescueId);
  };

  const handleHideAll = () => {
    setCurrentView("none");
    onHideAll();
  };

  // Get status color for rescue
  const getStatusColor = (status: string) => {
    switch (status) {
      case "notUsed":
        return "bg-green-100 text-green-800";
      case "used":
        return "bg-blue-100 text-blue-800";
      case "passed":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "notUsed":
        return "Chưa sử dụng";
      case "used":
        return "Đã sử dụng";
      case "passed":
        return "Đã qua";
      default:
        return status;
    }
  };

  // Format câu hỏi hiện tại theo style QuestionHeader
  const getFormattedCurrentQuestion = () => {
    const displayNumber = currentQuestionNumber || currentQuestionOrder;
    const total = totalQuestions;

    if (displayNumber && total) {
      return `Câu ${displayNumber} / ${total}`;
    } else if (displayNumber) {
      return `Câu ${displayNumber}`;
    } else {
      return "Chưa có câu hỏi";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-lg">
            <QrCodeIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              Điều khiển trợ giúp khán giả
            </h3>
            <p className="text-sm text-gray-600">
              Hiển thị QR Code hoặc thống kê trên màn hình chiếu
            </p>
          </div>
        </div>

        {/* Current Status */}
        <div className="flex items-center space-x-2">
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              currentView === "qr"
                ? "bg-blue-100 text-blue-800"
                : currentView === "chart"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {currentView === "qr" && "Đang hiển thị QR"}
            {currentView === "chart" && "Đang hiển thị biểu đồ"}
            {currentView === "none" && "Không hiển thị"}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Rescue Selection */}
      {matchSlug && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Rescue Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Chọn cứu trợ
              </label>
              <div className="relative">
                <select
                  value={selectedRescueId || ""}
                  onChange={(e) =>
                    setSelectedRescueId(Number(e.target.value) || null)
                  }
                  disabled={loading}
                  className="w-full bg-white border shadow-sm border-gray-300 rounded-lg px-3 py-3.5 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-base"
                >
                  <option value="">-- Chọn cứu trợ --</option>
                  {rescues.map((rescue) => (
                    <option
                      key={rescue.id}
                      value={rescue.id}
                      disabled={
                        rescue.status === "used" || rescue.status === "passed"
                      }
                      className={
                        rescue.status === "used" || rescue.status === "passed"
                          ? "text-gray-400 bg-gray-100"
                          : "text-gray-900"
                      }
                    >
                      Cứu trợ {rescue.id} - {getStatusText(rescue.status)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Current Question - Updated Format */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Câu hỏi hiện tại
              </label>
              <div className="bg-white p-3 rounded-lg border border-gray-300 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg text-blue-600">
                    {getFormattedCurrentQuestion()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Rescue Info */}
          {selectedRescueId && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-600">
                  Trạng thái:
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    rescues.find((r) => r.id === selectedRescueId)?.status || ""
                  )}`}
                >
                  {getStatusText(
                    rescues.find((r) => r.id === selectedRescueId)?.status || ""
                  )}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Control Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Show QR Button */}
        <button
          onClick={handleShowQR}
          disabled={
            !selectedRescueId ||
            !matchSlug ||
            !currentQuestionOrder ||
            loading ||
            // Disable nếu rescue đã được sử dụng hoặc đã qua
            Boolean(
              selectedRescueId &&
                rescues.find((r) => r.id === selectedRescueId)?.status !==
                  "notUsed"
            )
          }
          className={`
            relative p-4 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 active:scale-95
            ${
              currentView === "qr"
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg ring-2 ring-blue-300"
                : selectedRescueId &&
                  matchSlug &&
                  currentQuestionOrder &&
                  !loading &&
                  rescues.find((r) => r.id === selectedRescueId)?.status ===
                    "notUsed"
                ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md hover:shadow-lg"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }
          `}
        >
          <div className="flex flex-col items-center space-y-2">
            <QrCodeIcon className="w-8 h-8" />
            <span>{loading ? "Đang xử lý..." : "Hiển thị QR Code"}</span>
            {currentView === "qr" && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            )}
          </div>
        </button>

        {/* Show Chart Button */}
        <button
          onClick={handleShowChart}
          disabled={!selectedRescueId || loading}
          className={`
            relative p-4 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 active:scale-95
            ${
              currentView === "chart"
                ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg ring-2 ring-green-300"
                : selectedRescueId && !loading
                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md hover:shadow-lg"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }
          `}
        >
          <div className="flex flex-col items-center space-y-2">
            <ChartBarIcon className="w-8 h-8" />
            <span>Hiển thị thống kê</span>
            {currentView === "chart" && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            )}
          </div>
        </button>

        {/* Hide All Button */}
        <button
          onClick={handleHideAll}
          disabled={loading}
          className={`
            p-4 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 active:scale-95
            ${
              currentView === "none"
                ? "bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg ring-2 ring-gray-300"
                : "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md hover:shadow-lg"
            }
          `}
        >
          <div className="flex flex-col items-center space-y-2">
            {currentView === "none" ? (
              <EyeSlashIcon className="w-8 h-8" />
            ) : (
              <EyeIcon className="w-8 h-8" />
            )}
            <span>Ẩn tất cả</span>
          </div>
        </button>
      </div>

      {/* Instructions */}
      {(!matchSlug ||
        !currentQuestionOrder ||
        !selectedRescueId ||
        (selectedRescueId &&
          rescues.find((r) => r.id === selectedRescueId)?.status !==
            "notUsed")) && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <div className="w-5 h-5 text-yellow-600 mt-0.5">⚠️</div>
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Cần thông tin để sử dụng:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                {!matchSlug && <li>Slug trận đấu để lấy danh sách cứu trợ</li>}
                {!currentQuestionOrder && <li>Thứ tự câu hỏi hiện tại</li>}
                {!selectedRescueId && <li>Chọn cứu trợ để hiển thị</li>}
                {selectedRescueId &&
                  rescues.find((r) => r.id === selectedRescueId)?.status !==
                    "notUsed" && (
                    <li className="text-red-600 font-medium">
                      ⚠️ Rescue đã được sử dụng hoặc đã qua - không thể hiển thị
                      QR
                    </li>
                  )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudienceRescueControl;
