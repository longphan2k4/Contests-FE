import React from "react";
import DOMPurify from "dompurify";
import { type QuestionContentProps } from "../../types/question.types";

const QuestionContent: React.FC<QuestionContentProps> = ({
  content,
  type,
  questionMedia = [],
  options = [],
}) => {
  // ✅ Đảm bảo questionMedia là mảng
  const safeMedia = Array.isArray(questionMedia) ? questionMedia : [];

  const renderMedia = () => {
    if (safeMedia.length === 0) return null;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {safeMedia.map((media, index) => {
          if (media.type === "image") {
            return (
              <img
                key={index}
                src={media.url}
                alt={`Media ${index}`}
                className="w-full rounded-lg shadow-md cursor-pointer transition-transform hover:scale-105"
              />
            );
          }

          if (media.type === "video") {
            return (
              <div key={index} className="relative group">
                <video controls className="w-full rounded-lg">
                  <source src={media.url} type="video/mp4" />
                  Trình duyệt của bạn không hỗ trợ video.
                </video>
              </div>
            );
          }

          if (media.type === "audio") {
            return (
              <div key={index} className="relative group">
                <audio controls className="w-full">
                  <source src={media.url} type="audio/mp3" />
                  Trình duyệt của bạn không hỗ trợ audio.
                </audio>
              </div>
            );
          }

          return null;
        })}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((option, index) => (
          <div
            key={index}
            className="flex items-center p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-all w-full cursor-pointer"
          >
            <div className="flex items-center justify-center w-10 h-10 mr-4 rounded-full bg-gray-200">
              <span className="font-bold text-lg">
                {String.fromCharCode(65 + index)}
              </span>
            </div>
            <span className="text-lg font-medium">{option}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="p-6 bg-white rounded-lg shadow-md border transition-all duration-300">
        <div
          className="text-xl font-semibold mb-4"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(content || ""),
          }}
        />
        {renderMedia()}
        {renderMultipleChoice()}
      </div>
    </div>
  );
};

export default QuestionContent;
