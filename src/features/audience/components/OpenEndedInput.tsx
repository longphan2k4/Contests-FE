import React, { useState, useEffect } from "react";
import { BackspaceIcon } from "@heroicons/react/24/outline";
import { useToast } from "@contexts/toastContext";
import { useSocket } from "@contexts/SocketContext";
import { useSubmitSupportAnswer } from "../hooks/useRescue";
import { set } from "zod";

// Shuffle utility function
const shuffle = (array: string[]): string[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

interface Props {
  correctAnswer: string;
  questionId?: number;
  onAnswerChange?: (answer: string) => void;
  rescueId: number;
}

const OpenEndedInput: React.FC<Props> = ({
  correctAnswer,
  onAnswerChange,
  questionId,
  rescueId,
}) => {
  const [answerSlots, setAnswerSlots] = useState<(string | null)[]>(
    Array(correctAnswer.length).fill(null)
  );
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { socket } = useSocket();
  const { mutateAsync: submitAnswer } = useSubmitSupportAnswer();

  // Notify parent about answer changes
  const notifyAnswerChange = (slots: (string | null)[]) => {
    const currentAnswer = slots.join("");
    if (onAnswerChange) {
      onAnswerChange(currentAnswer);
    }
  };

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

  const { showToast } = useToast();
  useEffect(() => {
    const allChars = correctAnswer.split("");
    const lettersOnly = allChars.filter(char => char !== " ");

    setAvailableLetters(shuffle(lettersOnly));
    const initialSlots = allChars.map(char => (char === " " ? " " : null));
    setAnswerSlots(initialSlots);
    setIsSubmitted(false);
    notifyAnswerChange(initialSlots);
  }, [correctAnswer]);

  // Thêm chữ cái vào ô trống
  const addToAnswer = (letter: string) => {
    if (isSubmitted) return;

    const newSlots = [...answerSlots];

    for (let i = 0; i < newSlots.length; i++) {
      if (newSlots[i] !== " " && newSlots[i] === null) {
        newSlots[i] = letter;
        setAnswerSlots(newSlots);

        // Cập nhật available letters
        const newAvailable = [...availableLetters];
        const letterIndex = newAvailable.indexOf(letter);
        if (letterIndex > -1) {
          newAvailable.splice(letterIndex, 1);
          setAvailableLetters(newAvailable);
        }

        notifyAnswerChange(newSlots);
        break;
      }
    }
  };

  // Xóa chữ cái khỏi ô trống
  const removeFromAnswer = (index: number) => {
    // Không cho phép xóa dấu cách
    if (answerSlots[index] !== null && answerSlots[index] !== " ") {
      const letter = answerSlots[index];
      const newSlots = [...answerSlots];
      newSlots[index] = null;
      setAnswerSlots(newSlots);
      setAvailableLetters(prev => [...prev, letter as string]);
      notifyAnswerChange(newSlots);
    }
  };

  // Clear all slots
  const clearAll = () => {
    // Chỉ lấy các ký tự đã sử dụng (không phải dấu cách)
    const usedLetters = answerSlots.filter(
      slot => slot !== null && slot !== " "
    ) as string[];
    // Giữ lại dấu cách, chỉ xóa các ký tự khác
    const clearedSlots = answerSlots.map(slot => (slot === " " ? " " : null));
    setAnswerSlots(clearedSlots);
    setAvailableLetters(prev => [...prev, ...usedLetters]);
    notifyAnswerChange(clearedSlots);
  };

  useEffect(() => {
    const answer = localStorage.getItem("answer");
    if (answer) setIsSubmitted(true);
  }, [rescueId, questionId]);

  // Gửi đáp án
  const handleSubmit = () => {
    const answer = answerSlots.join("");
    setIsSubmitted(true);
    localStorage.setItem("answer", "true");
    submitAnswer(
      { rescueId: rescueId || 0, supportAnswers: answer },
      {
        onSuccess: () => {
          showToast("Cứu trợ thành công", "success");
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

  const isComplete = answerSlots.every(slot => slot === " " || slot !== null);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl shadow-xl border border-gray-100">
      {/* Answer Slots */}
      <div className="mb-8">
        <div className="flex items-center justify-center mb-4">
          <span className="text-sm font-medium text-gray-600 mr-4">
            Đáp án của bạn:
          </span>
          <button
            onClick={clearAll}
            disabled={
              isSubmitted ||
              answerSlots.every(slot => slot === null || slot === " ")
            }
            className="flex items-center space-x-1 px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <BackspaceIcon className="w-3 h-3" />
            <span>Xóa tất cả</span>
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-4 items-center">
          {/* Tách thành các từ để hiển thị */}
          {(() => {
            const words = correctAnswer.split(" ");
            let currentIndex = 0;

            return words.map((word, wordIndex) => {
              const wordSlots = [];

              // Lấy các slot cho từ hiện tại
              for (let i = 0; i < word.length; i++) {
                wordSlots.push(answerSlots[currentIndex + i]);
              }

              const wordStartIndex = currentIndex;
              currentIndex += word.length + 1; // +1 cho dấu cách

              return (
                <div key={wordIndex} className="flex gap-2 items-center">
                  {wordSlots.map((letter, letterIndex) => {
                    const actualIndex = wordStartIndex + letterIndex;
                    // Tính số thứ tự cho slot
                    let slotNumber = 0;
                    for (let i = 0; i <= actualIndex; i++) {
                      if (answerSlots[i] !== " ") {
                        slotNumber++;
                      }
                    }

                    return (
                      <div
                        key={actualIndex}
                        onClick={() =>
                          !isSubmitted && removeFromAnswer(actualIndex)
                        }
                        className={`
                          relative w-12 h-12 sm:w-14 sm:h-14 border-2 rounded-xl transition-all duration-300 transform hover:scale-105
                          flex items-center justify-center text-lg font-bold cursor-pointer
                          ${
                            letter
                              ? "border-purple-400 bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-700 shadow-md hover:shadow-lg"
                              : "border-dashed border-gray-300 bg-white hover:border-purple-300 hover:bg-purple-50"
                          }
                        `}
                      >
                        {letter || (
                          <div className="w-6 h-0.5 bg-gray-400 rounded-full"></div>
                        )}

                        {/* Slot number */}
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-gray-500 text-white text-xs rounded-full flex items-center justify-center">
                          {slotNumber}
                        </div>

                        {/* Remove indicator */}
                        {letter && !isSubmitted && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            ×
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {/* Hiển thị dấu cách sau mỗi từ (trừ từ cuối) */}
                  {wordIndex < words.length - 1 && (
                    <div className="w-4 flex items-center justify-center">
                      <span className="text-gray-400 font-normal text-sm">
                        _
                      </span>
                    </div>
                  )}
                </div>
              );
            });
          })()}
        </div>
      </div>

      {/* Available Letters */}
      <div className="mb-8">
        <div className="text-center mb-4">
          <span className="text-sm font-medium text-gray-600">
            Chữ cái khả dụng:
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {availableLetters.map((letter, index) => (
            <button
              key={`${letter}-${index}`}
              onClick={() => !isSubmitted && addToAnswer(letter)}
              disabled={isSubmitted}
              className={`
                w-12 h-12 sm:w-14 sm:h-14 rounded-xl font-bold text-lg transition-all duration-200 transform
                ${
                  !isSubmitted
                    ? "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 border-2 border-gray-300 hover:border-purple-400 hover:bg-gradient-to-br hover:from-purple-100 hover:to-indigo-100 hover:text-purple-700 hover:scale-110 hover:shadow-md active:scale-95"
                    : "bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed"
                }
              `}
            >
              {letter}
            </button>
          ))}
        </div>

        {availableLetters.length === 0 && !isSubmitted && (
          <div className="text-center text-gray-500 text-sm mt-4">
            🎉 Tất cả chữ cái đã được sử dụng!
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={handleSubmit}
          disabled={!isComplete || isSubmitted}
          className={`
            relative px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-300 transform
            ${
              isComplete && !isSubmitted
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-105 hover:from-purple-700 hover:to-indigo-700 active:scale-95"
                : isSubmitted
                ? "bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed"
                : "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-500 cursor-not-allowed"
            }
          `}
        >
          Cứu trợ
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Tiến độ:</span>
          <span className="text-sm font-medium text-gray-700">
            {answerSlots.filter(slot => slot !== null && slot !== " ").length}/
            {correctAnswer.replace(/ /g, "").length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
            style={{
              width: `${
                (answerSlots.filter(slot => slot !== null && slot !== " ")
                  .length /
                  correctAnswer.replace(/ /g, "").length) *
                100
              }%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default OpenEndedInput;
