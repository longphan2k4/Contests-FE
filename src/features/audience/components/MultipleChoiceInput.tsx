import React, { useState } from 'react';
import { CheckCircleIcon, XCircleIcon} from '@heroicons/react/24/outline';

interface Props {
  options: string[];
  correctAnswer: string;
  onSubmit: (isCorrect: boolean) => void;
}

const MultipleChoiceInput: React.FC<Props> = ({ options, correctAnswer, onSubmit }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = () => {
    if (!selected) return;
    
    const isCorrect = selected === correctAnswer;
    setIsSubmitted(true);
    setShowResult(true);
    
    setTimeout(() => {
      onSubmit(isCorrect);
    }, 1500);
  };

  const getOptionClass = (option: string) => {
    let baseClass = "group relative w-full p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg";
    
    if (!isSubmitted) {
      if (selected === option) {
        return `${baseClass} border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md ring-2 ring-blue-200`;
      }
      return `${baseClass} border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50`;
    } else {
      if (option === correctAnswer) {
        return `${baseClass} border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg ring-2 ring-green-200`;
      } else if (selected === option && option !== correctAnswer) {
        return `${baseClass} border-red-500 bg-gradient-to-r from-red-50 to-pink-50 shadow-lg ring-2 ring-red-200`;
      }
      return `${baseClass} border-gray-200 bg-gray-100 opacity-60`;
    }
  };

  const getResultIcon = (option: string) => {
    if (!isSubmitted) return null;
    
    if (option === correctAnswer) {
      return <CheckCircleIcon className="w-6 h-6 text-green-500 animate-bounce" />;
    } else if (selected === option && option !== correctAnswer) {
      return <XCircleIcon className="w-6 h-6 text-red-500 animate-pulse" />;
    }
    return null;
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl shadow-xl border border-gray-100">
     

      {/* Options */}
      <div className="space-y-4 mb-8">
        {options.map((option, index) => (
          <div
            key={index}
            className={getOptionClass(option)}
            onClick={() => !isSubmitted && setSelected(option)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Option Letter */}
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-colors duration-300
                  ${selected === option && !isSubmitted 
                    ? 'bg-blue-500 text-white' 
                    : isSubmitted && option === correctAnswer
                    ? 'bg-green-500 text-white'
                    : isSubmitted && selected === option && option !== correctAnswer
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                  }
                `}>
                  {String.fromCharCode(65 + index)}
                </div>
                
                {/* Option Text */}
                <span className={`
                  text-base font-medium transition-colors duration-300
                  ${selected === option && !isSubmitted 
                    ? 'text-blue-700' 
                    : isSubmitted && option === correctAnswer
                    ? 'text-green-700'
                    : isSubmitted && selected === option && option !== correctAnswer
                    ? 'text-red-700'
                    : 'text-gray-700'
                  }
                `}>
                  {option}
                </span>
              </div>
              
              {/* Result Icon */}
              <div className="flex-shrink-0">
                {getResultIcon(option)}
              </div>
            </div>
            
            {/* Hover effect indicator */}
            {!isSubmitted && (
              <div className={`
                absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
                ${selected === option 
                  ? 'bg-gradient-to-r from-blue-500/5 to-indigo-500/5' 
                  : 'bg-gradient-to-r from-gray-500/5 to-slate-500/5'
                }
              `} />
            )}
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
            ${selected && !isSubmitted
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-105 hover:from-blue-700 hover:to-indigo-700 active:scale-95'
              : isSubmitted
              ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed'
              : 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {isSubmitted ? (
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Đang xử lý...</span>
            </div>
          ) : (
            'Gửi đáp án'
          )}
        </button>
      </div>

      {/* Result Message */}
      {showResult && (
        <div className={`
          mt-6 p-4 rounded-xl text-center font-semibold transition-all duration-500 transform
          ${selected === correctAnswer
            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200 animate-pulse'
            : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200 animate-pulse'
          }
        `}>
          <div className="flex items-center justify-center space-x-2">
            {selected === correctAnswer ? (
              <>
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
                <span>🎉 Chính xác! Đáp án của bạn đúng rồi!</span>
              </>
            ) : (
              <>
                <XCircleIcon className="w-6 h-6 text-red-600" />
                <span>❌ Không chính xác. Đáp án đúng là: {correctAnswer}</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultipleChoiceInput;