import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextProps {
  socket: Socket | null;
  isConnected: boolean;
}

// Tạo Context mặc định
const SocketContext = createContext<SocketContextProps>({
  socket: null,
  isConnected: false,
});

// Custom hook để dùng trong các component
export const useSocket = () => useContext(SocketContext);

// Tham số từ môi trường
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";
const MATCH_ID = 123; // Có thể nhận từ props/context khác sau này

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = io(`${SOCKET_URL}/match-control`, {
      withCredentials: true,
    });

    socketInstance.on("connect", () => {
      console.log("✅ Socket connected");
      socketInstance.emit("joinMatchRoom", MATCH_ID, (res: any) => {
        console.log("📥 Joined room:", res);
      });
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      setIsConnected(false);
    });

    socketRef.current = socketInstance;

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
