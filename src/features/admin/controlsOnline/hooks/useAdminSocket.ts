import { useEffect, useCallback, useState } from 'react';
import { useOnlineControlSocket } from '@contexts/OnlineControlSocketContext';
import { useParams } from 'react-router-dom';
import { useMatchInfo } from './useControls'; // 🔥 NEW: Import useMatchInfo hook

// Định nghĩa types cho socket responses
interface SocketResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

// �� NEW: Interface cho join room response
interface JoinRoomResponse {
  success: boolean;
  message: string;
  roomName?: string;
  matchId?: string | number | null;
}

// 🔥 NEW: Interface cho next question response data
interface NextQuestionResponseData {
  currentQuestion: number;
  remainingTime: number;
  defaultTime?: number;
  matchId?: string | number;
  totalQuestions?: number;
}

interface MatchStartData {
  matchId: string;
  currentQuestion: number;
  timeRemaining: number;
  status: 'started' | 'paused' | 'stopped';
  defaultTime?: number;
}

interface TimerData {
  timeRemaining: number;
  isActive: boolean;
  isPaused: boolean;
}

// 🔥 NEW: Interface cho question change event với defaultTime
interface QuestionChangeData {
  currentQuestion: number;
  timeRemaining: number;
  remainingTime?: number; // 🔥 NEW: Hỗ trợ cả hai tên field
  defaultTime: number;
  matchId?: string | number;
}

interface ExamState {
  isStarted: boolean;
  isPaused: boolean;
  isLoading: boolean;
  currentQuestion: number;
  timeRemaining: number;
  defaultTime: number;
}

