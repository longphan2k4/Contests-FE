import React from 'react';
import { Snackbar, Alert, AlertTitle } from '@mui/material';
import type { AlertColor } from '@mui/material';

export interface NotificationProps {
  open: boolean;
  onClose: () => void;
  severity: AlertColor; // 'error' | 'warning' | 'info' | 'success'
  title?: string;
  message: string;
  autoHideDuration?: number;
  vertical?: 'top' | 'bottom';
  horizontal?: 'left' | 'center' | 'right';
}

/**
 * Component hiển thị thông báo dạng Snackbar
 * Sử dụng để hiển thị thông báo thành công, lỗi, cảnh báo...
 */
const NotificationSnackbar: React.FC<NotificationProps> = ({
  open,
  onClose,
  severity,
  title,
  message,
  autoHideDuration = 3000,
  vertical = 'top',
  horizontal = 'right',
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical, horizontal }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        elevation={6}
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </Alert>
    </Snackbar>
  );
};

export default NotificationSnackbar; 