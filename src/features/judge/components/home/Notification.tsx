import React from 'react';
import type { NotificationType } from '../../types/contestant';

interface NotificationProps {
  message: string;
  type: NotificationType;
}

const Notification: React.FC<NotificationProps> = ({ message, type }) => {
  return (
    <div
      className={`fixed top-3 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 z-50 p-3 sm:p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
        type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-yellow-500'
      } text-white animate-bounce sm:max-w-md sm:mx-auto`}
    >
      <div className="flex items-center space-x-2">
        <div className="text-base sm:text-lg">
          {type === 'success' ? '✅' : type === 'error' ? '❌' : '⚠️'}
        </div>
        <span className="text-sm sm:text-base">{message}</span>
      </div>
    </div>
  );
};

export default Notification;