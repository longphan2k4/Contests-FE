import React, { useState, useEffect } from "react";
import type { User } from "../types/User";
import { formatDate } from "../utils/formatDate";

interface ViewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const ViewUserModal: React.FC<ViewUserModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 200);
      return () => clearTimeout(timer);
    }
    return () => {};
  }, [isOpen]);

  if (!isVisible || !user) return null;

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-200 ease-in-out ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-lg w-full h-full md:w-auto md:h-auto md:max-w-md max-h-[90vh] overflow-y-auto p-6 transform transition-transform duration-200 ease-in-out ${
          isOpen ? "scale-100" : "scale-90"
        }`}
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">Chi tiết người dùng</h2>
        <div className="space-y-3">
          <div className="flex">
            <span className="font-medium w-24">ID:</span>
            <span>{user.id}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-24">Tên:</span>
            <span>{user.username}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-24">Email:</span>
            <span>{user.email}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-24">Vai trò:</span>
            <span
              className={`px-2 py-1 rounded text-xs ${
                user.role === "Admin"
                  ? "bg-purple-100 text-purple-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {user.role}
            </span>
          </div>
          <div className="flex">
            <span className="font-medium w-24">Trạng thái:</span>
            <span
              className={`px-2 py-1 rounded text-xs ${
                user.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {user.isActive ? "Hoạt động" : "Không hoạt động"}
            </span>
          </div>
          <div className="flex">
            <span className="font-medium w-24">Tạo lúc:</span>
            <span>{formatDate(user.createdAt)}</span>
          </div>
          <div className="flex">
            <span className="font-medium w-24">Cập nhật:</span>
            <span>{formatDate(user.updatedAt)}</span>
          </div>
        </div>
        <div className="flex justify-end pt-4">
          <button
            onClick={onClose}
            className="w-full sm:w-auto min-h-[44px] px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewUserModal;
