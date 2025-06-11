import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import type { AlertColor } from "@mui/material";

interface NotificationState {
  open: boolean;
  message: string;
  severity: AlertColor;
  title?: string;
}

interface NotificationContextType {
  notificationState: NotificationState;
  showNotification: (
    message: string,
    severity?: AlertColor,
    title?: string,
    duration?: number
  ) => void;
  showSuccessNotification: (
    message: string,
    title?: string,
    duration?: number
  ) => void;
  showErrorNotification: (
    message: string,
    title?: string,
    duration?: number
  ) => void;
  showWarningNotification: (
    message: string,
    title?: string,
    duration?: number
  ) => void;
  showInfoNotification: (
    message: string,
    title?: string,
    duration?: number
  ) => void;
  hideNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

const DEFAULT_DURATION = 3000; // 3 giây

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notificationState, setNotificationState] = useState<NotificationState>(
    {
      open: false,
      message: "",
      severity: "info",
    }
  );

  // Lưu id của timer hiện tại để có thể huỷ khi cần
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideNotification = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setNotificationState(prev => ({ ...prev, open: false }));
  }, []);

  const showNotification = useCallback(
    (
      message: string,
      severity: AlertColor = "info",
      title?: string,
      duration: number = DEFAULT_DURATION
    ) => {
      // Huỷ timer cũ (nếu có)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Hiện thông báo
      setNotificationState({
        open: true,
        message,
        severity,
        title,
      });

      // Tự ẩn sau "duration" ms (nếu duration > 0)
      if (duration > 0) {
        timeoutRef.current = setTimeout(() => {
          hideNotification();
        }, duration);
      }
    },
    [hideNotification]
  );

  // Wrapper theo từng mức độ
  const showSuccessNotification = useCallback(
    (message: string, title = "Thành công", duration?: number) =>
      showNotification(message, "success", title, duration),
    [showNotification]
  );

  const showErrorNotification = useCallback(
    (message: string, title = "Lỗi", duration?: number) =>
      showNotification(message, "error", title, duration),
    [showNotification]
  );

  const showWarningNotification = useCallback(
    (message: string, title = "Cảnh báo", duration?: number) =>
      showNotification(message, "warning", title, duration),
    [showNotification]
  );

  const showInfoNotification = useCallback(
    (message: string, title = "Thông tin", duration?: number) =>
      showNotification(message, "info", title, duration),
    [showNotification]
  );

  const value: NotificationContextType = {
    notificationState,
    showNotification,
    showSuccessNotification,
    showErrorNotification,
    showWarningNotification,
    showInfoNotification,
    hideNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
