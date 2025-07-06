import { useEffect, useRef, useState, useCallback } from 'react';

// Mở rộng interface Document và HTMLElement để hỗ trợ fullscreen API
interface ExtendedDocument extends Document {
  webkitExitFullscreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
  webkitFullscreenElement?: Element;
  msFullscreenElement?: Element;
}

interface ExtendedHTMLElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}

export interface AntiCheatViolation {
  type: 'tab_switch' | 'escape_key' | 'minimize' | 'fullscreen_exit' | 'copy_paste' | 'context_menu' | 'dev_tools';
  timestamp: Date;
  description: string;
}

export interface AntiCheatConfig {
  enableFullscreen: boolean;
  enableTabSwitchDetection: boolean;
  enableCopyPasteBlocking: boolean;
  enableContextMenuBlocking: boolean;
  enableDevToolsBlocking: boolean;
  maxViolations: number;
  warningBeforeTermination: boolean;
}

const defaultConfig: AntiCheatConfig = {
  enableFullscreen: true,
  enableTabSwitchDetection: true,
  enableCopyPasteBlocking: true,
  enableContextMenuBlocking: true,
  enableDevToolsBlocking: true,
  maxViolations: 3,
  warningBeforeTermination: true,
};

export const useAntiCheat = (
  config: Partial<AntiCheatConfig> = {},
  onViolation?: (violation: AntiCheatViolation) => void,
  onTerminate?: () => void
) => {
  const finalConfig = { ...defaultConfig, ...config };
  const [violations, setViolations] = useState<AntiCheatViolation[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [warningCount, setWarningCount] = useState(0);
  const isActive = useRef(true);

  const addViolation = useCallback((violation: AntiCheatViolation) => {
    
    if (!isActive.current) {
      return;
    }
    
    setViolations(prev => {
      const newViolations = [...prev, violation];
      return newViolations;
    });
    
    onViolation?.(violation);
    
    setWarningCount(prev => {
      const newCount = prev + 1;
      
      if (newCount >= finalConfig.maxViolations) {
        if (finalConfig.warningBeforeTermination) {
          // Hiển thị cảnh báo cuối cùng trước khi kết thúc
          setTimeout(() => {
            onTerminate?.();
          }, 3000);
        } else {
          onTerminate?.();
        }
      }
      return newCount;
    });
  }, [finalConfig.maxViolations, finalConfig.warningBeforeTermination, onViolation, onTerminate]);

  // Enter fullscreen
  const enterFullscreen = useCallback(async () => {
    try {
      // Kiểm tra xem có thể request fullscreen không
      if (!document.fullscreenEnabled) {
        return false;
      }

      // Kiểm tra xem đã ở fullscreen chưa
      const extendedDoc = document as ExtendedDocument;
      const isCurrentlyFullscreen = !!(
        extendedDoc.fullscreenElement ||
        extendedDoc.webkitFullscreenElement ||
        extendedDoc.msFullscreenElement
      );

      if (isCurrentlyFullscreen) {
        setIsFullscreen(true);
        return true;
      }

      const docElement = document.documentElement as ExtendedHTMLElement;
      if (docElement.requestFullscreen) {
        await docElement.requestFullscreen();
      } else if (docElement.webkitRequestFullscreen) {
        await docElement.webkitRequestFullscreen();
      } else if (docElement.msRequestFullscreen) {
        await docElement.msRequestFullscreen();
      }
      return true;
    } catch (error) {
      console.warn('Không thể vào chế độ toàn màn hình:', error);
      return false;
    }
  }, []);

  // Exit fullscreen
  const exitFullscreen = useCallback(async () => {
    try {
      const extendedDoc = document as ExtendedDocument;
      
      // Kiểm tra xem có đang ở fullscreen không
      const isCurrentlyFullscreen = !!(
        extendedDoc.fullscreenElement ||
        extendedDoc.webkitFullscreenElement ||
        extendedDoc.msFullscreenElement
      );

      if (!isCurrentlyFullscreen) {
        setIsFullscreen(false);
        return;
      }

      if (extendedDoc.exitFullscreen) {
        await extendedDoc.exitFullscreen();
      } else if (extendedDoc.webkitExitFullscreen) {
        await extendedDoc.webkitExitFullscreen();
      } else if (extendedDoc.msExitFullscreen) {
        await extendedDoc.msExitFullscreen();
      }
    } catch (error) {
      console.warn('Không thể thoát chế độ toàn màn hình:', error);
    }
    setIsFullscreen(false);
  }, []);

  // Start anti-cheat monitoring
  const startMonitoring = useCallback(() => {
    isActive.current = true;
    // Không tự động vào fullscreen ngay lập tức để tránh lỗi permissions
    // Thay vào đó, chỉ báo cho user biết cần vào fullscreen
  }, []);

  // Stop anti-cheat monitoring  
  const stopMonitoring = useCallback(async () => {
    isActive.current = false;
    if (isFullscreen) {
      await exitFullscreen();
    }
  }, [isFullscreen, exitFullscreen]);

  useEffect(() => {
    
    if (!isActive.current) {
      return;
    }


    // Phát hiện thay đổi trạng thái fullscreen
    const handleFullscreenChange = () => {
      const extendedDoc = document as ExtendedDocument;
      const isNowFullscreen = !!(
        extendedDoc.fullscreenElement ||
        extendedDoc.webkitFullscreenElement ||
        extendedDoc.msFullscreenElement
      );
      
      setIsFullscreen(isNowFullscreen);
      
      if (!isNowFullscreen && finalConfig.enableFullscreen) {
        addViolation({
          type: 'fullscreen_exit',
          timestamp: new Date(),
          description: 'Thí sinh đã thoát khỏi chế độ toàn màn hình'
        });
      }
    };

    // Phát hiện chuyển tab/cửa sổ (visibility change)
    const handleVisibilityChange = () => {
      if (document.hidden && finalConfig.enableTabSwitchDetection) {
        addViolation({
          type: 'tab_switch',
          timestamp: new Date(),
          description: 'Thí sinh đã chuyển tab hoặc minimize cửa sổ'
        });
      }
    };

    // Phát hiện phím ESC và các phím khác
    const handleKeyDown = (e: KeyboardEvent) => {
      
      // Phím ESC
      if (e.key === 'Escape') {        e.preventDefault();
        addViolation({
          type: 'escape_key',
          timestamp: new Date(),
          description: 'Thí sinh đã nhấn phím ESC'
        });
      }

      // Chặn Copy/Paste
      if (finalConfig.enableCopyPasteBlocking) {
        if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v' || e.key === 'x')) {
          e.preventDefault();
          addViolation({
            type: 'copy_paste',
            timestamp: new Date(),
            description: `Thí sinh đã thử ${e.key === 'c' ? 'copy' : e.key === 'v' ? 'paste' : 'cut'}`
          });
        }
      }

      // Chặn F12, Ctrl+Shift+I (Developer Tools)
      if (finalConfig.enableDevToolsBlocking) {
        if (
          e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && e.key === 'I') ||
          (e.ctrlKey && e.shiftKey && e.key === 'J') ||
          (e.ctrlKey && e.key === 'U')
        ) {
          e.preventDefault();
          addViolation({
            type: 'dev_tools',
            timestamp: new Date(),
            description: 'Thí sinh đã thử mở Developer Tools'
          });
        }
      }
    };

    // Chặn context menu (chuột phải)
    const handleContextMenu = (e: MouseEvent) => {
      if (finalConfig.enableContextMenuBlocking) {
        e.preventDefault();
        addViolation({
          type: 'context_menu',
          timestamp: new Date(),
          description: 'Thí sinh đã thử mở context menu'
        });
      }
    };

    // Phát hiện blur (mất focus)
    const handleBlur = () => {
      if (finalConfig.enableTabSwitchDetection) {
        addViolation({
          type: 'minimize',
          timestamp: new Date(),
          description: 'Cửa sổ đã mất focus (có thể do chuyển ứng dụng)'
        });
      }
    };

    // Phát hiện orientation change (mobile)
    const handleOrientationChange = () => {
      if (finalConfig.enableTabSwitchDetection) {
        addViolation({
          type: 'minimize',
          timestamp: new Date(),
          description: 'Thí sinh đã xoay màn hình hoặc thay đổi orientation'
        });
      }
    };

    // Phát hiện touch events nghi ngờ (mobile long press)
    const handleTouchStart = (e: TouchEvent) => {
      if (finalConfig.enableContextMenuBlocking && e.touches.length > 1) {
        e.preventDefault();
        addViolation({
          type: 'context_menu',
          timestamp: new Date(),
          description: 'Thí sinh đã thử sử dụng multi-touch gesture'
        });
      }
    };

    // Phát hiện beforeunload (khi user thử thoát page)
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      addViolation({
        type: 'minimize',
        timestamp: new Date(),
        description: 'Thí sinh đã thử thoát khỏi trang thi'
      });
      e.returnValue = 'Bạn có chắc muốn thoát khỏi bài thi?';
    };

    // Event listeners
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('blur', handleBlur);
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [finalConfig, addViolation]);

  return {
    violations,
    warningCount,
    isFullscreen,
    startMonitoring,
    stopMonitoring,
    enterFullscreen,
    exitFullscreen,
    maxViolations: finalConfig.maxViolations,
    isMonitoring: isActive.current,
  };
};