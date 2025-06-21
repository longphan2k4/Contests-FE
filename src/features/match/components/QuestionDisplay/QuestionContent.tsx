import React, { useState } from "react";
import DOMPurify from "dompurify";
import { type QuestionContentProps } from "../../types/question.types";

const QuestionContent: React.FC<QuestionContentProps> = ({
  content,
  type,
  questionMedia = [],
  options = [],
}) => {
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null);
  
  // ✅ Đảm bảo questionMedia là mảng và giới hạn tối đa 4 items
  const safeMedia = Array.isArray(questionMedia) 
    ? questionMedia.slice(0, 4) 
    : [];
    
  // ✅ Safe access cho questionMedia length
  const originalMediaCount = questionMedia?.length || 0;

  // Xác định layout grid dựa trên số lượng media
  const getGridLayout = (count: number) => {
    switch (count) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-1 sm:grid-cols-2";
      case 3:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
      case 4:
        return "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4";
      default:
        return "grid-cols-1 sm:grid-cols-2";
    }
  };

  // Xác định chiều cao cố định dựa trên số lượng media
  const getMediaHeight = (count: number) => {
    if (count <= 2) return "h-48 sm:h-56";
    return "h-40 sm:h-44";
  };

  const renderMediaItem = (media: any, index: number) => {
    const heightClass = getMediaHeight(safeMedia.length);
    
    if (media.type === "image") {
      return (
        <div 
          key={index}
          className={`relative overflow-hidden rounded-lg shadow-md cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${heightClass}`}
          onClick={() => setSelectedMediaIndex(index)}
        >
          <img
            src={media.url}
            alt={`Media ${index + 1}`}
            className="w-full h-full object-contain"
            loading="lazy"
          />
          <div className="absolute hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 hover:opacity-100 transition-opacity duration-300">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm5 3a2 2 0 114 0 2 2 0 01-4 0zm4.5 7H7l2-3 1.5 2 2.5-4 2 5z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      );
    }

    if (media.type === "video") {
      return (
        <div 
          key={index} 
          className={`relative overflow-hidden rounded-lg shadow-md ${heightClass}`}
        >
          <video 
            controls 
            className="w-full h-full object-contain"
            preload="metadata"
          >
            <source src={media.url} type="video/mp4" />
            <source src={media.url} type="video/webm" />
            <source src={media.url} type="video/ogg" />
            Trình duyệt của bạn không hỗ trợ video.
          </video>
        </div>
      );
    }

    if (media.type === "audio") {
      return (
        <div 
          key={index} 
          className={`relative bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg shadow-md p-6 flex flex-col items-center justify-center ${heightClass}`}
        >
          <div className="mb-4">
            <svg className="w-12 h-12 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 12c0-2.21-.896-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 12a5.983 5.983 0 01-.757 2.829 1 1 0 11-1.415-1.414A3.987 3.987 0 0013 12a3.987 3.987 0 00-.172-1.415 1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          <audio 
            controls 
            className="w-full"
            preload="metadata"
          >
            <source src={media.url} type="audio/mp3" />
            <source src={media.url} type="audio/wav" />
            <source src={media.url} type="audio/ogg" />
            Trình duyệt của bạn không hỗ trợ audio.
          </audio>
          <p className="text-sm text-gray-600 mt-2 text-center">Audio {index + 1}</p>
        </div>
      );
    }

    return null;
  };

  const renderMedia = () => {
    if (safeMedia.length === 0) return null;

    return (
      <div className="mb-6">
        <div className={`grid gap-3 sm:gap-4 ${getGridLayout(safeMedia.length)}`}>
          {safeMedia.map((media, index) => renderMediaItem(media, index))}
        </div>
        
        {/* Hiển thị số lượng media nếu có nhiều hơn 4 items trong original array */}
        {originalMediaCount > 4 && (
          <div className="mt-3 text-center">
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Hiển thị 4/{originalMediaCount} media items
            </span>
          </div>
        )}
      </div>
    );
  };

  // Modal để xem ảnh full size
  const renderImageModal = () => {
    if (selectedMediaIndex === null) return null;
    
    const selectedMedia = safeMedia[selectedMediaIndex];
    if (selectedMedia?.type !== "image") return null;

    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
        onClick={() => setSelectedMediaIndex(null)}
      >
        <div className="relative max-w-4xl max-h-full">
          <img
            src={selectedMedia.url}
            alt={`Media ${selectedMediaIndex + 1}`}
            className="max-w-full max-h-full object-contain rounded-lg"
          />
          <button
            onClick={() => setSelectedMediaIndex(null)}
            className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  const renderMultipleChoice = () => {
    if (
      type !== "multiple_choice" ||
      !Array.isArray(options) ||
      options.length === 0
    )
      return null;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {options.map((option, index) => (
          <div
            key={index}
            className="flex items-center p-4 border-2 border-gray-200 rounded-lg bg-white hover:bg-gray-50 hover:border-blue-300 transition-all duration-200 w-full cursor-pointer group"
          >
            <div className="flex items-center justify-center w-10 h-10 mr-4 rounded-full bg-gray-100 group-hover:bg-blue-100 transition-colors">
              <span className="font-bold text-lg text-gray-700 group-hover:text-blue-700">
                {String.fromCharCode(65 + index)}
              </span>
            </div>
            <span className="text-base font-medium text-gray-800 leading-relaxed">
              {option}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="p-6 bg-white rounded-lg shadow-md border transition-all duration-300">
        <div
          className="text-xl font-semibold mb-6 leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(content || ""),
          }}
        />
        {renderMedia()}
        {renderMultipleChoice()}
      </div>
      {renderImageModal()}
    </>
  );
};

export default QuestionContent;