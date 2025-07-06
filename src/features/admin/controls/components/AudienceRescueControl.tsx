import React, { useEffect, useState } from "react";
import { QrCodeIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import { useParams } from "react-router-dom";

import { type ControlKey } from "../../../match/types/control.type";
import { useSocket } from "@/contexts/SocketContext";
import { useToast } from "@contexts/toastContext";
import type { ListRescueLifelineUsed } from "../type/control.type";

interface AudienceRescueControlProps {
  ListRescueLifelineUsed: ListRescueLifelineUsed[] | [];
  currentQuestionOrder?: number;
  totalQuestions?: number;
  controlKey?: ControlKey | null;
  matchId?: number | null;
}

const AudienceRescueControl: React.FC<AudienceRescueControlProps> = ({
  currentQuestionOrder,
  totalQuestions,
  controlKey,
  ListRescueLifelineUsed,
  matchId,
}) => {
  const [selectedRescueId, setSelectedRescueId] = useState<number | null>(null);
  const { match } = useParams<{ match: string }>();
  const [timerLeft, setTimerLeft] = useState<number | null>(0);
  const [timer, setTimer] = useState<number | null>(null);

  const { socket } = useSocket();
  const { showToast } = useToast();

  // Get status color for rescue
  const getStatusColor = (
    status: "notUsed" | "used" | "passed" | "notEligible"
  ) => {
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

  const getStatusText = (
    status: "notUsed" | "used" | "passed" | "notEligible"
  ) => {
    switch (status) {
      case "notUsed":
        return "Chưa sử dụng";
      case "used":
        return "Đang sử dụng";
      case "passed":
        return "Đã sử dụng";
      case "notEligible":
        return "Không đủ điều kiện";
      default:
        return status;
    }
  };

  // Format câu hỏi hiện tại theo style QuestionHeader
  const getFormattedCurrentQuestion = () => {
    const displayNumber = currentQuestionOrder;
    const total = totalQuestions;

    if (displayNumber && total) {
      return `Câu ${displayNumber} / ${total}`;
    } else if (displayNumber) {
      return `Câu ${displayNumber}`;
    } else {
      return "Chưa có câu hỏi";
    }
  };

  const handleShowQR = () => {
    if (!selectedRescueId) {
      showToast("Vui lòng chọn cứu trợ để hiển thị QR Code", "error");
      return;
    }
    if (!socket) {
      showToast("Hiển thị QR Code thất bại", "error");
      return;
    }
    const data: any = {
      match: match,
      rescueId: selectedRescueId,
      questionOrder: currentQuestionOrder,
      value: String(selectedRescueId),
      controlKey: "qrcode",
    };
    socket.emit("showQrRescue", data, (err: any, response: any) => {
      if (err) {
        showToast(err.message, "error");
      }
      if (response) {
        showToast("Đã hiển thị QR Code", "success");
      }
    });
  };
  const handleShowChart = () => {
    if (!selectedRescueId) {
      showToast("Vui lòng chọn cứu trợ để hiển thị thống kê", "error");
      return;
    }
    if (!socket) {
      showToast("Hiển thị thống kê thất bại", "error");
      return;
    }
    const data: any = {
      match: match,
      rescueId: selectedRescueId,
      value: String(selectedRescueId),
      controlKey: "chart",
    };
    socket.emit("showQrChart", data, (err: any, response: any) => {
      if (err) {
        showToast(err.message, "error");
      }
      if (response) {
        showToast("Đã hiển thị thống kê", "success");
      }
    });
  };

  const handleTimerLeft = () => {
    if (!selectedRescueId) {
      showToast("Vui lòng chọn cứu trợ để bắt đầu", "error");
      return;
    }
    if (!socket) {
      showToast("Bắt đầu thất bại", "error");
      return;
    }

    const data: any = {
      match: match,
      timerLeft: timer || 0,
      rescuedId: selectedRescueId,
      matchId: matchId,
    };
    socket.emit("timerLeft:Rescue", data, (err: any, response: any) => {
      if (err) {
        showToast(err.message, "error");
      }
      if (response) {
        showToast("Đã bắt đầu thời gian", "success");
      }
    });
  };

  useEffect(() => {
    if (socket) {
      const handleTimerLeft = (data: any) => {
        if (data.match === match) {
          setTimerLeft(data.timerLeft);
        }
      };
      socket.on("timerLeft:Rescue", handleTimerLeft);
    }
    return () => {
      if (socket) {
        socket.off("timerLeft:Rescue");
      }
    };
  }, [socket, match]);

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
        <div className="flex items-center gap-4 p-2 bg-white rounded-md shadow-sm border border-gray-200">
          <div className="text-base text-gray-700 font-semibold">
            ⏱ {timerLeft}s
          </div>
          <div className="text-base text-gray-700 font-semibold">
            📌 {getFormattedCurrentQuestion()}
          </div>
          <div
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300
      ${
        controlKey === "qrcode"
          ? "bg-blue-100 text-blue-700"
          : controlKey === "chart"
          ? "bg-green-100 text-green-700"
          : "bg-gray-100 text-gray-600"
      }`}
          >
            {controlKey === "qrcode"
              ? "🧾 Hiển thị QR Code"
              : controlKey === "chart"
              ? "📊 Hiển thị thống kê"
              : "🚫 Ẩn tất cả"}
          </div>
        </div>
      </div>

      {/* Rescue Selection */}
      {match && (
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
                  onChange={e =>
                    setSelectedRescueId(Number(e.target.value) || null)
                  }
                  className="w-full bg-white border shadow-sm border-gray-300 rounded-lg px-3 py-3.5 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-base"
                >
                  <option value="">-- Chọn cứu trợ --</option>
                  {ListRescueLifelineUsed?.map(rescue => (
                    <option
                      key={rescue.id}
                      value={rescue.id}
                      className={
                        rescue.status === "used" || rescue.status === "passed"
                          ? "text-gray-400 bg-gray-100"
                          : "text-gray-900"
                      }
                    >
                      Cứu trợ {rescue.id} -{" "}
                      {getStatusText(rescue?.status || "notUsed")}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="w-full ">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ⏱ Nhập thời gian còn lại (giây)
              </label>
              <div className="relative">
                <input
                  type="number"
                  className="w-full px-4  py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-blue-600 font-semibold"
                  placeholder="Ví dụ: 30"
                  onChange={e => setTimer(Number(e.target.value))}
                />
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
                    ListRescueLifelineUsed?.find(r => r.id === selectedRescueId)
                      ?.status || "notUsed"
                  )}`}
                >
                  {getStatusText(
                    ListRescueLifelineUsed?.find(r => r.id === selectedRescueId)
                      ?.status || "notUsed"
                  )}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Control Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={handleShowQR}
          disabled={
            !selectedRescueId ||
            !match ||
            !currentQuestionOrder ||
            ListRescueLifelineUsed?.find(r => r.id === selectedRescueId)
              ?.status === "passed"
          }
          className={`
    relative p-4 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 active:scale-95
    ${
      controlKey === "qrcode"
        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg ring-2 ring-blue-300"
        : selectedRescueId &&
          match &&
          currentQuestionOrder &&
          ListRescueLifelineUsed?.find(r => r.id === selectedRescueId)
            ?.status === "notUsed"
        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md hover:shadow-lg"
        : "bg-gray-300 text-gray-500 cursor-not-allowed"
    }
  `}
        >
          <div className="flex flex-col items-center space-y-2">
            <QrCodeIcon className="w-8 h-8" />

            <span>Hiển thị QR</span>
            {controlKey === "qrcode" && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            )}
          </div>
        </button>

        <button
          onClick={handleShowChart}
          disabled={!selectedRescueId}
          className={`
            relative p-4 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 active:scale-95
            ${
              controlKey === "chart"
                ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg ring-2 ring-green-300"
                : selectedRescueId
                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md hover:shadow-lg"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }
          `}
        >
          <div className="flex flex-col items-center space-y-2">
            <ChartBarIcon className="w-8 h-8" />
            <span>Hiển thị thống kê</span>
            {controlKey === "chart" && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            )}
          </div>
        </button>

        <button
          onClick={handleTimerLeft}
          disabled={controlKey !== "qrcode" ? true : false}
          className={`
    relative p-4 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 active:scale-95
    ${
      controlKey === "qrcode"
        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg ring-2 ring-blue-300"
        : "bg-gray-300 text-gray-500 cursor-not-allowed"
    }
  `}
        >
          <div className="flex flex-col items-center space-y-2">
            <QrCodeIcon className="w-8 h-8" />

            <span>Bắt Đầu</span>
            {controlKey === "qrcode" && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            )}
          </div>
        </button>
      </div>

      {/* Instructions */}
      {(!match ||
        !currentQuestionOrder ||
        !selectedRescueId ||
        (selectedRescueId &&
          ListRescueLifelineUsed?.find(r => r.id === selectedRescueId)
            ?.status !== "notUsed")) && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <div className="w-5 h-5 text-yellow-600 mt-0.5">⚠️</div>
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Cần thông tin để sử dụng:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                {!match && <li>Slug trận đấu để lấy danh sách cứu trợ</li>}
                {!currentQuestionOrder && <li>Thứ tự câu hỏi hiện tại</li>}
                {!selectedRescueId && <li>Chọn cứu trợ để hiển thị</li>}
                {selectedRescueId &&
                  ListRescueLifelineUsed?.find(r => r.id === selectedRescueId)
                    ?.status !== "notUsed" && (
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
