import React from 'react';
import { Box, IconButton, Typography, Dialog, DialogContent } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import DescriptionIcon from '@mui/icons-material/Description';
import CloseIcon from '@mui/icons-material/Close';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

interface MediaPreviewProps {
  file: File;
  onRemove: () => void;
}

const MediaPreview: React.FC<MediaPreviewProps> = ({ file, onRemove }) => {
  const [previewUrl, setPreviewUrl] = React.useState<string>('');
  const [videoThumbnail, setVideoThumbnail] = React.useState<string>('');
  const [openDialog, setOpenDialog] = React.useState(false);

  React.useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Tạo thumbnail cho video
    if (file.type.startsWith('video/')) {
      const video = document.createElement('video');
      video.src = objectUrl;
      video.currentTime = 1; // Lấy frame ở giây thứ 1
      video.onloadeddata = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const thumbnailUrl = canvas.toDataURL();
          setVideoThumbnail(thumbnailUrl);
        }
      };
    }

    return () => {
      URL.revokeObjectURL(objectUrl);
      // Không cần revoke videoThumbnail vì nó là data URL
    };
  }, [file]);

  const getFileIcon = () => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon />;
    } else if (file.type.startsWith('video/')) {
      return <VideoLibraryIcon />;
    } else if (file.type.startsWith('audio/')) {
      return <AudioFileIcon />;
    }
    return <DescriptionIcon />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderThumbnail = () => {
    if (file.type.startsWith('image/')) {
      return (
        <Box
          component="img"
          src={previewUrl}
          alt={file.name}
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
        />
      );
    } else if (file.type.startsWith('video/')) {
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
              alt={file.name}
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
    } else if (file.type.startsWith('audio/')) {
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
    if (file.type.startsWith('image/')) {
      return (
        <Box
          component="img"
          src={previewUrl}
          alt={file.name}
          sx={{
            maxWidth: '100%',
            maxHeight: '80vh',
            objectFit: 'contain',
          }}
        />
      );
    } else if (file.type.startsWith('video/')) {
      return (
        <Box
          component="video"
          src={previewUrl}
          controls
          sx={{
            maxWidth: '100%',
            maxHeight: '80vh',
          }}
        />
      );
    } else if (file.type.startsWith('audio/')) {
      return (
        <Box
          component="audio"
          src={previewUrl}
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
        <Typography variant="body1">{file.name}</Typography>
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
          {file.name}
          <br />
          {formatFileSize(file.size)}
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
            {file.name} ({formatFileSize(file.size)})
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MediaPreview; 