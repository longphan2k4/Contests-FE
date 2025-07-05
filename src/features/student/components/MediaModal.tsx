import React from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import { Close, VolumeUp } from "@mui/icons-material";

interface MediaData {
  id: string;
  type: "image" | "video" | "audio";
  url: string;
  thumbnail?: string;
  title?: string;
  description?: string;
}

interface MediaModalProps {
  selectedMedia: MediaData | null;
  isOpen: boolean;
  onClose: () => void;
}

const MediaModal: React.FC<MediaModalProps> = ({
  selectedMedia,
  isOpen,
  onClose,
}) => {
  if (!selectedMedia) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      fullScreen // Full screen trên mobile để tối ưu
      PaperProps={{
        className: "m-0 sm:m-2 max-h-screen sm:max-h-[90vh] sm:rounded-lg",
      }}
    >
      <DialogContent className="p-2 sm:p-4 relative h-full flex flex-col">
        {/* Close Button - larger cho mobile */}
        <IconButton
          onClick={onClose}
          className="absolute top-2 right-2 z-10 bg-black bg-opacity-60 text-white hover:bg-opacity-80"
          size="large"
        >
          <Close />
        </IconButton>

        {/* Media Content */}
        <Box className="flex-1 flex flex-col items-center justify-center p-4">
          {selectedMedia.type === "image" && (
            <img
              src={selectedMedia.url}
              alt={selectedMedia.title || "Media"}
              className="max-w-full max-h-full object-contain rounded-lg"
              style={{ maxHeight: "calc(100vh - 150px)" }}
            />
          )}

          {selectedMedia.type === "video" && (
            <video
              src={selectedMedia.url}
              controls
              autoPlay
              playsInline // Quan trọng cho mobile
              className="max-w-full max-h-full rounded-lg"
              style={{ maxHeight: "calc(100vh - 150px)" }}
              poster={selectedMedia.thumbnail}
            />
          )}

          {selectedMedia.type === "audio" && (
            <Box className="w-full max-w-md p-6 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg text-white text-center">
              <VolumeUp className="text-8xl mb-4" />
              <Typography variant="h6" className="mb-4 font-bold">
                {selectedMedia.title || "File âm thanh"}
              </Typography>
              <audio
                src={selectedMedia.url}
                controls
                autoPlay
                className="w-full"
                style={{ minHeight: "40px" }}
              />
            </Box>
          )}
        </Box>

        {/* Media Info - Bottom section */}
        {(selectedMedia.title || selectedMedia.description) && (
          <Box className="bg-gray-50 p-4 rounded-t-lg mt-auto">
            {selectedMedia.title && (
              <Typography variant="h6" className="font-bold text-gray-800 mb-2">
                {selectedMedia.title}
              </Typography>
            )}
            {selectedMedia.description && (
              <Typography variant="body2" className="text-gray-600">
                {selectedMedia.description}
              </Typography>
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MediaModal;
