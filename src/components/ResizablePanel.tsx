import React, { useState, useRef, useEffect, useCallback } from "react";
import { Box } from "@mui/material";

interface ResizablePanelProps {
  children: React.ReactNode;
  isOpen: boolean;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  position?: "left" | "right";
  onWidthChange?: (width: number) => void;
  storageKey?: string; // Key để lưu width vào localStorage
}

const ResizablePanel: React.FC<ResizablePanelProps> = ({
  children,
  isOpen,
  defaultWidth = 400,
  minWidth = 300,
  maxWidth = 800,
  position = "right",
  onWidthChange,
  storageKey,
}) => {
  // Load width từ localStorage nếu có
  const getInitialWidth = useCallback(() => {
    if (storageKey) {
      const savedWidth = localStorage.getItem(storageKey);
      if (savedWidth) {
        const parsed = parseInt(savedWidth);
        if (!isNaN(parsed) && parsed >= minWidth && parsed <= maxWidth) {
          return parsed;
        }
      }
    }
    return defaultWidth;
  }, [storageKey, defaultWidth, minWidth, maxWidth]);

  const [width, setWidth] = useState(getInitialWidth);
  const [isResizing, setIsResizing] = useState(false);
  const [isHoverHandle, setIsHoverHandle] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = width;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, [width]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;

    const deltaX = position === "right" 
      ? startXRef.current - e.clientX 
      : e.clientX - startXRef.current;
    
    let newWidth = startWidthRef.current + deltaX;
    
    // Giới hạn width trong khoảng min-max
    newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
    
    setWidth(newWidth);
    onWidthChange?.(newWidth);
    
    // Lưu vào localStorage
    if (storageKey) {
      localStorage.setItem(storageKey, newWidth.toString());
    }
  }, [isResizing, position, minWidth, maxWidth, onWidthChange, storageKey]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
    return undefined;
  }, [isResizing, handleMouseMove, handleMouseUp]);

  if (!isOpen) return null;

  return (
    <Box
      ref={panelRef}
      sx={{
        position: "relative",
        width: width,
        backgroundColor: "#f5f5f5",
        borderLeft: position === "right" ? "2px solid #e0e0e0" : undefined,
        borderRight: position === "left" ? "2px solid #e0e0e0" : undefined,
        ml: position === "right" ? 3 : 0,
        mr: position === "left" ? 3 : 0,
        p: 3,
        height: "100vh",
        overflow: "auto",
        transition: isResizing ? "none" : "width 0.3s ease",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: '#f1f1f1',
          borderRadius: '4px'
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#c1c1c1',
          borderRadius: '4px',
          '&:hover': {
            backgroundColor: '#a8a8a8'
          }
        }
      }}
    >
      {/* Resize Handle */}
      <Box
        ref={resizeHandleRef}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => setIsHoverHandle(true)}
        onMouseLeave={() => setIsHoverHandle(false)}
        sx={{
          position: "absolute",
          top: 0,
          [position === "right" ? "left" : "right"]: -4,
          width: 8,
          height: "100%",
          cursor: "col-resize",
          backgroundColor: "transparent",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "&:hover": {
            backgroundColor: "rgba(25, 118, 210, 0.1)",
          },
          "&:active": {
            backgroundColor: "rgba(25, 118, 210, 0.2)",
          },
        }}
      >
        {/* Resize Visual Indicator */}
        <Box
          sx={{
            width: 2,
            height: 60,
            backgroundColor: isHoverHandle || isResizing ? "#1976d2" : "#e0e0e0",
            borderRadius: 1,
            transition: "background-color 0.2s ease, height 0.2s ease",
            boxShadow: isHoverHandle || isResizing ? "0 2px 4px rgba(0,0,0,0.2)" : "none",
          }}
        />
      </Box>
      
      {children}
    </Box>
  );
};

export default ResizablePanel;