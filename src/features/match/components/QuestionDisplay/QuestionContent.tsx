// components/QuestionDisplay/QuestionContent.tsx
import React, { useState } from 'react';
import { MagnifyingGlassIcon, PlayIcon } from '@heroicons/react/24/outline';
import { type QuestionContentProps } from '../../types/question.types';
import FullscreenModal from '../MediaPopup/FullScreenModal';

const QuestionContent: React.FC<QuestionContentProps> = ({ 
  content, 
  type, 
  mediaUrl, 
  options, 
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

  const renderMultipleChoice = () => {
    if (type !== 'Trắc Nghiệm' || !options) return null;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {options.map((option, index) => (
          <div
            key={index}
            className="flex items-center p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-all w-full cursor-pointer"
          >
            <div className="flex items-center justify-center w-10 h-10 mr-4 rounded-full bg-gray-200">
              <span className="font-bold text-lg">{String.fromCharCode(65 + index)}</span>
            </div>
            <span className="text-lg font-medium">{option}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderImage = () => {
    if (type !== 'Hình Ảnh' || !mediaUrl) return null;

    return (
      <div className="mt-4 text-left">
        <div className="relative group inline-block">
          <img 
            src={mediaUrl} 
            alt="Câu hỏi" 
            className="w-1/2 rounded-lg shadow-md cursor-pointer transition-transform hover:scale-105" 
            onClick={openFullscreen}
          />
          {/* Overlay với icon phóng to */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg flex items-center justify-center cursor-pointer"
            onClick={openFullscreen}
          >
            <MagnifyingGlassIcon className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2 italic">
          💡 Nhấp vào hình ảnh để xem toàn màn hình
        </p>
      </div>
    );
  };

  const renderVideo = () => {
    if (type !== 'Video' || !mediaUrl) return null;

    return (
      <div className="mt-4 text-left w-1/2">
        <div className="relative group">
          <video 
            className="w-full rounded-lg cursor-pointer"
            onClick={openFullscreen}
          >
            <source src={mediaUrl} type="video/mp4" />
          </video>
          {/* Overlay với icon play */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg flex items-center justify-center cursor-pointer"
            onClick={openFullscreen}
          >
            <PlayIcon className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2 italic">
          💡 Nhấp vào video để xem toàn màn hình
        </p>
      </div>
    );
  };

  const renderAudio = () => {
    if (type !== 'Âm Thanh' || !mediaUrl) return null;

    return (
      <div className="mt-4">
        <audio controls className="w-full">
          <source src={mediaUrl} type="audio/mp3" />
        </audio>
        <p className="text-sm text-gray-600 mt-2 italic">
          🎵 Nghe câu hỏi âm thanh
        </p>
      </div>
    );
  };

  const renderFullscreenContent = () => {
    if (type === 'Hình Ảnh' && mediaUrl) {
      return (
        <img 
          src={mediaUrl} 
          alt="Câu hỏi - Toàn màn hình" 
          className="w-full h-full object-contain"
        />
      );
    }

    if (type === 'Video' && mediaUrl) {
      return (
        <video 
          controls 
          autoPlay
          className="w-full h-full object-contain"
        >
          <source src={mediaUrl} type="video/mp4" />
          Trình duyệt không hỗ trợ video.
        </video>
      );
    }

    return null;
  };

  return (
    <>
      <div className="p-6 bg-white rounded-lg shadow-md border transition-all duration-300">
        <h2 className="text-xl font-semibold mb-4">{content}</h2>
        
        {renderMultipleChoice()}
        {renderImage()}
        {renderVideo()}
        {renderAudio()}
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

export default QuestionContent;