// components/FullscreenModal/FullscreenModal.tsx
import React, { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface FullscreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const FullscreenModal: React.FC<FullscreenModalProps> = ({ 
  isOpen, 
  onClose, 
  children 
}) => {
  useEffect(() => {
    if (isOpen) {
      // Ẩn header khi modal mở
      const header = document.querySelector('header') as HTMLElement;
      if (header) {
        header.style.display = 'none';
      }
      
      // Ngăn scroll trên body
      document.body.style.overflow = 'hidden';
    } else {
      // Hiện lại header khi modal đóng
      const header = document.querySelector('header') as HTMLElement;
      if (header) {
        header.style.display = '';
      }
      
      // Cho phép scroll lại
      document.body.style.overflow = '';
    }

    // Cleanup khi component unmount
    return () => {
      const header = document.querySelector('header') as HTMLElement;
      if (header) {
        header.style.display = '';
      }
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Xử lý đóng modal khi nhấn Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center">
      {/* Nút đóng */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-all"
        aria-label="Đóng"
      >
        <XMarkIcon className="w-8 h-8" />
      </button>

      {/* Overlay để đóng modal khi click */}
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      />

      {/* Nội dung modal */}
      <div 
        className="w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default FullscreenModal;