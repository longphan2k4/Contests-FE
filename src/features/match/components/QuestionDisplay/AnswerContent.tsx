// components/QuestionDisplay/AnswerDisplay.tsx
import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import type { AnswerDisplayProps } from '../../types/question.types';

const AnswerDisplay: React.FC<AnswerDisplayProps> = ({ 
  answer, 
  answerType = 'text',
  answerMediaUrl,
  isVisible 
}) => {
  if (!isVisible) return null;

  const renderAnswerContent = () => {
    switch (answerType) {
      case 'option':
        // Hiển thị đáp án dạng option (A, B, C, D)
        return (
          <div className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 mr-4 rounded-full bg-green-500 text-white">
              <span className="font-bold text-xl">{answer}</span>
            </div>
            <span className="text-lg font-medium">Đáp án đúng: {answer}</span>
          </div>
        );

      case 'text':
        // Hiển thị đáp án dạng text
        return (
          <p className="text-lg font-medium leading-relaxed">{answer}</p>
        );

      case 'image':
        // Hiển thị đáp án dạng hình ảnh
        return (
          <div className="space-y-3">
            {answer && (
              <p className="text-lg font-medium mb-3">{answer}</p>
            )}
            {answerMediaUrl && (
              <div className="text-left">
                <img 
                  src={answerMediaUrl} 
                  alt="Đáp án hình ảnh" 
                  className="max-w-md rounded-lg shadow-md border border-gray-200"
                />
              </div>
            )}
          </div>
        );

      case 'video':
        // Hiển thị đáp án dạng video
        return (
          <div className="space-y-3">
            {answer && (
              <p className="text-lg font-medium mb-3">{answer}</p>
            )}
            {answerMediaUrl && (
              <div className="text-left max-w-md">
                <video 
                  controls 
                  className="w-full rounded-lg shadow-md border border-gray-200"
                >
                  <source src={answerMediaUrl} type="video/mp4" />
                  Trình duyệt không hỗ trợ video.
                </video>
              </div>
            )}
          </div>
        );

      case 'audio':
        // Hiển thị đáp án dạng âm thanh
        return (
          <div className="space-y-3">
            {answer && (
              <p className="text-lg font-medium mb-3">{answer}</p>
            )}
            {answerMediaUrl && (
              <audio 
                controls 
                className="w-full max-w-md border border-gray-200 rounded"
              >
                <source src={answerMediaUrl} type="audio/mp3" />
                <source src={answerMediaUrl} type="audio/wav" />
                Trình duyệt không hỗ trợ audio.
              </audio>
            )}
          </div>
        );

      default:
        return (
          <p className="text-lg font-medium">{answer}</p>
        );
    }
  };

  const getAnswerTypeLabel = () => {
    switch (answerType) {
      case 'option':
        return 'Đáp án';
      case 'text':
        return 'Đáp án';
      case 'image':
        return 'Đáp án (Hình ảnh)';
      case 'video':
        return 'Đáp án (Video)';
      case 'audio':
        return 'Đáp án (Âm thanh)';
      default:
        return 'Đáp án';
    }
  };

  return (
    <div className="p-6 bg-blue-50 rounded-lg border border-blue-200 mt-4 transition-all duration-300">
      <div className="flex items-center mb-4">
        <CheckCircleIcon className="w-6 h-6 text-green-600 mr-2" />
        <h3 className="font-semibold text-green-800 text-lg">
          {getAnswerTypeLabel()}
        </h3>
      </div>
      
      <div className="bg-white p-4 rounded-lg border border-green-200">
        {renderAnswerContent()}
      </div>
    </div>
  );
};

export default AnswerDisplay;