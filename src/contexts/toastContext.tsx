import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface Toast {
  id: string;
  type: "success" | "warning" | "error" | "info";
  message: string;
  progress: number;
}

interface ToastContextType {
  showToast: (
    message: string,
    type?: "success" | "warning" | "error" | "info"
  ) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (
    message: string,
    type: "success" | "warning" | "error" | "info" = "success"
  ) => {
    const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newToast: Toast = {
      id: uniqueId,
      type,
      message,
      progress: 100,
    };
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      removeToast(uniqueId);
    }, 3000); // Tự động ẩn sau 3 giây
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  useEffect(() => {
    const updateProgress = () => {
      setToasts(prev => {
        const updatedToasts = prev
          .map(toast => {
            const newProgress = Math.max(toast.progress - 0.5, 0);
            return { ...toast, progress: newProgress };
          })
          .filter(toast => toast.progress > 0);

        return updatedToasts;
      });

      if (toasts.length > 0) {
        setTimeout(updateProgress, 30); // Cập nhật tiến trình
      }
    };

    updateProgress();

    return () => {
      setToasts([]);
    };
  }, []);

  const getIcon = (type: "success" | "warning" | "error" | "info") => {
    switch (type) {
      case "success":
        return <CheckCircleIcon className="w-5 h-5" />;
      case "warning":
        return <ExclamationCircleIcon className="w-5 h-5" />;
      case "error":
        return <XMarkIcon className="w-5 h-5" />;
      case "info":
      default:
        return <InformationCircleIcon className="w-5 h-5" />;
    }
  };

  const getBgColor = (type: "success" | "warning" | "error" | "info") => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
      case "info":
      default:
        return "bg-blue-500";
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-23 right-4 z-100 flex flex-col gap-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`relative overflow-hidden ${getBgColor(
              toast.type
            )} text-white rounded-lg shadow-xl flex items-center gap-3 p-4 pr-10 w-80`}
          >
            <div
              className="absolute top-0 left-0 h-1 bg-white"
              style={{
                width: `${toast.progress}%`,
                transition: "width 0.1s linear",
              }}
            />
            <div className="p-2 rounded-full bg-white/20">
              {getIcon(toast.type)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="absolute top-2 right-2 text-white/70 hover:text-white"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
