import React from "react";
import { type Question } from "../type/control.type";

interface QuestionDetailsProp {
  questions: Question[];
  currentQuestion?: number;
}

const QuestionDetails: React.FC<QuestionDetailsProp> = ({
  questions,
  currentQuestion,
}) => {
  // Khai báo kiểu cho difficultyMap
  const difficultyMap: Record<
    "Alpha" | "Beta" | "Rc" | "Gold",
    { color: string; label: string }
  > = {
    Alpha: { color: "bg-blue-700", label: "α" },
    Beta: { color: "bg-purple-600", label: "β" },
    Rc: { color: "bg-red-600", label: "RC" },
    Gold: { color: "bg-yellow-600", label: "Au" },
  };

  const questionTypeMap: Record<
    "multiple_choice" | "essay" | "image" | "audio" | "video",
    { color: string; label: string }
  > = {
    multiple_choice: { color: "bg-green-600", label: "Trắc nghiệm" },
    essay: { color: "bg-indigo-600", label: "Tự luận" },
    image: { color: "bg-pink-600", label: "Hình ảnh" },
    audio: { color: "bg-orange-600", label: "Âm thanh" },
    video: { color: "bg-teal-600", label: "Video" },
  };

  return (
    <div className="w-1/5 bg-gradient-to-b from-blue-600 to-blue-800 text-white p-4 shadow-lg flex flex-col h-screen">
      <h2 className="text-2xl font-bold mb-2 tracking-tight text-center bg-blue-900 rounded-lg py-1">
        CÂU HỎI
      </h2>

      <div className="flex-grow overflow-hidden">
        <ul className="flex flex-col h-full gap-[0.35rem]">
          {questions.map(q => {
            const isCurrent = q.questionOrder === currentQuestion;
            const difficulty = difficultyMap[
              q.difficulty as keyof typeof difficultyMap
            ] || {
              color: "bg-gray-600",
              label: "?",
            };

            const questionType = questionTypeMap[
              q.questionType as keyof typeof questionTypeMap
            ] || {
              color: "bg-gray-600",
              label: "?",
            };

            return (
              <li
                key={q.id}
                className={`rounded-lg cursor-pointer transition-all duration-200 shadow-md flex items-center p-1 relative ${
                  isCurrent
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 border-2 border-red-500"
                    : "bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 border border-blue-300"
                }`}
                style={{
                  flex: "1 1 0",
                  minHeight: 0,
                  maxHeight: "calc((100vh - 100px) / 13)",
                }}
              >
                {isCurrent && (
                  <>
                    <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 text-red-500 text-2xl animate-pulse">
                      ▶
                    </div>
                    <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 text-red-500 text-2xl animate-pulse">
                      ◀
                    </div>
                  </>
                )}

                <div className="flex justify-between w-full items-center px-2">
                  <span
                    className={`text-3xl sm:text-4xl md:text-5xl font-bold ${
                      isCurrent ? "text-white" : "text-blue-100"
                    }`}
                  >
                    {q.questionOrder}
                  </span>

                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-sm md:text-lg font-semibold whitespace-nowrap px-2 py-0.5 ${difficulty.color} rounded text-white`}
                    >
                      {difficulty.label}
                    </span>
                    <span
                      className={`text-sm sm:text-base md:text-lg font-medium ${questionType.color} px-2 py-0.5 rounded`}
                    >
                      {questionType.label}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default QuestionDetails;
