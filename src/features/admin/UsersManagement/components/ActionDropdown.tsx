import React, { useState } from 'react';
import type { User } from '../types/User';

interface ActionDropdownProps {
  user: User;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}

const ActionDropdown: React.FC<ActionDropdownProps> = ({ user, onView, onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-400 hover:text-gray-600"
      >
        <svg className="w-5 h-5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          <button
            onClick={() => onView(user)}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Xem chi tiết
          </button>
          <button
            onClick={() => onEdit(user)}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Chỉnh sửa
          </button>
          <button
            onClick={() => onDelete(user.id)}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Xóa
          </button>
        </div>
      )}
    </div>
  );
};

export default ActionDropdown;