import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface OnlineControlSocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

const OnlineControlSocketContext = createContext<
  OnlineControlSocketContextType | undefined
>(undefined);

interface OnlineControlSocketProviderProps {
  children: React.ReactNode;
}

export const OnlineControlSocketProvider: React.FC<
  OnlineControlSocketProviderProps
> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = () => {
    if (socket?.connected) {
      console.log("🔌 [ONLINE-CONTROL] Socket đã kết nối rồi");
      return;
    }

    // Kiểm tra và sử dụng fallback cho backend URL
    const backendUrl =
      import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
    console.log("🔍 [ONLINE-CONTROL] Backend URL:", backendUrl);

    console.log(
      "🔌 [ONLINE-CONTROL] Đang kết nối tới namespace /online-control..."
    );

    const newSocket = io(`${backendUrl}/online-control`, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      autoConnect: true,
    });

    newSocket.on("connect", () => {
      console.log(
        "✅ [ONLINE-CONTROL] Đã kết nối thành công tới namespace /online-control"
      );
      console.log("🔌 [ONLINE-CONTROL] Socket ID:", newSocket.id);
      setIsConnected(true);
    });

    newSocket.on("disconnect", (reason) => {
      console.log(
        "❌ [ONLINE-CONTROL] Ngắt kết nối khỏi namespace /online-control:",
        reason
      );
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error(
        "💥 [ONLINE-CONTROL] Lỗi kết nối tới namespace /online-control:",
        error
      );
      setIsConnected(false);
    });

    setSocket(newSocket);
  };

  const disconnect = () => {
    if (socket) {
      console.log(
        "🔌 [ONLINE-CONTROL] Đang ngắt kết nối khỏi namespace /online-control..."
      );
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
  };

  useEffect(() => {
    // Tự động kết nối khi component mount
    connect();

    // Cleanup khi component unmount
    return () => {
      disconnect();
    };
  }, []);

  const value: OnlineControlSocketContextType = {
    socket,
    isConnected,
    connect,
    disconnect,
  };

  return (
    <OnlineControlSocketContext.Provider value={value}>
      {children}
    </OnlineControlSocketContext.Provider>
  );
};

export const useOnlineControlSocket = (): OnlineControlSocketContextType => {
  const context = useContext(OnlineControlSocketContext);
  if (context === undefined) {
    throw new Error(
      "useOnlineControlSocket must be used within an OnlineControlSocketProvider"
    );
  }
  return context;
};
