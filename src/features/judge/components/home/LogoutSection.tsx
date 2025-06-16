import React from 'react';

interface LogoutSectionProps {
  handleLogout: () => void;
}

const LogoutSection: React.FC<LogoutSectionProps> = ({ handleLogout }) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <div className="w-16 sm:w-24 h-16 sm:h-24 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-2xl sm:text-4xl mx-auto animate-pulse">
          🚪
        </div>
        <h2 className="text-lg sm:text-2xl font-bold text-white">Đăng xuất trọng tài</h2>
        <p className="text-white/70 text-xs sm:text-base">Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?</p>
        <button
          className="px-4 sm:px-8 py-2 sm:py-4 bg-gradient-to-r from-red-600 to-red-800 text-white font-bold rounded-xl hover:from-red-500 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-[11px] sm:text-lg min-w-[120px] sm:min-w-[160px]"
          onClick={handleLogout}
          aria-label="Đăng xuất khỏi hệ thống"
        >
          🚪 Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default LogoutSection;