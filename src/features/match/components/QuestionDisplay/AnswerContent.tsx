import React from "react";
import { type AnswerContentProps } from "../../types/question.types";

const AnswerContent: React.FC<AnswerContentProps> = ({
  answermedia = [],
  correctAnswer,
}) => {
  const hasMedia = answermedia && answermedia.length > 0;
  const renderMedia = () => {
    if (!hasMedia) return null;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {answermedia?.map((media, index) => {
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

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border transition-all duration-300">
      <h2 className="text-xl font-semibold mb-4">
        Đáp án là : {correctAnswer}
      </h2>
      {hasMedia && renderMedia()}
    </div>
  );
};

export default AnswerContent;
