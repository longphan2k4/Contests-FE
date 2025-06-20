import React, { useState, useEffect } from 'react';
import MultipleChoiceInput from '../components/MultipleChoiceInput';
import OpenEndedInput from '../components/OpenEndedInput';
import { useQuestions } from '../hooks/useQuestions';
import { useTimer } from '../hooks/useTimer';
import { 
  ClockIcon, 
  UserGroupIcon, 
  TrophyIcon, 
  FireIcon, 
//   LightBulbIcon, *bỏ ghi chú nếu muôn sử dụng
  ArrowRightIcon,
//   CheckBadgeIcon, *bỏ ghi chú nếu muôn sử dụng
  InformationCircleIcon,
  PhotoIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

const AudienceOpinionPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Trợ giúp của khán giả - Olympic tin học.';
  }, []);

  const { questions, isLoading, error } = useQuestions();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const { timeLeft, setTimeLeft } = useTimer(questions[currentQuestionIndex]?.defaultTime || 60, isSubmitted);

  const handleAnswerSubmit = () => {
    setIsSubmitted(true);
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
    setIsSubmitted(false);
    setTimeLeft(questions[(currentQuestionIndex + 1) % questions.length]?.defaultTime || 60);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'dễ': return 'bg-green-100 text-green-800 border-green-200';
      case 'trung bình': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'khó': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTimeColor = (time: number) => {
    if (time > 30) return 'text-green-600';
    if (time > 10) return 'text-yellow-600';
    return 'text-red-600';
  };

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
            <h3 className="text-lg font-medium text-gray-900 mb-2">Có lỗi xảy ra</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl border max-w-md text-center">
          <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không có câu hỏi</h3>
          <p className="text-gray-600">Hiện tại chưa có câu hỏi nào trong hệ thống.</p>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full">
                <UserGroupIcon className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Trợ giúp khán giả</span>
              </div>
              <div className="text-sm text-gray-500">
                Câu {currentQuestionIndex + 1}/{questions.length}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-full ${getTimeColor(timeLeft)} bg-white border-2`}>
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
                <p className="text-blue-100 mb-2 text-sm font-medium">{question.intro}</p>
                <h1 className="text-2xl lg:text-3xl font-bold leading-tight">{question.text}</h1>
              </div>
            </div>
            
            {/* Question Stats */}
            <div className="flex flex-wrap gap-3 mt-4">
              <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full">
                <AcademicCapIcon className="w-4 h-4" />
                <span className="text-sm font-medium">{question.topic}</span>
              </div>
              
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getDifficultyColor(question.difficulty || '')} bg-white`}>
                <FireIcon className="w-4 h-4" />
                <span className="text-sm font-medium">{question.difficulty}</span>
              </div>
              
              <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full">
                <TrophyIcon className="w-4 h-4" />
                <span className="text-sm font-medium">{question.score} điểm</span>
              </div>
            </div>
          </div>

          {/* Question Media */}
          {question.questionMedia?.type === 'image' && (
            <div className="px-6 pt-6">
              <div className="relative rounded-xl overflow-hidden bg-gray-50 border border-gray-200">
                <img
                  src={question.questionMedia.url}
                  alt="Question Media"
                  className="w-full h-64 object-contain"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                  <PhotoIcon className="w-4 h-4 text-gray-600" />
                </div>
              </div>
            </div>
          )}

          {/* Question Input */}
          <div className="p-6">
            {question.type === 'multiple-choice' && question.options && (
              <MultipleChoiceInput
                options={question.options}
                correctAnswer={question.correctAnswer || ''}
                onSubmit={handleAnswerSubmit}
              />
            )}
            {question.type === 'open-ended' && question.correctAnswer && (
              <OpenEndedInput
                correctAnswer={question.correctAnswer}
                onSubmit={handleAnswerSubmit}
              />
            )}
          </div>

          {/* Result Section - bỏ ghi chú nếu muôn hiển thị đáp án và giải thích của đáp án*/}
          {/* {isSubmitted && (
            <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
              <div className="p-6">
                <div className="flex items-start space-x-3 mb-4">
                  <CheckBadgeIcon className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Đáp án chính xác: {question.correctAnswer}
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-4">{question.explanation}</p>
                  </div>
                </div>

                {/* Answer Media */}
                {/* {question.mediaAnswer?.type === 'image' && (
                  <div className="mb-4">
                    <div className="relative rounded-xl overflow-hidden bg-white border border-gray-200">
                      <img
                        src={question.mediaAnswer.url}
                        alt="Answer Media"
                        className="w-full h-64 object-contain"
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                        <LightBulbIcon className="w-4 h-4 text-yellow-600" />
                      </div>
                    </div>
                  </div>
                )} */}

                {/* Additional Notes */}
                {/* {question.additionalNotes && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <InformationCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900 mb-1">Ghi chú thêm:</h4>
                        <p className="text-blue-800 text-sm">{question.additionalNotes}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )} */} 

          {/* Next Question Button */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <button
              onClick={handleNextQuestion}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span>Câu hỏi tiếp theo</span>
              <ArrowRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudienceOpinionPage;