import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent,
  IconButton,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContestForm from './ContestForm';
import { updateContest } from '../services/contestsService';
import { useToast } from '../../../../contexts/toastContext';
import type { Contest } from '../types';
import { AxiosError } from 'axios';

interface ValidationError {
  field: string;
  message: string;
}

interface EditContestDialogProps {
  contest: Contest;
  open: boolean;
  onClose: () => void;
  onUpdated: (updatedContest: Contest) => void;
}

const EditContestDialog: React.FC<EditContestDialogProps> = ({ 
  contest, 
  open, 
  onClose, 
  onUpdated 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const { showToast } = useToast();

  const handleSubmit = async (data: Partial<Contest>) => {
    if (!contest.id) return;
    
    setIsSubmitting(true);
    setValidationErrors([]);
    
    try {
      const contestData = {
        name: data.name,
        description: data.description,
        location: data.location,
        slogan: data.slogan,
        startTime: data.startTime,
        endTime: data.endTime,
        isActive: data.isActive,
        rule: data.rule
      };
      
      const result = await updateContest(contest.id, contestData);
      if (result.success ) {
        const updatedContest = result.data;
        onUpdated(updatedContest);
        onClose();
      } else {
        showToast(result.message || 'Có lỗi xảy ra khi cập nhật cuộc thi', 'error');
      }
    } catch (error) {
      console.error('Error updating contest:', error);
      
      if (error instanceof AxiosError && error.response?.data?.error?.details) {
        setValidationErrors(error.response.data.error.details);
        showToast('Vui lòng kiểm tra lại thông tin nhập liệu', 'error');
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi cập nhật cuộc thi';
        showToast(errorMessage, 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog 
      open={open}
      onClose={isSubmitting ? undefined : onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ m: 0, p: 2, bgcolor: 'primary.main', color: 'white' }}>
        <Typography component="span" variant="h6">
          Chỉnh sửa cuộc thi
        </Typography>
        {!isSubmitting && (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white'
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent dividers sx={{ p: 3 }}>
        {isSubmitting && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(255, 255, 255, 0.7)',
            zIndex: 1
          }}>
            <CircularProgress />
          </Box>
        )}
        
        <ContestForm
          initialData={contest}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitButtonText="Cập nhật"
          validationErrors={validationErrors}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditContestDialog; 