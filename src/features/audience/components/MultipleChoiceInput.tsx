import React, { useEffect, useState } from "react";
import { useSocket } from "@contexts/SocketContext";
import { useSubmitSupportAnswer } from "../hooks/useRescue";
import { useToast } from "@/contexts/toastContext";

interface Props {
  questionId: number | null; // dùng để lưu trữ theo từng câu
  options: string[];
  rescueId?: number; // Thêm rescueId nếu cần thiết
}

const MultipleChoiceInput: React.FC<Props> = ({
  questionId,
  options,
  rescueId,
}) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { socket } = useSocket();
  const { showToast } = useToast();

  useEffect(() => {
    if (!socket) return;

    const handletimerStart = (_data: any) => {
      localStorage.removeItem("answer");
      setIsSubmitted(false);
    };
    socket.on("timerStart:Rescue", handletimerStart);

    return () => {
      if (socket) {
        socket.off("timerStart:Rescue", handletimerStart);
      }
    };
  }, [socket, questionId]);

  // --- Helper functions
  const getLetter = (index: number) => String.fromCharCode(65 + index); // A, B, C...

  useEffect(() => {
    const anwser = localStorage.getItem("answer");
    if (anwser) setIsSubmitted(true);
  }, [questionId]);

  // --- Handle chọn đáp án
  const handleSelect = (index: number) => {
    if (isSubmitted) return;
    const letter = getLetter(index);
    setSelected(letter);
  };

  const { mutateAsync: submitAnswer } = useSubmitSupportAnswer();
  const handleSubmit = () => {
    if (!selected) return;
    setIsSubmitted(true);
    localStorage.setItem("answer", "true");
    submitAnswer(
      { rescueId: rescueId || 0, supportAnswers: selected },
      {
        onSuccess: () => {
          showToast("Cứu trợ thành công", "success");
          setSelected(null);
        },
        onError: (error: any) => {
          showToast(
            error?.response?.data?.message || "Lỗi khi gửi cứu trợ",
            "error"
          );
        },
      }
    );
  };

  const getOptionClass = (letter: string) => {
    const baseClass =
      "group relative w-full p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg";

    if (selected === letter) {
      return `${baseClass} border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md ring-2 ring-blue-200`;
    }
    return `${baseClass} border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50`;
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl shadow-xl border border-gray-100">
      <div className="space-y-4 mb-8">
        {options.map((option, index) => {
          const letter = getLetter(index);
          return (
            <div
              key={index}
              className={getOptionClass(letter)}
              onClick={() => handleSelect(index)}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-colors duration-300 ${
                    selected === letter
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600"
                  }`}
                >
                  {letter}
                </div>
                <span
                  className={`text-base font-medium ${
                    selected === letter ? "text-blue-700" : "text-gray-700"
                  }`}
                >
                  {option}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col items-center space-y-3">
        <button
          onClick={handleSubmit}
          disabled={selected === null || isSubmitted}
          className={`relative px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-300 transform ${
            selected && !isSubmitted
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              : "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-500 cursor-not-allowed"
          }`}
        >
          Cứu trợ
        </button>
      </div>
    </div>
  );
};

export default MultipleChoiceInput;
