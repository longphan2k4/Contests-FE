// components/QuestionDisplay/AnswerDisplay.tsx
import React, { useState } from 'react';
import { CheckCircleIcon, MagnifyingGlassIcon, PlayIcon } from '@heroicons/react/24/outline';
import type { AnswerDisplayProps } from '../../types/question.types';
import FullscreenModal from "../MediaPopup/FullScreenModal"

const AnswerDisplay: React.FC<AnswerDisplayProps> = ({ 
  answer, 
  answerType = 'text',
  answerMediaUrl,
  isVisible 
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!isVisible) return null;

  const openFullscreen = () => {
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

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
        // Hiển thị đáp án dạng hình ảnh với khả năng fullscreen
        return (
          <div className="space-y-3">
            {answer && (
              <p className="text-lg font-medium mb-3">{answer}</p>
            )}
            {answerMediaUrl && (
              <div className="text-left relative group">
                <img 
                  src={answerMediaUrl} 
                  alt="Đáp án hình ảnh" 
                  className="max-w-md rounded-lg shadow-md border border-gray-200 cursor-pointer transition-transform hover:scale-105"
                  onClick={openFullscreen}
                />
                {/* Overlay với icon phóng to */}
                <div 
                  className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg flex items-center justify-center cursor-pointer"
                  onClick={openFullscreen}
                >
                  <MagnifyingGlassIcon className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <p className="text-sm text-gray-600 mt-2 italic">
                  💡 Nhấp vào hình ảnh để xem toàn màn hình
                </p>
              </div>
            )}
          </div>
        );

      case 'video':
        // Hiển thị đáp án dạng video với khả năng fullscreen
        return (
          <div className="space-y-3">
            {answer && (
              <p className="text-lg font-medium mb-3">{answer}</p>
            )}
            {answerMediaUrl && (
              <div className="text-left max-w-md relative group">
                <video 
                  className="w-full rounded-lg shadow-md border border-gray-200 cursor-pointer"
                  onClick={openFullscreen}
                >
                  <source src={answerMediaUrl} type="video/mp4" />
                  Trình duyệt không hỗ trợ video.
                </video>
                {/* Overlay với icon play */}
                <div 
                  className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg flex items-center justify-center cursor-pointer"
                  onClick={openFullscreen}
                >
                  <PlayIcon className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <p className="text-sm text-gray-600 mt-2 italic">
                  💡 Nhấp vào video để xem toàn màn hình
                </p>
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

  const renderFullscreenContent = () => {
    if (answerType === 'image' && answerMediaUrl) {
      return (
        <img 
          src={answerMediaUrl} 
          alt="Đáp án hình ảnh - Toàn màn hình" 
          className="max-w-full max-h-full object-contain"
        />
      );
    }

    if (answerType === 'video' && answerMediaUrl) {
      return (
        <video 
          controls 
          autoPlay
          className="max-w-full max-h-full object-contain"
        >
          <source src={answerMediaUrl} type="video/mp4" />
          Trình duyệt không hỗ trợ video.
        </video>
      );
    }

    return null;
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
    <>
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

      {/* Modal toàn màn hình */}
      <FullscreenModal 
        isOpen={isFullscreen} 
        onClose={closeFullscreen}
      >
        {renderFullscreenContent()}
      </FullscreenModal>
    </>
  );
};

export default AnswerDisplay;