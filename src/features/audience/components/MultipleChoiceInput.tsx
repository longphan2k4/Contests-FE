import React, { useState, useEffect } from "react";

interface Props {
  options: string[];
  correctAnswer: string;
  selectedAnswer?: string;
  onAnswerSelect?: (answer: string) => void;
  onSubmit: (isCorrect: boolean) => void;
}

const MultipleChoiceInput: React.FC<Props> = ({
  options,
  correctAnswer,
  selectedAnswer,
  onAnswerSelect,
  onSubmit,
}) => {
  const [selected, setSelected] = useState<string | null>(
    selectedAnswer || null
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Sync with external selectedAnswer
  useEffect(() => {
    setSelected(selectedAnswer || null);
  }, [selectedAnswer]);

  const handleSelect = (option: string) => {
    if (isSubmitted) return;

    setSelected(option);
    if (onAnswerSelect) {
      onAnswerSelect(option);
    }
  };

  const handleSubmit = () => {
    if (!selected) return;

    const isCorrect = selected === correctAnswer;
    setIsSubmitted(true);

    setTimeout(() => {
      onSubmit(isCorrect);
    }, 500);
  };

  const getOptionClass = (option: string) => {
    const baseClass =
      "group relative w-full p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg";

    if (selected === option) {
      return `${baseClass} border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md ring-2 ring-blue-200`;
    }
    return `${baseClass} border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50`;
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl shadow-xl border border-gray-100">
      {/* Options */}
      <div className="space-y-4 mb-8">
        {options.map((option, index) => (
          <div
            key={index}
            className={getOptionClass(option)}
            onClick={() => handleSelect(option)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Option Letter */}
                <div
                  className={`
                  flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-colors duration-300
                  ${
                    selected === option
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600"
                  }
                `}
                >
                  {String.fromCharCode(65 + index)}
                </div>

                {/* Option Text */}
                <span
                  className={`
                  text-base font-medium transition-colors duration-300
                  ${selected === option ? "text-blue-700" : "text-gray-700"}
                `}
                >
                  {option}
                </span>
              </div>
            </div>

            {/* Hover effect indicator */}
            <div
              className={`
                absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
                ${
                  selected === option
                    ? "bg-gradient-to-r from-blue-500/5 to-indigo-500/5"
                    : "bg-gradient-to-r from-gray-500/5 to-slate-500/5"
                }
              `}
            />
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={selected === null || isSubmitted}
          className={`
            relative px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-300 transform
            ${
              selected && !isSubmitted
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-105 hover:from-blue-700 hover:to-indigo-700 active:scale-95"
                : isSubmitted
                ? "bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed"
                : "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-500 cursor-not-allowed"
            }
          `}
        >
          {isSubmitted ? (
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Đã gửi</span>
            </div>
          ) : (
            "Gửi đáp án"
          )}
        </button>
      </div>
    </div>
  );
};

export default MultipleChoiceInput;