export const useAdminSocket = () => {
  const { socket, isConnected } = useOnlineControlSocket();
  const { match } = useParams();
  
  // 🔥 NEW: Fetch match data để lấy match ID
  const { data: matchResponse } = useMatchInfo(match ?? null);
  const matchData = matchResponse?.data;
  
  const [examState, setExamState] = useState<ExamState>({
    isStarted: false,
    isPaused: false,
    isLoading: false,
    currentQuestion: 0,
    timeRemaining: 0,
    defaultTime: 0,
  });

  // 🔥 NEW: Timer countdown
  useEffect(() => {
    let timerInterval: NodeJS.Timeout;

    if (examState.isStarted && !examState.isPaused && examState.timeRemaining > 0) {
      console.log('⏰ [ADMIN TIMER] Bắt đầu countdown từ:', examState.timeRemaining);
      
      timerInterval = setInterval(() => {
        setExamState(prev => {
          if (prev.timeRemaining <= 1) {
            console.log('⏰ [ADMIN TIMER] Hết thời gian!');
            return { ...prev, timeRemaining: 0 };
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);
    }

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
        console.log('🧹 [ADMIN TIMER] Dọn dẹp timer interval');
      }
    };
  }, [examState.isStarted, examState.isPaused, examState.timeRemaining]);

  // Event listeners cho admin socket
  useEffect(() => {
    if (!socket) return;

    console.log('🎧 [ADMIN SOCKET] Đăng ký event listeners cho admin control...');

    // 🔥 UPDATE: Join room khi kết nối vào namespace online-control với match ID từ API
    if (isConnected && match && matchData) {
      console.log('🏠 [ADMIN SOCKET] Đang join room cho match:', match);
      console.log('🔍 [ADMIN SOCKET] Match data từ API:', matchData);
      
      // 🔥 FIX: Sử dụng match ID từ match data
      const joinData = {
        matchSlug: match,
        matchId: matchData.id // 🔥 FIX: Sử dụng ID từ match data (25)
      };
      
      console.log('🔧 [ADMIN SOCKET] Join data:', joinData);
      
      socket.emit('onlineControl:joinMatch', joinData, (response: JoinRoomResponse) => {
        console.log('🏠 [ADMIN SOCKET] Join room response:', response);
        if (response.success) {
          console.log('✅ [ADMIN SOCKET] Đã join room thành công:', response.roomName);
        } else {
          console.error('❌ [ADMIN SOCKET] Lỗi join room:', response.message);
        }
      });
    }

    const handleMatchStarted = (data: MatchStartData) => {
      console.log('✅ [ADMIN] Match đã bắt đầu:', data);
      console.log('🔍 [ADMIN] Match ID từ event:', data.matchId);
      console.log('🔍 [ADMIN] Match ID từ params:', match);
      
      // Kiểm tra matchId có khớp không (convert string to number nếu cần)
      const eventMatchId = typeof data.matchId === 'string' ? parseInt(data.matchId) : data.matchId;
      const currentMatchId = typeof match === 'string' ? parseInt(match) : match;
      
      if (eventMatchId === currentMatchId) {
        console.log('🎯 [ADMIN] Match ID khớp - cập nhật trạng thái admin control');
        setExamState(prev => ({
          ...prev,
          isStarted: true,
          isPaused: false,
          currentQuestion: data.currentQuestion,
          timeRemaining: data.timeRemaining,
          defaultTime: data.defaultTime || 60, // 🔥 FIX: Fallback cho defaultTime
          isLoading: false,
        }));
      } else {
        console.log('⚠️ [ADMIN] Match ID không khớp - bỏ qua event');
      }
    };

    const handleMatchPaused = (data: { isPaused: boolean; matchId?: string | number }) => {
      console.log('⏸️ [ADMIN] Match đã tạm dừng:', data);
      
      // Kiểm tra matchId nếu có
      if (data.matchId) {
        const eventMatchId = typeof data.matchId === 'string' ? parseInt(data.matchId) : data.matchId;
        const currentMatchId = typeof match === 'string' ? parseInt(match) : match;
        
        if (eventMatchId !== currentMatchId) {
          console.log('⚠️ [ADMIN] Match ID không khớp cho pause event - bỏ qua');
          return;
        }
      }
      
      setExamState(prev => ({
        ...prev,
        isPaused: data.isPaused,
        isLoading: false,
      }));
    };

    const handleMatchResumed = (data?: { matchId?: string | number }) => {
      console.log('▶️ [ADMIN] Match đã tiếp tục:', data);
      
      // Kiểm tra matchId nếu có
      if (data?.matchId) {
        const eventMatchId = typeof data.matchId === 'string' ? parseInt(data.matchId) : data.matchId;
        const currentMatchId = typeof match === 'string' ? parseInt(match) : match;
        
        if (eventMatchId !== currentMatchId) {
          console.log('⚠️ [ADMIN] Match ID không khớp cho resume event - bỏ qua');
          return;
        }
      }
      
      setExamState(prev => ({
        ...prev,
        isPaused: false,
        isLoading: false,
      }));
    };

    const handleMatchStopped = (data?: { matchId?: string | number }) => {
      console.log('🛑 [ADMIN] Match đã kết thúc:', data);
      
      // Kiểm tra matchId nếu có
      if (data?.matchId) {
        const eventMatchId = typeof data.matchId === 'string' ? parseInt(data.matchId) : data.matchId;
        const currentMatchId = typeof match === 'string' ? parseInt(match) : match;
        
        if (eventMatchId !== currentMatchId) {
          console.log('⚠️ [ADMIN] Match ID không khớp cho stop event - bỏ qua');
          return;
        }
      }
      
      setExamState(prev => ({
        ...prev,
        isStarted: false,
        isPaused: false,
        isLoading: false,
      }));
    };

    const handleQuestionChanged = (data: QuestionChangeData) => {
      console.log('➡️ [ADMIN] Chuyển câu hỏi:', data);
      
      // Kiểm tra matchId nếu có
      if (data.matchId) {
        const eventMatchId = typeof data.matchId === 'string' ? parseInt(data.matchId) : data.matchId;
        const currentMatchId = typeof match === 'string' ? parseInt(match) : match;
        
        if (eventMatchId !== currentMatchId) {
          console.log('⚠️ [ADMIN] Match ID không khớp cho question change event - bỏ qua');
          return;
        }
      }
      
      console.log('🎯 [ADMIN] Cập nhật câu hỏi và timer:', {
        currentQuestion: data.currentQuestion,
        timeRemaining: data.timeRemaining,
        defaultTime: data.defaultTime
      });
      
      // 🔥 UPDATE: Sử dụng time thực tế từ backend, xử lý cả trường hợp timeRemaining và remainingTime
      const remainingTime = data.timeRemaining || data.remainingTime || data.defaultTime || 60;
      
      console.log('🔧 [ADMIN] Final binding data:', {
        currentQuestion: data.currentQuestion,
        remainingTime: remainingTime,
        defaultTime: data.defaultTime
      });
      
      setExamState(prev => ({
        ...prev,
        currentQuestion: data.currentQuestion,
        timeRemaining: remainingTime, // 🔥 FIX: Dùng time thực tế từ backend
        defaultTime: data.defaultTime, // 🔥 NEW: Lưu defaultTime từ backend
        isLoading: false,
      }));
    };

    const handleTimerUpdate = (data: TimerData & { matchId?: string | number }) => {
      // Kiểm tra matchId nếu có
      if (data.matchId) {
        const eventMatchId = typeof data.matchId === 'string' ? parseInt(data.matchId) : data.matchId;
        const currentMatchId = typeof match === 'string' ? parseInt(match) : match;
        
        if (eventMatchId !== currentMatchId) {
          return; // Bỏ qua timer update của match khác
        }
      }
      
      console.log('⏰ [ADMIN] Timer update từ backend:', {
        timeRemaining: data.timeRemaining,
        isPaused: data.isPaused
      });
      
      setExamState(prev => ({
        ...prev,
        timeRemaining: data.timeRemaining,
        isPaused: data.isPaused,
      }));
    };

    // 🔥 NEW: Thêm backup listeners cho các event có thể có tên khác
    const handleMatchStateChanged = (data: {
      matchId?: string | number;
      status?: string;
      currentQuestion?: number;
      timeRemaining?: number;
      defaultTime?: number; // 🔥 NEW: Thêm defaultTime
    }) => {
      console.log('🔄 [ADMIN] Match state changed:', data);
      
      if (data.matchId && data.matchId !== parseInt(match || '0')) {
        return; // Bỏ qua nếu không phải match hiện tại
      }
      
      // Cập nhật state dựa trên data nhận được
      if (data.status === 'started' || data.status === 'ongoing') {
        setExamState(prev => ({
          ...prev,
          isStarted: true,
          isPaused: false,
          isLoading: false,
          ...(data.currentQuestion && { currentQuestion: data.currentQuestion }),
          ...(data.timeRemaining !== undefined && { timeRemaining: data.timeRemaining }),
          defaultTime: data.defaultTime || prev.defaultTime || 60, // 🔥 FIX: Fallback cho defaultTime
        }));
      } else if (data.status === 'paused') {
        setExamState(prev => ({
          ...prev,
          isPaused: true,
          isLoading: false,
        }));
      } else if (data.status === 'stopped' || data.status === 'ended') {
        setExamState(prev => ({
          ...prev,
          isStarted: false,
          isPaused: false,
          isLoading: false,
        }));
      }
    };

    // Đăng ký các event listeners
    socket.on('match:started', handleMatchStarted);
    socket.on('match:paused', handleMatchPaused);
    socket.on('match:resumed', handleMatchResumed);
    socket.on('match:stopped', handleMatchStopped);
    socket.on('match:ended', handleMatchStopped); // 🔥 NEW: Thêm event ended
    socket.on('match:questionChanged', handleQuestionChanged);
    socket.on('timer:update', handleTimerUpdate);
    socket.on('match:timerUpdated', handleTimerUpdate); // 🔥 NEW: Backup timer event
    
    // 🔥 NEW: Backup listeners với tên event khác có thể
    socket.on('admin:matchStarted', handleMatchStarted);
    socket.on('admin:matchStateChanged', handleMatchStateChanged);
    socket.on('match:stateChanged', handleMatchStateChanged);

    // 🔥 NEW: Listeners cho events mà admin có thể nhận khi emit
    socket.on('match:start', handleMatchStarted); // Admin emit match:start, có thể nhận lại
    socket.on('match:pauseTimer', handleMatchPaused);
    socket.on('match:resumeTimer', handleMatchResumed);
    socket.on('match:end', handleMatchStopped);
    socket.on('match:nextQuestion', handleQuestionChanged);

    // 🔥 DEBUG: Universal event listener để catch tất cả events
    const originalEmit = socket.emit;
    
    // Log tất cả events được emit
    socket.emit = function(event: string, ...args: unknown[]) {
      console.log('📤 [ADMIN SOCKET] Emit event:', event, args);
      return originalEmit.call(this, event, ...args);
    };

    // Log tất cả events được nhận
    const universalListener = (eventName: string) => (data: unknown) => {
      if (eventName.includes('match') || eventName.includes('admin') || eventName.includes('timer')) {
        console.log(`📥 [ADMIN SOCKET] Received event: ${eventName}`, data);
      }
    };

    // Register universal listeners cho các events quan trọng
    const eventNames = [
      'match:started', 'match:paused', 'match:resumed', 'match:stopped', 'match:ended',
      'match:start', 'match:pauseTimer', 'match:resumeTimer', 'match:end', 'match:nextQuestion',
      'admin:matchStarted', 'admin:matchPaused', 'admin:matchResumed', 'admin:matchStopped',
      'timer:update', 'match:timerUpdated', 'match:questionChanged', 'match:stateChanged'
    ];

    eventNames.forEach(eventName => {
      socket.on(eventName, universalListener(eventName));
    });

    console.log('✅ [ADMIN SOCKET] Đã đăng ký tất cả event listeners');

    return () => {
      console.log('🧹 [ADMIN SOCKET] Dọn dẹp event listeners...');
      
      // Restore original functions
      socket.emit = originalEmit;
      
      // Remove all listeners
      socket.off('match:started', handleMatchStarted);
      socket.off('match:paused', handleMatchPaused);
      socket.off('match:resumed', handleMatchResumed);
      socket.off('match:stopped', handleMatchStopped);
      socket.off('match:ended', handleMatchStopped);
      socket.off('match:questionChanged', handleQuestionChanged);
      socket.off('timer:update', handleTimerUpdate);
      socket.off('match:timerUpdated', handleTimerUpdate);
      socket.off('admin:matchStarted', handleMatchStarted);
      socket.off('admin:matchStateChanged', handleMatchStateChanged);
      socket.off('match:stateChanged', handleMatchStateChanged);
      socket.off('match:start', handleMatchStarted);
      socket.off('match:pauseTimer', handleMatchPaused);
      socket.off('match:resumeTimer', handleMatchResumed);
      socket.off('match:end', handleMatchStopped);
      socket.off('match:nextQuestion', handleQuestionChanged);

      // Remove universal listeners
      eventNames.forEach(eventName => {
        socket.off(eventName, universalListener(eventName));
      });
    };
  }, [socket, match, isConnected, matchData]);

  // Socket emit functions với callback handling
  const startExam = useCallback(async (): Promise<SocketResponse> => {
    if (!socket || !match || !matchData) {
      return { success: false, message: 'Socket không kết nối, thiếu match slug hoặc match data' };
    }

    setExamState(prev => ({ ...prev, isLoading: true }));

    return new Promise((resolve) => {
      socket.emit('match:start', { matchId: matchData.id }, (response: SocketResponse) => {
        console.log('🚀 Start exam response:', response);
        
        if (response.success) {
          // 🔥 FIX: Cập nhật state ngay khi nhận response thành công
          console.log('✅ [ADMIN] Start exam thành công - cập nhật state admin control');
          setExamState(prev => ({
            ...prev,
            isStarted: true,
            isPaused: false,
            isLoading: false,
            currentQuestion: 1, // Default là câu hỏi đầu tiên
            timeRemaining: 60, // 🔥 TODO: Sẽ được update khi nhận event với time thực tế
          }));

          // 🔥 NEW: Tự động gọi câu hỏi đầu tiên sau 1 giây
          setTimeout(() => {
            console.log('🎯 [ADMIN] Tự động gọi câu hỏi đầu tiên...');
            socket.emit('match:nextQuestion', { matchId: matchData.id }, (nextResponse: SocketResponse) => {
              console.log('🎯 Auto next question response:', nextResponse);
              if (nextResponse.success) {
                console.log('✅ [ADMIN] Đã gửi câu hỏi đầu tiên tới students');
                
                // 🔥 NEW: Emit để refresh sidebar câu hỏi
                setTimeout(() => {
                  console.log('🔄 [ADMIN] Refresh sidebar câu hỏi...');
                  socket.emit('currentQuestion:get', { match, questionOrder: 1 }, (refreshResponse: unknown) => {
                    console.log('🔄 Refresh sidebar response:', refreshResponse);
                  });
                }, 500);
              }
            });
          }, 2000);
        } else {
          setExamState(prev => ({ ...prev, isLoading: false }));
        }
        
        resolve(response);
      });
    });
  }, [socket, match, matchData]);

  const pauseExam = useCallback(async (): Promise<SocketResponse> => {
    if (!socket || !match || !matchData) {
      return { success: false, message: 'Socket không kết nối, thiếu match slug hoặc match data' };
    }

    setExamState(prev => ({ ...prev, isLoading: true }));

    return new Promise((resolve) => {
      socket.emit('match:pauseTimer', { matchId: matchData.id }, (response: SocketResponse) => {
        console.log('⏸️ Pause exam response:', response);
        
        if (response.success) {
          // 🔥 NEW: Cập nhật state ngay khi nhận response thành công
          console.log('✅ [ADMIN] Pause exam thành công - cập nhật state admin control');
          setExamState(prev => ({
            ...prev,
            isPaused: true,
            isLoading: false,
          }));
        } else {
          setExamState(prev => ({ ...prev, isLoading: false }));
        }
        
        resolve(response);
      });
    });
  }, [socket, match, matchData]);

  const resumeExam = useCallback(async (): Promise<SocketResponse> => {
    if (!socket || !match || !matchData) {
      return { success: false, message: 'Socket không kết nối, thiếu match slug hoặc match data' };
    }

    setExamState(prev => ({ ...prev, isLoading: true }));

    return new Promise((resolve) => {
      socket.emit('match:resumeTimer', { matchId: matchData.id }, (response: SocketResponse) => {
        console.log('▶️ Resume exam response:', response);
        
        if (response.success) {
          setExamState(prev => ({
            ...prev,
            isPaused: false,
            isLoading: false,
          }));
        } else {
          setExamState(prev => ({ ...prev, isLoading: false }));
        }
        
        resolve(response);
      });
    });
  }, [socket, match, matchData]);

  const stopExam = useCallback(async (): Promise<SocketResponse> => {
    if (!socket || !match || !matchData) {
      return { success: false, message: 'Socket không kết nối, thiếu match slug hoặc match data' };
    }

    setExamState(prev => ({ ...prev, isLoading: true }));

    return new Promise((resolve) => {
      socket.emit('match:end', { matchId: matchData.id }, (response: SocketResponse) => {
        console.log('🛑 Stop exam response:', response);
        
        if (response.success) {
          // 🔥 NEW: Cập nhật state ngay khi nhận response thành công
          console.log('✅ [ADMIN] Stop exam thành công - cập nhật state admin control');
          setExamState(prev => ({
            ...prev,
            isStarted: false,
            isPaused: false,
            isLoading: false,
            currentQuestion: 0,
            timeRemaining: 0,
          }));
        } else {
          setExamState(prev => ({ ...prev, isLoading: false }));
        }
        
        resolve(response);
      });
    });
  }, [socket, match, matchData]);

  const nextQuestion = useCallback(async (): Promise<SocketResponse> => {
    if (!socket || !match || !matchData) {
      return { success: false, message: 'Socket không kết nối, thiếu match slug hoặc match data' };
    }

    setExamState(prev => ({ ...prev, isLoading: true }));

    return new Promise((resolve) => {
      socket.emit('match:nextQuestion', { matchId: matchData.id }, (response: SocketResponse) => {
        console.log('➡️ Next question response:', response);
        
        if (response.success) {
          console.log('✅ [ADMIN] Next question thành công - cập nhật state admin control');
          
          // 🔥 FIX: Lấy data từ response thay vì set mặc định
          const responseData = response.data as NextQuestionResponseData;
          const currentQuestion = responseData?.currentQuestion || examState.currentQuestion + 1;
          const remainingTime = responseData?.remainingTime || responseData?.defaultTime || 60;
          
          console.log('🔍 [ADMIN] Response data:', {
            currentQuestion,
            remainingTime,
            fullData: responseData
          });
          
          setExamState(prev => ({
            ...prev,
            currentQuestion: currentQuestion,
            timeRemaining: remainingTime, // 🔥 FIX: Sử dụng time từ response
            defaultTime: responseData?.defaultTime || remainingTime, // 🔥 NEW: Set defaultTime từ response  
            isLoading: false,
          }));

          // 🔥 UPDATE: Refresh sidebar với thông tin chính xác hơn
          setTimeout(() => {
            console.log(`🔄 [ADMIN] Refresh sidebar câu hỏi cho câu: ${currentQuestion}`);
            socket.emit('currentQuestion:get', { 
              match, 
              questionOrder: currentQuestion,
              matchId: matchData.id // 🔥 FIX: Sử dụng match ID thật
            }, (refreshResponse: unknown) => {
              console.log('🔄 Refresh sidebar response:', refreshResponse);
            });
          }, 300); // 🔥 FIX: Giảm delay xuống 300ms để nhanh hơn
        } else {
          setExamState(prev => ({ ...prev, isLoading: false }));
        }
        
        resolve(response);
      });
    });
  }, [socket, match, matchData, examState.currentQuestion]);

  return {
    // State
    examState,
    isConnected,
    
    // Actions
    startExam,
    pauseExam,
    resumeExam,
    stopExam,
    nextQuestion,
  };
}; 