// components/QuestionDisplay/QuestionContent.tsx
import React from 'react';
import { type QuestionContentProps } from '../../types/question.types';

const QuestionContent: React.FC<QuestionContentProps> = ({ 
  content, 
  type, 
  mediaUrl, 
  options, 
  isVisible 
}) => {
  if (!isVisible) return null;

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
        <img src={mediaUrl} alt="Câu hỏi" className="w-1/2 rounded-lg shadow-md" />
      </div>
    );
  };

  const renderVideo = () => {
    if (type !== 'Video' || !mediaUrl) return null;

    return (
      <div className="mt-4 text-left w-1/2">
        <video controls className="w-full rounded-lg">
          <source src={mediaUrl} type="video/mp4" />
        </video>
      </div>
    );
  };

  const renderAudio = () => {
    if (type !== 'Âm Thanh' || !mediaUrl) return null;

    return (
      <audio controls className="w-full mt-4">
        <source src={mediaUrl} type="audio/mp3" />
      </audio>
    );
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border transition-all duration-300">
      <h2 className="text-xl font-semibold mb-4">{content}</h2>
      
      {renderMultipleChoice()}
      {renderImage()}
      {renderVideo()}
      {renderAudio()}
    </div>
  );
};

export default QuestionContent;