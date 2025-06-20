// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Notification from "./components/Notification";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ToastProvider } from "./contexts/toastContext";
import { AuthProvider } from "./features/auth/hooks/authContext";

// ✅ Cấu hình QueryClient để giảm background requests trong dev
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Tắt refetch khi focus window
      refetchOnMount: false, // Tắt refetch khi mount lại
      refetchOnReconnect: false, // Tắt refetch khi reconnect
      retry: false, // Tắt retry để tránh duplicate requests
      staleTime: 5 * 60 * 1000, // Cache 5 phút
    },
  },
});

createRoot(document.getElementById("root")!).render(
  // Tạm thời tắt StrictMode để test performance chính xác
  // <StrictMode>
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <Notification />
        <ToastProvider>
          <AuthProvider>
            {" "}
            <App />
          </AuthProvider>
        </ToastProvider>
      </NotificationProvider>
    </QueryClientProvider>
  </BrowserRouter>
  // </StrictMode>
);
