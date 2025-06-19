import React, { useState } from 'react';
import MultipleChoiceInput from '../components/MultipleChoiceInput';
import OpenEndedInput from '../components/OpenEndedInput';
import { useQuestions } from '../hooks/useQuestions';
import { useTimer } from '../hooks/useTimer';

const AudienceOpinionPage: React.FC = () => {
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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (questions.length === 0) return <div>Không có câu hỏi</div>;

  const question = questions[currentQuestionIndex];

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md">
      {/* Hiển thị intro và topic */}
      <p className="text-gray-600 mb-2">{question.intro}</p>
      <p className="text-sm text-gray-500 mb-4">
        Chủ đề: {question.topic} | Độ khó: {question.difficulty} | Điểm: {question.score}
      </p>

      {/* Hiển thị thời gian */}
      <p className="text-red-500 mb-3">Thời gian còn lại: {timeLeft}s</p>

      {/* Hiển thị questionMedia */}
      {question.questionMedia?.type === 'image' && (
        <img
          src={question.questionMedia.url}
          alt="Question Media"
          className="w-full h-48 object-contain mb-4"
        />
      )}

      {/* Hiển thị câu hỏi */}
      <h1 className="text-2xl font-bold mb-4">{question.text}</h1>

      {/* Input phù hợp với loại câu hỏi */}
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

      {/* Hiển thị kết quả và giải thích sau khi gửi */}
      {isSubmitted && (
        <div className="mt-6">
          <p className="text-lg font-semibold mb-2">
            Đáp án đúng: {question.correctAnswer}
          </p>
          <p className="text-gray-700 mb-2">{question.explanation}</p>
          {question.mediaAnswer?.type === 'image' && (
            <img
              src={question.mediaAnswer.url}
              alt="Answer Media"
              className="w-full h-48 object-contain mb-4"
            />
          )}
          <p className="text-sm text-gray-600">
            Ghi chú: {question.additionalNotes}
          </p>
        </div>
      )}

      {/* Nút chuyển câu hỏi */}
      <button
        onClick={handleNextQuestion}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
      >
        Câu hỏi tiếp theo
      </button>
    </div>
  );
};

export default AudienceOpinionPage;