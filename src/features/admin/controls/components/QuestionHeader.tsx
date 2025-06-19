import React from "react";

interface QuestionHeaderProps {
  questionOrder?: number;
  totalQuestions?: number;
  timeRemaining?: number;
  totalTime?: number;
  matchNumber?: string; // Optional: dùng cho hiển thị số trận đấu
}

const QuestionHeader: React.FC<QuestionHeaderProps> = ({
  questionOrder,
  totalQuestions,
  timeRemaining,
  totalTime,
  matchNumber,
}) => {
  const safeTimeRemaining =
    typeof timeRemaining === "number" ? timeRemaining : 0;
  const safeTotalTime =
    typeof totalTime === "number" && totalTime > 0 ? totalTime : 1;
  const progress = (safeTimeRemaining / safeTotalTime) * 100;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
          Trận {matchNumber}
        </h1>
        <div className="text-lg text-gray-600">
          <span className="font-medium">
            Câu {questionOrder ?? "-"} / {totalQuestions ?? "-"}
          </span>{" "}
          |{" "}
          <span className="text-red-500 font-semibold">
            Thời gian: {safeTimeRemaining}s
          </span>
          <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-red-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionHeader;
