import React, { useState } from "react";
import {
  CheckCircleIcon,
  UserGroupIcon,
  ChartBarIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { useRescue } from "../hooks/useRescue";
import type { ChartDataItem } from "../types/rescue";
import { isMultipleChoice } from "../types/rescue";

interface RescueSupportProps {
  matchSlug: string;
  rescueId: number;
  onVoteComplete?: () => void;
}

interface VoteChartProps {
  chartData: ChartDataItem[];
  isLoading: boolean;
}

// Component hiển thị biểu đồ bình chọn
const VoteChart: React.FC<VoteChartProps> = ({ chartData, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <ChartBarIcon className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">
            Kết quả bình chọn
          </h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-100 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!chartData.length) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <ChartBarIcon className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">
            Kết quả bình chọn
          </h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          <UserGroupIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Chưa có lượt bình chọn nào</p>
        </div>
      </div>
    );
  }

  const totalVotes = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <ChartBarIcon className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">
            Kết quả bình chọn
          </h3>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <UserGroupIcon className="w-4 h-4" />
          <span>{totalVotes} lượt bình chọn</span>
        </div>
      </div>

      <div className="space-y-3">
        {chartData.map((item, index) => {
          const percentage =
            totalVotes > 0 ? (item.value / totalVotes) * 100 : 0;
          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  {item.label}
                </span>
                <span className="text-sm text-gray-600">
                  {item.value} ({percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const RescueSupport: React.FC<RescueSupportProps> = ({
  matchSlug,
  rescueId,
  onVoteComplete,
}) => {
  const {
    question,
    chartData,
    selectedAnswer,
    isLoading,
    isSubmitting,
    isChartLoading,
    hasVoted,
    error,
    setSelectedAnswer,
    submitVote,
  } = useRescue({ matchSlug, rescueId });

  // Local state for open-ended text input
  const [openEndedText, setOpenEndedText] = useState('');

  const handleVoteSubmit = async () => {
    await submitVote();
    onVoteComplete?.();
  };

  const getOptionClass = (option: string) => {
    const baseClass =
      "group relative w-full p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg";

    if (hasVoted) {
      if (selectedAnswer === option) {
        return `${baseClass} border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md ring-2 ring-blue-200`;
      }
      return `${baseClass} border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed`;
    } else {
      if (selectedAnswer === option) {
        return `${baseClass} border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md ring-2 ring-blue-200`;
      }
      return `${baseClass} border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50`;
    }
  };

  // Handle open-ended text change
  const handleOpenEndedChange = (value: string) => {
    setOpenEndedText(value);
    setSelectedAnswer(value);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded-lg w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="h-16 bg-gray-100 rounded-xl"></div>
              ))}
            </div>
            <div className="h-12 bg-gray-200 rounded-xl w-32 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <div className="text-red-600 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Đã xảy ra lỗi
          </h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
          <div className="text-gray-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Không có câu hỏi
          </h3>
          <p className="text-gray-500">Chưa có câu hỏi nào cần hỗ trợ</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Question Section */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <UserGroupIcon className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Hỗ trợ khán giả
            </h2>
            {hasVoted && (
              <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full">
                <CheckCircleIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Đã bình chọn</span>
              </div>
            )}
            <div className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              {question && isMultipleChoice(question) ? (
                <>
                  <CheckCircleIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Trắc nghiệm</span>
                </>
              ) : (
                <>
                  <PencilIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Tự luận</span>
                </>
              )}
            </div>
          </div>
          <p className="text-gray-600 mb-4">
            Thí sinh đang cần sự hỗ trợ từ khán giả. 
            {question && isMultipleChoice(question) 
              ? ' Hãy chọn đáp án mà bạn cho là đúng!' 
              : ' Hãy nhập câu trả lời mà bạn cho là đúng!'
            }
          </p>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {question.content}
            </h3>
            {question.questionTopic && (
              <div className="mb-4">
                <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  Chủ đề: {question.questionTopic}
                </span>
              </div>
            )}

            {/* Render different input types based on question type */}
            {question && isMultipleChoice(question) ? (
              // Multiple Choice Options
              <div className="space-y-4 mb-6">
                {question.options.map((option, index) => (
                  <div
                    key={index}
                    className={getOptionClass(option)}
                    onClick={() => !hasVoted && setSelectedAnswer(option)}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`
                        flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-colors duration-300
                        ${
                          selectedAnswer === option
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600"
                        }
                      `}
                      >
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span
                        className={`
                        text-base font-medium transition-colors duration-300
                        ${
                          selectedAnswer === option
                            ? "text-blue-700"
                            : "text-gray-700"
                        }
                      `}
                      >
                        {option}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Open-ended text input
              <div className="mb-6">
                <div className="relative">
                  <textarea
                    value={openEndedText}
                    onChange={(e) => handleOpenEndedChange(e.target.value)}
                    disabled={hasVoted}
                    placeholder="Nhập câu trả lời của bạn..."
                    className={`
                      w-full p-4 border-2 rounded-xl resize-none transition-all duration-300
                      ${hasVoted 
                        ? 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-60' 
                        : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none'
                      }
                    `}
                    rows={4}
                    maxLength={500}
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                    {openEndedText.length}/500
                  </div>
                </div>
                {openEndedText && !hasVoted && (
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2 text-blue-700">
                      <PencilIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">Câu trả lời của bạn:</span>
                    </div>
                    <p className="text-blue-600 text-sm mt-1 italic">"{openEndedText}"</p>
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            {!hasVoted && (
              <div className="flex justify-center">
                <button
                  onClick={handleVoteSubmit}
                  disabled={!selectedAnswer || isSubmitting}
                  className={`
                    relative px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-300 transform
                    ${
                      selectedAnswer && !isSubmitting
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-105 hover:from-blue-700 hover:to-indigo-700 active:scale-95"
                        : "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-500 cursor-not-allowed"
                    }
                  `}
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Đang gửi...</span>
                    </div>
                  ) : (
                    "Gửi bình chọn"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <VoteChart chartData={chartData} isLoading={isChartLoading} />
    </div>
  );
};

export default RescueSupport;
