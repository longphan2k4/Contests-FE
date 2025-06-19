import React from 'react';
import { Box, IconButton, Typography, Dialog, DialogContent } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import DescriptionIcon from '@mui/icons-material/Description';
import CloseIcon from '@mui/icons-material/Close';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

interface MediaFilePreview {
  id: string;
  url: string;
  name: string;
  type: string;
  size: number;
}

interface ExistingMediaPreviewProps {
  media: MediaFilePreview;
  onRemove: () => void;
}

const ExistingMediaPreview: React.FC<ExistingMediaPreviewProps> = ({ media, onRemove }) => {
  // Đảm bảo media luôn có một ID hợp lệ và không trống
  const safeMedia = {
    ...media,
    id: media.id || `media-${media.name}-${Date.now()}-${Math.random().toString(36).substring(2, 10)}` // Tạo ID duy nhất nếu ID trống
  };
  
  const [openDialog, setOpenDialog] = React.useState(false);
  const [videoThumbnail, setVideoThumbnail] = React.useState<string>('');

  // Tạo thumbnail cho video
  React.useEffect(() => {
    if (safeMedia.type.startsWith('video/')) {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous'; // Thêm crossOrigin để tránh lỗi CORS
      video.preload = 'metadata';
      video.src = safeMedia.url;
      video.muted = true;
      
      const handleCanPlay = () => {
        video.currentTime = 0;
      };

      const handleSeeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          setVideoThumbnail(canvas.toDataURL());
        }
        // Cleanup
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('seeked', handleSeeked);
      };

      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('seeked', handleSeeked);

      // Cleanup function
      return () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('seeked', handleSeeked);
        video.src = '';
      };
    }
  }, [safeMedia.url, safeMedia.type]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return 'Không xác định';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderThumbnail = () => {
    if (safeMedia.type.startsWith('image/')) {
      return (
        <Box
          component="img"
          src={safeMedia.url}
          alt={safeMedia.name}
          sx={{
            width: 100,
            height: 100,
            objectFit: 'cover',
            borderRadius: 1,
            cursor: 'pointer',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
          onClick={() => setOpenDialog(true)}
          onError={(e) => {
            console.error('Error loading image:', e);
          }}
        />
      );
    } else if (safeMedia.type.startsWith('video/')) {
      return (
        <Box
          sx={{
            width: 100,
            height: 100,
            position: 'relative',
            cursor: 'pointer',
            '&:hover': {
              '& .play-icon': {
                opacity: 1,
              },
            },
          }}
          onClick={() => setOpenDialog(true)}
        >
          {videoThumbnail ? (
            <Box
              component="img"
              src={videoThumbnail}
              alt={safeMedia.name}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: 1,
              }}
            />
          ) : (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                bgcolor: 'background.paper',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <VideoLibraryIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            </Box>
          )}
          <PlayCircleIcon
            className="play-icon"
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: 40,
              color: 'white',
              opacity: 0.7,
              transition: 'opacity 0.2s',
              filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.5))',
            }}
          />
        </Box>
      );
    } else if (safeMedia.type.startsWith('audio/')) {
      return (
        <Box
          sx={{
            width: 100,
            height: 100,
            bgcolor: 'background.paper',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
          onClick={() => setOpenDialog(true)}
        >
          <AudioFileIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        </Box>
      );
    }
    return (
      <Box
        sx={{
          width: 100,
          height: 100,
          bgcolor: 'background.paper',
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
        onClick={() => setOpenDialog(true)}
      >
        <DescriptionIcon sx={{ fontSize: 40, color: 'primary.main' }} />
      </Box>
    );
  };

  const renderFullPreview = () => {
    if (safeMedia.type.startsWith('image/')) {
      return (
        <Box
          component="img"
          src={safeMedia.url}
          alt={safeMedia.name}
          sx={{
            maxWidth: '100%',
            maxHeight: '80vh',
            objectFit: 'contain',
          }}
        />
      );
    } else if (safeMedia.type.startsWith('video/')) {
      return (
        <Box
          component="video"
          src={safeMedia.url}
          controls
          sx={{
            maxWidth: '100%',
            maxHeight: '80vh',
          }}
        />
      );
    } else if (safeMedia.type.startsWith('audio/')) {
      return (
        <Box
          component="audio"
          src={safeMedia.url}
          controls
          sx={{
            width: '100%',
          }}
        />
      );
    }
    return (
      <Typography>
        Không thể hiển thị nội dung này
      </Typography>
    );
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: 'fit-content',
        '&:hover .delete-button': {
          opacity: 1,
        },
      }}
    >
      {renderThumbnail()}
      
      <IconButton
        className="delete-button"
        onClick={onRemove}
        sx={{
          position: 'absolute',
          top: -8,
          right: -8,
          bgcolor: 'error.main',
          color: 'white',
          opacity: 0,
          transition: 'opacity 0.2s',
          '&:hover': {
            bgcolor: 'error.dark',
          },
          width: 24,
          height: 24,
          '& .MuiSvgIcon-root': {
            fontSize: 16,
          },
        }}
      >
        <DeleteIcon />
      </IconButton>
      
      <Typography
        variant="caption"
        sx={{
          display: 'block',
          maxWidth: 100,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          mt: 0.5,
        }}
        title={safeMedia.name}
      >
        {safeMedia.name}
      </Typography>
      
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          display: 'block',
        }}
      >
        {formatFileSize(safeMedia.size)}
      </Typography>
      
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ position: 'relative', p: 2 }}>
          <IconButton
            onClick={() => setOpenDialog(false)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'background.paper',
              boxShadow: 1,
              zIndex: 1,
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              py: 2,
            }}
          >
            {renderFullPreview()}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ExistingMediaPreview; 