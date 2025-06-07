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
import type { School } from '../types/school';
import type { ValidationError } from '../types/validation';
import SchoolForm from './SchoolForm';
import { useNotification } from '../../../../contexts/NotificationContext';
import { updateSchool } from '../services/schoolService';
import type { AxiosError } from 'axios';

interface EditSchoolDialogProps {
  school: School;
  open: boolean;
  onClose: () => void;
  onUpdated: (updatedSchool: School) => void;
}

const EditSchoolDialog: React.FC<EditSchoolDialogProps> = ({ 
  school, 
  open, 
  onClose,
  onUpdated
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const { showSuccessNotification, showErrorNotification } = useNotification();

  const handleSubmit = async (data: Partial<School>) => {
    if (!school.id) return;
    
    setIsSubmitting(true);
    setValidationErrors([]);
    
    try {
      const updatedSchool = await updateSchool(school.id, data);
      showSuccessNotification('Thông tin trường học đã được cập nhật', 'Cập nhật thành công');
      onUpdated(updatedSchool);
      onClose();
    } catch (error) {
      console.error('Error updating school:', error);
      
      const axiosError = error as AxiosError<{ error: { details: ValidationError[] }, message: string }>;
      
      if (axiosError.response?.data?.error?.details) {
        setValidationErrors(axiosError.response.data.error.details);
      } else {
        showErrorNotification(
          axiosError.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trường học', 
          'Lỗi cập nhật'
        );
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
      <DialogTitle sx={{ m: 0, p: 2, bgcolor: 'secondary.main', color: 'white' }}>
        <Typography component="span" variant="h6">
          Chỉnh sửa thông tin trường học
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
        
        <SchoolForm
          initialData={school}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitButtonText="Cập nhật"
          validationErrors={validationErrors}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditSchoolDialog; 