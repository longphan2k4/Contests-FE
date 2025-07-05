import React from "react";
import { Box, Typography } from "@mui/material";
import { ZoomIn, PlayArrow, VolumeUp } from "@mui/icons-material";
import { PhotoIcon } from "@heroicons/react/24/outline";

interface MediaData {
  id: string;
  type: "image" | "video" | "audio";
  url: string;
  thumbnail?: string;
  title?: string;
  description?: string;
}

interface MediaGridProps {
  mediaList: MediaData[];
  onMediaClick: (media: MediaData) => void;
  currentQuestionMediaCount?: number;
}

const MediaGrid: React.FC<MediaGridProps> = ({
  mediaList,
  onMediaClick,
  currentQuestionMediaCount,
}) => {
  if (!mediaList || mediaList.length === 0) return null;

  const getGridLayout = (count: number) => {
    // Tối ưu cho mobile: luôn 1 cột trên mobile, 2 cột trên tablet+
    switch (count) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-1 sm:grid-cols-2";
      case 3:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
      case 4:
      default:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4";
    }
  };

  const renderMediaItem = (media: MediaData, index: number) => {
    const commonClasses =
      "relative cursor-pointer rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-all duration-200 group active:scale-95";

    return (
      <Box
        key={media.id}
        className={commonClasses}
        onClick={() => onMediaClick(media)}
        sx={{ touchAction: "manipulation" }} // Tối ưu cho touch
      >
        {/* Overlay với icon - larger cho mobile */}
        <Box className="absolute inset-0  bg-opacity-50 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-200 z-10 flex items-center justify-center">
          <Box className="flex flex-col items-center text-white">
            {media.type === "image" && <ZoomIn className="text-4xl mb-2" />}
            {media.type === "video" && <PlayArrow className="text-4xl mb-2" />}
            {media.type === "audio" && <VolumeUp className="text-4xl mb-2" />}
            <Typography
              variant="body2"
              className="text-center px-2 font-medium"
            >
              {media.type === "image" && "Xem ảnh"}
              {media.type === "video" && "Phát video"}
              {media.type === "audio" && "Nghe audio"}
            </Typography>
          </Box>
        </Box>

        {/* Media content - responsive height */}
        {media.type === "image" && (
          <>
            <div className="flex justify-center items-center w-full h-64 rounded-xl overflow-hidden bg-white">
              <img
                src={media.url}
                alt={media.title || `Media ${index + 1}`}
                className="max-w-full h-full object-contain object-center bg-white"
                onClick={() => onMediaClick(media)}
              />
              {/* Icon góc phải */}
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                <PhotoIcon className="w-4 h-4 text-gray-600" />
              </div>
              {/* Counter nếu có nhiều ảnh */}
              {currentQuestionMediaCount && currentQuestionMediaCount > 1 && (
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                  <span className="text-xs font-medium text-gray-700">
                    {index + 1}/{currentQuestionMediaCount}
                  </span>
                </div>
              )}
            </div>
          </>
        )}

        {media.type === "video" && (
          <Box className="relative">
            <video
              src={media.url}
              poster={media.thumbnail}
              className="w-full h-32 xs:h-36 sm:h-40 md:h-44 object-cover"
              muted
              preload="metadata"
            />
            <Box className="absolute inset-0 flex items-center justify-center">
              <PlayArrow className="text-white text-5xl bg-black bg-opacity-60 rounded-full p-3" />
            </Box>
          </Box>
        )}

        {media.type === "audio" && (
          <Box className="h-32 xs:h-36 sm:h-40 md:h-44 bg-gradient-to-br from-purple-400 to-purple-600 flex flex-col items-center justify-center text-white">
            <VolumeUp className="text-5xl mb-3" />
            <Typography
              variant="body2"
              className="text-center px-3 font-medium"
            >
              {media.title || "File âm thanh"}
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box className="space-y-3">
      <Box
        className={`grid gap-3 ${getGridLayout(mediaList.slice(0, 4).length)}`}
      >
        {mediaList
          .slice(0, 4)
          .map((media, index) => renderMediaItem(media, index))}
      </Box>
      {mediaList.length > 4 && (
        <Typography variant="caption" className="text-gray-500 italic">
          * Hiển thị 4/{mediaList.length} media đầu tiên
        </Typography>
      )}
    </Box>
  );
};

export default MediaGrid;
