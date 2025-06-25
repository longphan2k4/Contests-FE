import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MultipleChoiceInput from "../components/MultipleChoiceInput";
import OpenEndedInput from "../components/OpenEndedInput";
import { useTimer } from "../hooks/useTimer";
import { useRescue } from "../hooks/useRescue";
import { isMultipleChoice, isOpenEnded, isEssay } from "../types/rescue";
import { useToast } from "../../../contexts/toastContext";
import {
  ClockIcon,
  UserGroupIcon,
  TrophyIcon,
  InformationCircleIcon,
  PhotoIcon,
  VideoCameraIcon,
  SpeakerWaveIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

const AudienceOpinionPage: React.FC = () => {
  // Lấy params từ URL
  const { matchSlug, rescueId: rescueIdParam } = useParams<{
    matchSlug: string;
    rescueId: string;
  }>();

  // Chuyển đổi rescueId từ string sang number
  const rescueId = rescueIdParam ? parseInt(rescueIdParam, 10) : 0;

  // Toast notification
  const { showToast } = useToast();

  useEffect(() => {
    document.title = "Trợ giúp của khán giả - Olympic tin học.";
  }, []);

  const {
    question,
    isLoading,
    error,
    selectedAnswer,
    setSelectedAnswer,
    submitVote,
    hasVoted,
  } = useRescue({
    matchSlug: matchSlug || "",
    rescueId,
    autoRefreshChart: false,
  });

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const { timeLeft } = useTimer(60, isSubmitted);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleAnswerSubmit = async (isCorrect: boolean) => {
    setIsSubmitted(true);
    console.log(`Đáp án ${isCorrect ? "chính xác" : "không chính xác"}`);

    if (!hasVoted && selectedAnswer) {
      await submitVote();
      showToast("Bạn đã gửi trợ giúp thành công!", "success");
    }
  };

  const getTimeColor = (time: number) => {
    if (time > 30) return "text-green-600";
    if (time > 10) return "text-yellow-600";
    return "text-red-600";
  };

  // Kiểm tra params hợp lệ
  if (!matchSlug || !rescueId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-200 max-w-md">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <InformationCircleIcon className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Tham số không hợp lệ
            </h3>
            <p className="text-gray-600">
              URL cần có định dạng: /audience/opinion/[matchSlug]/[rescueId]
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Đang tải câu hỏi...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-200 max-w-md">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <InformationCircleIcon className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Có lỗi xảy ra
            </h3>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl border max-w-md text-center">
          <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không có câu hỏi
          </h3>
          <p className="text-gray-600">
            Hiện tại chưa có câu hỏi nào trong hệ thống.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full">
                <UserGroupIcon className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Trợ giúp khán giả
                </span>
              </div>
              <div className="text-sm text-gray-500">ID: {question.id}</div>
            </div>

            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center space-x-2 px-3 py-2 rounded-full ${getTimeColor(
                  timeLeft
                )} bg-white border-2`}
              >
                <ClockIcon className="w-5 h-5" />
                <span className="font-bold text-lg">{timeLeft}s</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Question Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1
                  className="text-2xl lg:text-3xl font-bold leading-tight"
                  dangerouslySetInnerHTML={{ __html: question.content }}
                />
              </div>
            </div>

            {/* Question Stats */}
            <div className="flex flex-wrap gap-3 mt-4">
              {question.questionTopic && (
                <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full">
                  <AcademicCapIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {question.questionTopic}
                  </span>
                </div>
              )}

              <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full">
                <TrophyIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Trợ giúp khán giả</span>
              </div>
            </div>
          </div>

          {/* Question Media */}
          {question.questionMedia &&
            Array.isArray(question.questionMedia) &&
            question.questionMedia.length > 0 && (
              <div className="px-6 pt-6">
                <div
                  className={`grid gap-4 ${
                    question.questionMedia.length === 1
                      ? "grid-cols-1"
                      : question.questionMedia.length === 2
                      ? "grid-cols-2"
                      : question.questionMedia.length === 3
                      ? "grid-cols-2 md:grid-cols-3"
                      : "grid-cols-2 md:grid-cols-4"
                  }`}
                >
                  {question.questionMedia.map((media, index) => (
                    <div
                      key={index}
                      className={`relative rounded-xl overflow-hidden bg-gray-50 border border-gray-200 ${
                        media.type === "audio" ? "col-span-full" : ""
                      }`}
                    >
                      {media.type === "image" && (
                        <>
                          <img
                            src={media.url}
                            alt={`Question Media ${index + 1}`}
                            className="w-full h-64 object-contain"
                          />
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                            <PhotoIcon className="w-4 h-4 text-gray-600" />
                          </div>
                          {question.questionMedia &&
                            question.questionMedia.length > 1 && (
                              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                                <span className="text-xs font-medium text-gray-700">
                                  {index + 1}/{question.questionMedia.length}
                                </span>
                              </div>
                            )}
                        </>
                      )}
                      {media.type === "video" && (
                        <>
                          <video
                            src={media.url}
                            className="w-full h-64 object-contain"
                            controls
                          />
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                            <VideoCameraIcon className="w-4 h-4 text-gray-600" />
                          </div>
                          {question.questionMedia &&
                            question.questionMedia.length > 1 && (
                              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                                <span className="text-xs font-medium text-gray-700">
                                  {index + 1}/{question.questionMedia.length}
                                </span>
                              </div>
                            )}
                        </>
                      )}
                      {media.type === "audio" && (
                        <>
                          <div className="flex items-center justify-center h-64 bg-gradient-to-br from-blue-50 to-indigo-50">
                            <div className="text-center">
                              <SpeakerWaveIcon className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                              <p className="text-gray-600 mb-4">
                                Tập tin âm thanh
                              </p>
                              <audio
                                src={media.url}
                                className="w-full max-w-md"
                                controls
                              />
                            </div>
                          </div>
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                            <SpeakerWaveIcon className="w-4 h-4 text-gray-600" />
                          </div>
                          {question.questionMedia &&
                            question.questionMedia.length > 1 && (
                              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                                <span className="text-xs font-medium text-gray-700">
                                  {index + 1}/{question.questionMedia.length}
                                </span>
                              </div>
                            )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Question Input */}
          <div className="p-6">
            {question &&
              (isMultipleChoice(question) ? (
                <MultipleChoiceInput
                  options={question.options}
                  correctAnswer={question.correctAnswer}
                  onAnswerSelect={handleAnswerSelect}
                  onSubmit={handleAnswerSubmit}
                />
              ) : isOpenEnded(question) || isEssay(question) ? (
                <OpenEndedInput
                  correctAnswer={question.correctAnswer}
                  onAnswerChange={handleAnswerSelect}
                  onSubmit={handleAnswerSubmit}
                />
              ) : null)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudienceOpinionPage;
