import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketResponse {
  success: boolean;
  message: string;
  roomSize?: number;
  matchId?: number;
  roomName?: string;
}

interface StudentSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  joinMatchRoom: (matchId: number) => void;
  leaveMatchRoom: (matchSlug: string) => void;
  joinMatchForAnswering: (matchSlug: string, callback?: (response: SocketResponse) => void) => void;
}

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

export const useStudentSocket = (): StudentSocketReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Chỉ kết nối đến namespace /student - không cần match-control cho student
    const studentSocket = io(`${SOCKET_URL}/student`, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Student namespace events
    studentSocket.on('connect', () => {
      console.log('✅ [FE] Đã kết nối thành công tới namespace /student:', studentSocket.id);
      console.log('🔍 [FE] Student socket sẵn sàng nhận events');
      setIsConnected(true);
    });

    studentSocket.on('disconnect', (reason) => {
      console.log('❌ [FE] Mất kết nối tới namespace /student. Lý do:', reason);
      setIsConnected(false);
    });

    studentSocket.on('connect_error', (error) => {
      console.error('🚫 [FE] Lỗi kết nối tới namespace /student:', error);
      console.error('🚫 [FE] Error message:', error.message);
      console.error('🚫 [FE] Error details:', error);
      setIsConnected(false);
    });

    studentSocket.on('reconnect', (attemptNumber) => {
      console.log('🔄 [FE] Kết nối lại thành công sau', attemptNumber, 'lần thử');
      setIsConnected(true);
    });

    studentSocket.on('reconnect_error', (error) => {
      console.error('🔄 [FE] Lỗi kết nối lại:', error);
    });

    // Authentication error handlers
    studentSocket.on('error', (error) => {
      console.error('🚫 [FE] Lỗi xác thực hoặc lỗi khác từ socket /student:', error);
      setIsConnected(false);
    });

    setSocket(studentSocket);

    // Cleanup on unmount
    return () => {
      studentSocket.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, []);

  const joinMatchRoom = (matchId: number) => {
    if (socket && isConnected) {
      socket.emit('joinMatchRoom', matchId, (response: SocketResponse) => {
        if (response.success) {
          console.log('✅ [FE STUDENT SOCKET] Tham gia phòng student thành công:', response);
        } 
      });
    } 
  };

  const leaveMatchRoom = (matchSlug: string) => {
    if (socket && isConnected) {
      console.log(`🚪 [FE] Rời phòng student cho trận đấu: ${matchSlug}`);
      socket.emit('leaveMatchRoom', matchSlug);
    }
  };

  const joinMatchForAnswering = (matchSlug: string, callback?: (response: SocketResponse) => void) => {
    if (!socket || !isConnected) {
      if (callback) {
        callback({ 
          success: false, 
          message: 'Student socket not connected' 
        });
      }
      return;
    }

    socket.emit('student:joinMatch', { matchSlug }, callback);
  };

  return {
    socket,
    isConnected,
    joinMatchRoom,
    leaveMatchRoom,
    joinMatchForAnswering,
  };
}; 