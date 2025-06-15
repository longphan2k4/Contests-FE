import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MediaUploader from './MediaUploader';

interface MediaUploaderDialogProps {
  open: boolean;
  onClose: () => void;
  questionId: number;
  onUpload: (questionId: number, mediaType: 'questionMedia' | 'mediaAnswer', files: File[]) => Promise<unknown>;
  isLoading?: boolean;
}

const MediaUploaderDialog: React.FC<MediaUploaderDialogProps> = ({
  open,
  onClose,
  questionId,
  onUpload,
  isLoading = false,
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pr: 1
      }}>
        Tải lên media cho câu hỏi
        <IconButton 
          aria-label="close" 
          onClick={onClose} 
          sx={{ 
            color: (theme) => theme.palette.grey[500],
            '&:hover': {
              color: (theme) => theme.palette.grey[700],
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <MediaUploader
          questionId={questionId}
          onUpload={onUpload}
          isLoading={isLoading}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MediaUploaderDialog; 