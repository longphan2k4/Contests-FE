import React, { useState } from "react";
import { useAntiCheat } from "../hooks/useAntiCheat";
import AntiCheatWarning from "./AntiCheatWarning";

const AntiCheatDemo: React.FC = () => {
  const [showWarning, setShowWarning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString("vi-VN");
    setLogs((prev) => [`[${timestamp}] ${message}`, ...prev].slice(0, 20));
  };

  const handleViolation = () => {
    setShowWarning(true);
    addLog("Vi phạm được phát hiện - hiển thị cảnh báo");
  };

  const handleTerminate = () => {
    addLog("Bài thi đã bị kết thúc do vi phạm quá nhiều lần!");
    alert("Demo: Bài thi đã bị kết thúc!");
  };

  const {
    violations,
    warningCount,
    isFullscreen,
    startMonitoring,
    stopMonitoring,
    resetViolations, // 🔥 NEW: Thêm resetViolations
    enterFullscreen,
    exitFullscreen,
    maxViolations,
    isMonitoring,
  } = useAntiCheat(
    {
      enableFullscreen: true,
      enableTabSwitchDetection: true,
      enableCopyPasteBlocking: true,
      enableContextMenuBlocking: true,
      enableDevToolsBlocking: true,
      maxViolations: 3,
      warningBeforeTermination: true,
    },
    handleViolation,
    handleTerminate
  );

  const handleStartDemo = () => {
    startMonitoring();
    addLog("Bắt đầu giám sát chống gian lận");
  };

  const handleStopDemo = () => {
    stopMonitoring();
    addLog("Dừng giám sát chống gian lận");
  };

  const handleResetViolations = () => {
    resetViolations();
    addLog("Đã reset số lần vi phạm về 0");
  };

  const handleContinueAfterWarning = () => {
    setShowWarning(false);
    addLog("Thí sinh chọn tiếp tục sau cảnh báo");
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          🛡️ Demo Tính năng Chống Gian lận
        </h1>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div
            className={`p-4 rounded-lg ${
              isMonitoring ? "bg-green-100" : "bg-gray-100"
            }`}
          >
            <h3 className="font-semibold text-sm text-gray-700">Trạng thái</h3>
            <p
              className={`font-bold ${
                isMonitoring ? "text-green-600" : "text-gray-500"
              }`}
            >
              {isMonitoring ? "🟢 Đang giám sát" : "🔴 Không giám sát"}
            </p>
          </div>

          <div
            className={`p-4 rounded-lg ${
              isFullscreen ? "bg-blue-100" : "bg-red-100"
            }`}
          >
            <h3 className="font-semibold text-sm text-gray-700">Fullscreen</h3>
            <p
              className={`font-bold ${
                isFullscreen ? "text-blue-600" : "text-red-600"
              }`}
            >
              {isFullscreen ? "🔒 Bật" : "⚠️ Tắt"}
            </p>
          </div>

          <div
            className={`p-4 rounded-lg ${
              violations.length === 0 ? "bg-green-100" : "bg-yellow-100"
            }`}
          >
            <h3 className="font-semibold text-sm text-gray-700">Vi phạm</h3>
            <p
              className={`font-bold ${
                violations.length === 0 ? "text-green-600" : "text-yellow-600"
              }`}
            >
              {warningCount}/{maxViolations}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-purple-100">
            <h3 className="font-semibold text-sm text-gray-700">Tổng events</h3>
            <p className="font-bold text-purple-600">{violations.length}</p>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={handleStartDemo}
            disabled={isMonitoring}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            Bắt đầu Demo
          </button>

          <button
            onClick={handleStopDemo}
            disabled={!isMonitoring}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
          >
            Dừng Demo
          </button>

          <button
            onClick={handleResetViolations}
            disabled={violations.length === 0}
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:bg-gray-400"
          >
            Reset Violations
          </button>

          <button
            onClick={enterFullscreen}
            disabled={isFullscreen}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            Vào Fullscreen
          </button>

          <button
            onClick={exitFullscreen}
            disabled={!isFullscreen}
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:bg-gray-400"
          >
            Thoát Fullscreen
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">
            📋 Hướng dẫn test:
          </h3>

          {/* Desktop Instructions */}
          <div className="mb-4">
            <h4 className="font-medium text-blue-700 mb-1">🖥️ Trên Desktop:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>
                • <strong>Nhấn ESC:</strong> Sẽ phát hiện vi phạm phím ESC
              </li>
              <li>
                • <strong>Chuyển tab (Alt+Tab hoặc Ctrl+Tab):</strong> Phát hiện
                chuyển tab
              </li>
              <li>
                • <strong>Minimize cửa sổ:</strong> Phát hiện mất focus
              </li>
              <li>
                • <strong>Chuột phải:</strong> Bị chặn và ghi nhận vi phạm
              </li>
              <li>
                • <strong>Ctrl+C/V/X:</strong> Bị chặn copy/paste
              </li>
              <li>
                • <strong>F12 hoặc Ctrl+Shift+I:</strong> Bị chặn developer
                tools
              </li>
              <li>
                • <strong>Thoát fullscreen:</strong> Phát hiện thoát fullscreen
              </li>
            </ul>
          </div>

          {/* Mobile Instructions */}
          <div>
            <h4 className="font-medium text-blue-700 mb-1">📱 Trên Mobile:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>
                • <strong>Nhấn nút Home:</strong> Phát hiện chuyển app
              </li>
              <li>
                • <strong>Kéo notification bar:</strong> Phát hiện vi phạm
              </li>
              <li>
                • <strong>Chuyển app (Recent apps):</strong> Phát hiện chuyển
                ứng dụng
              </li>
              <li>
                • <strong>Long press text:</strong> Bị chặn context menu
              </li>
              <li>
                • <strong>Xoay màn hình:</strong> Phát hiện orientation change
              </li>
              <li>
                • <strong>Multi-touch gesture:</strong> Phát hiện touch nghi ngờ
              </li>
              <li>
                • <strong>Thử thoát browser:</strong> Hiện cảnh báo beforeunload
              </li>
            </ul>
          </div>
        </div>

        {/* Violation History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Violations List */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              📊 Danh sách Vi phạm ({violations.length})
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
              {violations.length === 0 ? (
                <p className="text-gray-500 text-center">Chưa có vi phạm nào</p>
              ) : (
                <div className="space-y-2">
                  {violations.map((violation, index) => (
                    <div
                      key={index}
                      className="bg-white p-3 rounded border-l-4 border-red-400"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-red-700">
                            {violation.type.replace("_", " ").toUpperCase()}
                          </p>
                          <p className="text-sm text-gray-600">
                            {violation.description}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500">
                          {violation.timestamp.toLocaleTimeString("vi-VN")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Activity Logs */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              📝 Log Hoạt động
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-gray-500 text-center">
                  Chưa có hoạt động nào
                </p>
              ) : (
                <div className="space-y-1">
                  {logs.map((log, index) => (
                    <div
                      key={index}
                      className="text-sm text-gray-700 font-mono"
                    >
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Test Area */}
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            🧪 Vùng Test
          </h3>
          <p className="text-gray-600 mb-2">
            Thử nghiệm các hành động sau để test tính năng chống gian lận:
          </p>
          <div className="bg-white p-4 rounded">
            <p>
              Đây là nội dung có thể copy/paste để test. Hãy thử select và copy
              nội dung này khi đang bật chế độ chống gian lận.
            </p>
            <input
              type="text"
              placeholder="Thử paste nội dung vào đây..."
              className="w-full mt-2 p-2 border rounded"
            />
          </div>
        </div>
      </div>

      {/* Anti-cheat warning modal */}
      <AntiCheatWarning
        violations={violations}
        warningCount={warningCount}
        maxViolations={maxViolations}
        onContinue={handleContinueAfterWarning}
        onTerminate={handleTerminate}
        isVisible={showWarning}
      />
    </>
  );
};

export default AntiCheatDemo;
