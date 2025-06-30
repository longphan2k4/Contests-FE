import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

import { useParams } from "react-router-dom";

interface SocketContextProps {
  socket: Socket | null;
  isConnected: boolean;
}

// Tạo Context mặc định
const SocketContext = createContext<SocketContextProps>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { match } = useParams();

  useEffect(() => {
    const socketInstance = io(`${SOCKET_URL}/match-control`, {
      withCredentials: true,
    });

    socketInstance.on("connect", () => {
      console.log("✅ Socket connected");
      socketInstance.emit("joinMatchRoom", match);
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
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
