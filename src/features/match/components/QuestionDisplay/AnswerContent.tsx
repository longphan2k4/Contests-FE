import React, { useEffect, useRef, useState } from "react";
import { type AnswerContentProps } from "../../types/question.types";

const AnswerContent: React.FC<AnswerContentProps> = ({
  answermedia = [],
  correctAnswer,
  controlValue = "start",
}) => {
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(
    null
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (controlValue === "start") {
      audio.play().catch(() => {});
    } else if (controlValue === "pause") {
      audio.pause();
    } else if (controlValue === "reset") {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  }, [controlValue]);

  const safeMedia = Array.isArray(answermedia) ? answermedia.slice(0, 4) : [];

  const originalMediaCount = answermedia?.length || 0;
  const hasMedia = safeMedia.length > 0;

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
            alt={`Answer Media ${index + 1}`}
            className="w-full h-full object-contain bg-gray-50"
            loading="lazy"
          />
          <div className="absolute hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 hover:opacity-100 transition-opacity duration-300">
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm5 3a2 2 0 114 0 2 2 0 01-4 0zm4.5 7H7l2-3 1.5 2 2.5-4 2 5z"
                  clipRule="evenodd"
                />
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
            className="w-full h-full object-contain bg-gray-900"
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
          className={`relative bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg shadow-md p-6 flex flex-col items-center justify-center ${heightClass}`}
        >
          <div className="mb-4">
            <svg
              className="w-12 h-12 text-emerald-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 12c0-2.21-.896-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 12a5.983 5.983 0 01-.757 2.829 1 1 0 11-1.415-1.414A3.987 3.987 0 0013 12a3.987 3.987 0 00-.172-1.415 1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <audio controls ref={audioRef} className="w-full" preload="metadata">
            <source src={media.url} type="audio/mp3" />
            <source src={media.url} type="audio/wav" />
            <source src={media.url} type="audio/ogg" />
            Trình duyệt của bạn không hỗ trợ audio.
          </audio>
          <p className="text-sm text-gray-600 mt-2 text-center">
            Audio giải thích {index + 1}
          </p>
        </div>
      );
    }

    return null;
  };

  const renderMedia = () => {
    if (!hasMedia) return null;

    // Tách loại media
    const firstAudio = safeMedia.find(media => media.type === "audio");
    const images = safeMedia.filter(media => media.type === "image");
    const videos = safeMedia.filter(media => media.type === "video");

    // Nếu không có audio, ảnh, video thì không hiển thị gì
    if (!firstAudio && images.length === 0 && videos.length === 0) return null;

    return (
      <div className="mb-6">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-700 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-blue-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
            Tài liệu giải thích
          </h3>
        </div>

        <div className="grid gap-3 sm:gap-4 grid-cols-1">
          {firstAudio && renderMediaItem(firstAudio, 0)}
        </div>

        <div
          className={`grid gap-3 sm:gap-4 ${getGridLayout(
            images.length + videos.length
          )}`}
        >
          {images.map((media, index) => renderMediaItem(media, index))}
          {videos.map((media, index) =>
            renderMediaItem(media, index + images.length)
          )}
        </div>

        {originalMediaCount > 4 && (
          <div className="mt-3 text-center">
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Hiển thị{" "}
              {Math.min(originalMediaCount, 1 + images.length + videos.length)}/
              {originalMediaCount} tài liệu giải thích
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
            alt={`Answer Media ${selectedMediaIndex + 1}`}
            className="max-w-full max-h-full object-contain rounded-lg"
          />
          <button
            onClick={() => setSelectedMediaIndex(null)}
            className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="p-6 bg-white rounded-lg shadow-md border transition-all duration-300">
        <div className="flex items-center mb-6">
          <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full mr-3">
            <svg
              className="w-5 h-5 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            Đáp án đúng:{" "}
            <span className="text-green-600 font-bold">{correctAnswer}</span>
          </h2>
        </div>

        {hasMedia && renderMedia()}
      </div>
      {renderImageModal()}
    </>
  );
};

export default AnswerContent;
