import React, { useState } from "react";
import {
  PlayIcon,
  PauseIcon,
  StopIcon,
  ForwardIcon,
} from "@heroicons/react/24/outline";
import { Chip } from "@mui/material";

// interface ControlsOnlineProps {
//   // Props sẽ được thêm sau khi có logic socket
// }

const ControlsOnline: React.FC = () => {
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [isExamPaused, setIsExamPaused] = useState(false);

  const handleStartExam = () => {
    setIsExamStarted(true);
    setIsExamPaused(false);
    console.log("Bắt đầu kỳ thi online");
  };

  const handlePauseExam = () => {
    setIsExamPaused(!isExamPaused);
    console.log("Tạm dừng/Tiếp tục kỳ thi");
  };

  const handleStopExam = () => {
    setIsExamStarted(false);
    setIsExamPaused(false);
    console.log("Kết thúc kỳ thi online");
  };

  const handleNextQuestion = () => {
    console.log("Chuyển sang câu hỏi tiếp theo");
  };

  return (
    <div className="space-y-6">
      {/* Điều khiển chính */}
      <div className="bg-white p-6 rounded-xl w-full border-l-4 border-l-blue-500">
        {/* Trạng thái thi */}
        <div className="mb-4 rounded-lg">
          <div className="flex items-center space-x-3 cursor-help">
            <Chip
              label={
                !isExamStarted
                  ? "Chưa bắt đầu"
                  : isExamPaused
                  ? "Tạm dừng"
                  : "Đang diễn ra"
              }
              color={
                !isExamStarted
                  ? "default"
                  : isExamPaused
                  ? "warning"
                  : "success"
              }
              variant="filled"
              size="small"
              className="font-semibold"
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <button
            onClick={handleStartExam}
            disabled={isExamStarted}
            className={`px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors ${
              isExamStarted
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            <PlayIcon className="h-5 w-5" />
            <span>Bắt Đầu Thi</span>
          </button>

          <button
            onClick={handlePauseExam}
            disabled={!isExamStarted}
            className={`px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors ${
              !isExamStarted
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : isExamPaused
                ? "bg-yellow-600 text-white hover:bg-yellow-700"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            <PauseIcon className="h-5 w-5" />
            <span>{isExamPaused ? "Tiếp Tục" : "Tạm Dừng"}</span>
          </button>

          <button
            onClick={handleNextQuestion}
            disabled={!isExamStarted || isExamPaused}
            className={`px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors ${
              !isExamStarted || isExamPaused
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            <ForwardIcon className="h-5 w-5" />
            <span>Câu Tiếp Theo</span>
          </button>

          <button
            onClick={handleStopExam}
            disabled={!isExamStarted}
            className={`px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors ${
              !isExamStarted
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            <StopIcon className="h-5 w-5" />
            <span>Kết Thúc Thi</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControlsOnline;
