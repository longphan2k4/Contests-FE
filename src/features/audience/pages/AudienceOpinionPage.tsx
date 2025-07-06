import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MultipleChoiceInput from "../components/MultipleChoiceInput";
import OpenEndedInput from "../components/OpenEndedInput";
import { useRescueQuestion } from "../hooks/useRescue";

import { useSocket } from "../../../contexts/SocketContext";
import type { Question } from "../types";
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
  const { match, rescueId: rescueIdParam } = useParams<{
    match: string;
    rescueId: string;
  }>();

  const [question, setQuestion] = useState<Question | null>(null);
  const rescueId = rescueIdParam ? parseInt(rescueIdParam, 10) : 0;
  useEffect(() => {
    document.title = "Trợ giúp của khán giả - Olympic tin học.";
  }, []);

  const {
    data: questionData,
    isLoading,
    error,
    refetch,
  } = useRescueQuestion(match || null, rescueId);

  useEffect(() => {
    if (questionData) {
      setQuestion(questionData.data);
    }
  }, [questionData]);

  const [timeLeft, setTimeLeft] = useState(0);

  const { socket } = useSocket();

  React.useEffect(() => {
    if (!socket) return;

    const handleTimerLeft = (data: any) => {
      // console.log("Received timerLeft:Rescue event", data);
      setTimeLeft(data.timerLeft);
    };

    // Lắng nghe sự kiện từ server
    socket.on("timerLeft:Rescue", handleTimerLeft);

    // Cleanup listener khi component unmount
    return () => {
      socket.off("timerLeft:Rescue", handleTimerLeft);
    };
  }, [socket]);

  const getTimeColor = (time: number) => {
    if (time > 30) return "text-green-600";
    if (time > 10) return "text-yellow-600";
    return "text-red-600";
  };

  // Kiểm tra params hợp lệ
  if (!match || !rescueId) {
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
              URL cần có định dạng: /audience/opinion/[match]/[rescueId]
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div onClick={() => refetch()}>Thử lại</div>
        <div className="text-red-500">Lỗi khi tải câu hỏi: {error.message}</div>
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
              <div className="text-sm text-gray-500">ID: {question?.id}</div>
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
                  dangerouslySetInnerHTML={{ __html: question?.content || "" }}
                />
              </div>
            </div>

            {/* Question Stats */}
            <div className="flex flex-wrap gap-3 mt-4">
              {question?.questionTopic && (
                <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full">
                  <AcademicCapIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {question?.questionTopic || "Chưa có chủ đề"}
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
          {question?.questionMedia &&
            Array.isArray(question?.questionMedia) &&
            question.questionMedia.length > 0 && (
              <div className="px-6 pt-6">
                <div
                  className={`grid gap-4 ${
                    question?.questionMedia.length === 1
                      ? "grid-cols-1"
                      : question.questionMedia.length === 2
                      ? "grid-cols-2"
                      : question.questionMedia.length === 3
                      ? "grid-cols-2 md:grid-cols-3"
                      : "grid-cols-2 md:grid-cols-4"
                  }`}
                >
                  {question?.questionMedia?.map((media, index) => (
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
                          {question?.questionMedia &&
                            question.questionMedia?.length > 1 && (
                              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                                <span className="text-xs font-medium text-gray-700">
                                  {index + 1}/{question?.questionMedia?.length}
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
                          {question?.questionMedia?.map((media, index) => (
                            <div key={index} className="relative">
                              {question?.questionMedia?.length &&
                                question.questionMedia.length > 1 && (
                                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                                    <span className="text-xs font-medium text-gray-700">
                                      {index + 1}/
                                      {question.questionMedia.length}
                                    </span>
                                  </div>
                                )}

                              <img src={media.url} alt={`Media ${index}`} />
                            </div>
                          ))}
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
            {question && question.questionType === "multiple_choice" ? (
              <MultipleChoiceInput
                questionId={question?.id || 0}
                options={question.options ?? []}
                rescueId={rescueId}
              />
            ) : (
              <OpenEndedInput
                correctAnswer={question?.correctAnswer || ""}
                questionId={question?.id}
                rescueId={rescueId}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudienceOpinionPage;
