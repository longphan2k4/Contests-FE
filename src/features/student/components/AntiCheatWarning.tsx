import React from "react";
import type { AntiCheatViolation } from "../hooks/useAntiCheat";

interface AntiCheatWarningProps {
  violations: AntiCheatViolation[];
  warningCount: number;
  maxViolations: number;
  onContinue: () => void;
  onTerminate: () => void;
  isVisible: boolean;
}

const violationMessages = {
  tab_switch: "Bạn đã chuyển tab hoặc minimize cửa sổ",
  escape_key: "Bạn đã nhấn phím ESC",
  minimize: "Cửa sổ đã mất focus",
  fullscreen_exit: "Bạn đã thoát khỏi chế độ toàn màn hình",
  copy_paste: "Bạn đã thử sao chép/dán nội dung",
  context_menu: "Bạn đã thử mở menu chuột phải",
  dev_tools: "Bạn đã thử mở Developer Tools",
};

const AntiCheatWarning: React.FC<AntiCheatWarningProps> = ({
  violations,
  warningCount,
  maxViolations,
  onContinue,
  onTerminate,
  isVisible,
}) => {
  if (!isVisible || violations.length === 0) return null;

  const latestViolation = violations[violations.length - 1];
  const remainingChances = maxViolations - warningCount;
  const isLastWarning = remainingChances <= 1;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center">
          {/* Icon cảnh báo */}
          <div
            className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              isLastWarning ? "bg-red-100" : "bg-yellow-100"
            }`}
          >
            <svg
              className={`w-8 h-8 ${
                isLastWarning ? "text-red-600" : "text-yellow-600"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          {/* Tiêu đề */}
          <h2
            className={`text-xl font-bold mb-4 ${
              isLastWarning ? "text-red-800" : "text-yellow-800"
            }`}
          >
            {isLastWarning ? "⚠️ CẢNH BÁO CUỐI CÙNG!" : "⚠️ VI PHẠM QUY ĐỊNH!"}
          </h2>

          {/* Thông báo vi phạm */}
          <div className="mb-6">
            <p className="text-gray-700 mb-2">
              {violationMessages[latestViolation.type]}
            </p>
            <p className="text-sm text-gray-500">
              Thời gian: {latestViolation.timestamp.toLocaleTimeString("vi-VN")}
            </p>
          </div>

          {/* Số lần vi phạm */}
          <div className="mb-6">
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                isLastWarning
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              Lần vi phạm: {warningCount}/{maxViolations}
            </div>

            {remainingChances > 0 ? (
              <p className="text-sm text-gray-600 mt-2">
                Còn lại <span className="font-bold">{remainingChances}</span> cơ
                hội
              </p>
            ) : (
              <p className="text-sm text-red-600 mt-2 font-bold">
                Bài thi sẽ bị kết thúc!
              </p>
            )}
          </div>

          {/* Quy định */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-800 mb-2">
              📋 Quy định bài thi:
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Không được chuyển tab hoặc minimize cửa sổ</li>
              <li>• Không được thoát khỏi chế độ toàn màn hình</li>
              <li>• Không được sao chép/dán nội dung</li>
              <li>• Không được mở menu chuột phải</li>
              <li>• Không được sử dụng Developer Tools</li>
            </ul>
          </div>

          {/* Nút hành động */}
          <div className="flex gap-3">
            {remainingChances > 0 && (
              <>
                <button
                  onClick={onContinue}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium"
                >
                  Tiếp tục thi
                </button>
                <button
                  onClick={onTerminate}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 font-medium"
                >
                  Kết thúc
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AntiCheatWarning;
