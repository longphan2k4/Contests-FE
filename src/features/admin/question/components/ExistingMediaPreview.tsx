import React from 'react';
import { Box, IconButton, Typography, Dialog, DialogContent } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
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
  const [openDialog, setOpenDialog] = React.useState(false);
  const [videoThumbnail, setVideoThumbnail] = React.useState<string>('');

  // Tạo thumbnail cho video
  React.useEffect(() => {
    if (media.type.startsWith('video/')) {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous'; // Thêm crossOrigin để tránh lỗi CORS
      video.preload = 'metadata';
      video.src = media.url;
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
  }, [media.url, media.type]);

  console.log('Rendering media preview:', media);

  const getFileIcon = () => {
    console.log('Getting file icon for type:', media.type);
    if (media.type.startsWith('image/')) {
      return <ImageIcon />;
    } else if (media.type.startsWith('video/')) {
      return <VideoLibraryIcon />;
    } else if (media.type.startsWith('audio/')) {
      return <AudioFileIcon />;
    }
    return <DescriptionIcon />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return 'Không xác định';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderThumbnail = () => {
    console.log('Rendering thumbnail for media:', media);
    if (media.type.startsWith('image/')) {
      console.log('Rendering image thumbnail with URL:', media.url);
      return (
        <Box
          component="img"
          src={media.url}
          alt={media.name}
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
            console.log('Failed image URL:', media.url);
          }}
        />
      );
    } else if (media.type.startsWith('video/')) {
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
              alt={media.name}
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
    } else if (media.type.startsWith('audio/')) {
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
    if (media.type.startsWith('image/')) {
      return (
        <Box
          component="img"
          src={media.url}
          alt={media.name}
          sx={{
            maxWidth: '100%',
            maxHeight: '80vh',
            objectFit: 'contain',
          }}
        />
      );
    } else if (media.type.startsWith('video/')) {
      return (
        <Box
          component="video"
          src={media.url}
          controls
          sx={{
            maxWidth: '100%',
            maxHeight: '80vh',
          }}
        />
      );
    } else if (media.type.startsWith('audio/')) {
      return (
        <Box
          component="audio"
          src={media.url}
          controls
          sx={{
            width: '100%',
          }}
        />
      );
    }
    return (
      <Box
        sx={{
          p: 3,
          bgcolor: 'background.paper',
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        {getFileIcon()}
        <Typography variant="body1">{media.name}</Typography>
      </Box>
    );
  };

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          width: 100,
          height: 100,
          mb: 2,
          mr: 2,
        }}
      >
        {renderThumbnail()}
        <IconButton
          onClick={onRemove}
          sx={{
            position: 'absolute',
            top: -8,
            right: -8,
            bgcolor: 'error.main',
            color: 'white',
            width: 24,
            height: 24,
            '&:hover': {
              bgcolor: 'error.dark',
            },
          }}
        >
          <DeleteIcon sx={{ fontSize: 16 }} />
        </IconButton>
        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            bottom: -20,
            left: 0,
            right: 0,
            textAlign: 'center',
            color: 'text.secondary',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {media.name}
          <br />
          {formatFileSize(media.size)}
        </Typography>
      </Box>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
          }
        }}
      >
        <DialogContent 
          sx={{ 
            position: 'relative', 
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            overflow: 'auto'
          }}
        >
          <IconButton
            onClick={() => setOpenDialog(false)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.7)',
              },
              zIndex: 1
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              minHeight: '50vh'
            }}
          >
            {renderFullPreview()}
          </Box>
          <Typography
            variant="body2"
            sx={{
              mt: 2,
              textAlign: 'center',
              color: 'text.secondary',
            }}
          >
            {media.name} ({formatFileSize(media.size)})
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExistingMediaPreview; 