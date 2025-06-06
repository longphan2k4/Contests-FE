import  { useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SchoolForm from './SchoolForm';
import { useCreateSchool } from '../hooks';
import type { School } from '../types/school';
import { useNotification } from '../../../../hooks';
import  NotificationSnackbar  from '../../components/NotificationSnackbar';

interface CreateSchoolDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

const CreateSchoolDialog = ({ open, onClose, onCreated }: CreateSchoolDialogProps) => {
  const { create, loading, error, validationErrors } = useCreateSchool();
  const {
    notificationState,
    showErrorNotification,
    showSuccessNotification,
    hideNotification
  } = useNotification();

  // Hiển thị lỗi chung nếu có và không phải lỗi validation
  useEffect(() => {
    if (error && (!validationErrors || validationErrors.length === 0)) {
      showErrorNotification(error);
    }
  }, [error, validationErrors, showErrorNotification]);

  const handleSubmit = async (data: Partial<School>) => {
    try {
      const result = await create(data);
      if (result) {
        showSuccessNotification('Tạo mới trường học thành công');
        if (onCreated) {
          onCreated();
        }
        // Đóng dialog sau một khoảng thời gian để người dùng đọc thông báo thành công
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch {
      // Lỗi đã được xử lý bởi hook useCreateSchool và useEffect
    }
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={loading ? undefined : onClose} 
        maxWidth="md" 
        fullWidth
        scroll="paper"
      >
        <DialogTitle>
          Thêm trường học mới
          {!loading && (
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
        <DialogContent dividers>
          <SchoolForm 
            onSubmit={handleSubmit} 
            isSubmitting={loading}
            submitButtonText="Tạo mới"
            validationErrors={validationErrors}
          />
        </DialogContent>
      </Dialog>

      <NotificationSnackbar 
        open={notificationState.open}
        onClose={hideNotification}
        severity={notificationState.severity}
        title={notificationState.title}
        message={notificationState.message}
      />
    </>
  );
};

export default CreateSchoolDialog;