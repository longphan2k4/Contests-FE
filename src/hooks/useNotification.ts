import { useState, useCallback } from 'react';
import type { AlertColor } from '@mui/material';

interface NotificationState {
  open: boolean;
  message: string;
  severity: AlertColor;
  title?: string;
}

interface UseNotificationReturn {
  notificationState: NotificationState;
  showNotification: (message: string, severity?: AlertColor, title?: string) => void;
  showSuccessNotification: (message: string, title?: string) => void;
  showErrorNotification: (message: string, title?: string) => void;
  showWarningNotification: (message: string, title?: string) => void;
  showInfoNotification: (message: string, title?: string) => void;
  hideNotification: () => void;
}

/**
 * Hook để quản lý thông báo
 * @returns Các hàm và state để quản lý thông báo
 */
export const useNotification = (): UseNotificationReturn => {
  const [notificationState, setNotificationState] = useState<NotificationState>({
    open: false,
    message: '',
    severity: 'info'
  });

  const showNotification = useCallback((
    message: string,
    severity: AlertColor = 'info',
    title?: string
  ) => {
    setNotificationState({
      open: true,
      message,
      severity,
      title
    });
  }, []);

  const showSuccessNotification = useCallback((message: string, title = 'Thành công') => {
    showNotification(message, 'success', title);
  }, [showNotification]);

  const showErrorNotification = useCallback((message: string, title = 'Lỗi') => {
    showNotification(message, 'error', title);
  }, [showNotification]);

  const showWarningNotification = useCallback((message: string, title = 'Cảnh báo') => {
    showNotification(message, 'warning', title);
  }, [showNotification]);

  const showInfoNotification = useCallback((message: string, title = 'Thông tin') => {
    showNotification(message, 'info', title);
  }, [showNotification]);

  const hideNotification = useCallback(() => {
    setNotificationState(prev => ({
      ...prev,
      open: false
    }));
  }, []);

  return {
    notificationState,
    showNotification,
    showSuccessNotification,
    showErrorNotification,
    showWarningNotification,
    showInfoNotification,
    hideNotification
  };
};

export default useNotification; 