import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, BackspaceIcon } from '@heroicons/react/24/outline';

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
  onSubmit: (isCorrect: boolean) => void;
}

const OpenEndedInput: React.FC<Props> = ({ correctAnswer, onSubmit }) => {
  const [answerSlots, setAnswerSlots] = useState<(string | null)[]>(Array(correctAnswer.length).fill(null));
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);


  // Khởi tạo chữ cái bị xáo trộn
  useEffect(() => {
    const letters = correctAnswer.split('');
    setAvailableLetters(shuffle(letters));
    setAnswerSlots(Array(correctAnswer.length).fill(null));
    setIsSubmitted(false);
    setShowResult(false);
  }, [correctAnswer]);

  // Thêm chữ cái vào ô trống
  const addToAnswer = (letter: string) => {
    const index = answerSlots.findIndex((slot) => slot === null);
    if (index !== -1) {
      const newSlots = [...answerSlots];
      newSlots[index] = letter;
      setAnswerSlots(newSlots);
      setAvailableLetters((prev) => prev.filter((l) => prev.indexOf(l) !== prev.lastIndexOf(l) ? true : l !== letter));
    }
  };

  // Xóa chữ cái khỏi ô trống
  const removeFromAnswer = (index: number) => {
    if (answerSlots[index] !== null) {
      const letter = answerSlots[index];
      const newSlots = [...answerSlots];
      newSlots[index] = null;
      setAnswerSlots(newSlots);
      setAvailableLetters((prev) => [...prev, letter as string]);
    }
  };

  // Clear all slots
  const clearAll = () => {
    const usedLetters = answerSlots.filter(slot => slot !== null) as string[];
    setAnswerSlots(Array(correctAnswer.length).fill(null));
    setAvailableLetters(prev => [...prev, ...usedLetters]);
  };

  // Gửi đáp án
  const handleSubmit = () => {
    const answer = answerSlots.join('');
    const isCorrect = answer === correctAnswer;
    setIsSubmitted(true);
    setShowResult(true);
    
    setTimeout(() => {
      onSubmit(isCorrect);
    }, 1500);
  };

  const isComplete = answerSlots.every(slot => slot !== null);
  const currentAnswer = answerSlots.join('');

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl shadow-xl border border-gray-100">
      

      {/* Answer Slots */}
      <div className="mb-8">
        <div className="flex items-center justify-center mb-4">
          <span className="text-sm font-medium text-gray-600 mr-4">Đáp án của bạn:</span>
          <button
            onClick={clearAll}
            disabled={isSubmitted || answerSlots.every(slot => slot === null)}
            className="flex items-center space-x-1 px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <BackspaceIcon className="w-3 h-3" />
            <span>Xóa tất cả</span>
          </button>
        </div>
        
        <div className="flex flex-wrap justify-center gap-2">
          {answerSlots.map((letter, index) => (
            <div
              key={index}
              onClick={() => !isSubmitted && removeFromAnswer(index)}
              className={`
                relative w-12 h-12 sm:w-14 sm:h-14 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105
                flex items-center justify-center text-lg font-bold
                ${!isSubmitted 
                  ? letter 
                    ? 'border-purple-400 bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-700 shadow-md hover:shadow-lg' 
                    : 'border-dashed border-gray-300 bg-white hover:border-purple-300 hover:bg-purple-50'
                  : showResult && currentAnswer === correctAnswer
                    ? 'border-green-400 bg-gradient-to-br from-green-100 to-emerald-100 text-green-700 shadow-lg animate-pulse'
                    : 'border-red-400 bg-gradient-to-br from-red-100 to-pink-100 text-red-700 shadow-lg'
                }
              `}
            >
              {letter || (
                <div className="w-6 h-0.5 bg-gray-400 rounded-full"></div>
              )}
              
              {/* Slot number */}
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-gray-500 text-white text-xs rounded-full flex items-center justify-center">
                {index + 1}
              </div>
              
              {/* Remove indicator */}
              {letter && !isSubmitted && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  ×
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Available Letters */}
      <div className="mb-8">
        <div className="text-center mb-4">
          <span className="text-sm font-medium text-gray-600">Chữ cái khả dụng:</span>
        </div>
        
        <div className="flex flex-wrap justify-center gap-2">
          {availableLetters.map((letter, index) => (
            <button
              key={`${letter}-${index}`}
              onClick={() => !isSubmitted && addToAnswer(letter)}
              disabled={isSubmitted}
              className={`
                w-12 h-12 sm:w-14 sm:h-14 rounded-xl font-bold text-lg transition-all duration-200 transform
                ${!isSubmitted
                  ? 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 border-2 border-gray-300 hover:border-purple-400 hover:bg-gradient-to-br hover:from-purple-100 hover:to-indigo-100 hover:text-purple-700 hover:scale-110 hover:shadow-md active:scale-95'
                  : 'bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed'
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
            ${isComplete && !isSubmitted
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-105 hover:from-purple-700 hover:to-indigo-700 active:scale-95'
              : isSubmitted
              ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed'
              : 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {isSubmitted ? (
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Đang kiểm tra...</span>
            </div>
          ) : (
            'Gửi đáp án'
          )}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Tiến độ:</span>
          <span className="text-sm font-medium text-gray-700">
            {answerSlots.filter(slot => slot !== null).length}/{correctAnswer.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(answerSlots.filter(slot => slot !== null).length / correctAnswer.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Result Message */}
      {showResult && (
        <div className={`
          p-4 rounded-xl text-center font-semibold transition-all duration-500 transform
          ${currentAnswer === correctAnswer
            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200 animate-pulse'
            : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200 animate-pulse'
          }
        `}>
          <div className="flex items-center justify-center space-x-2">
            {currentAnswer === correctAnswer ? (
              <>
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
                <span>🎉 Xuất sắc! Bạn đã ghép đúng từ: "{correctAnswer}"</span>
              </>
            ) : (
              <>
                <XCircleIcon className="w-6 h-6 text-red-600" />
                <span>❌ Chưa chính xác. Bạn ghép: "{currentAnswer}" - Đáp án đúng: "{correctAnswer}"</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OpenEndedInput;