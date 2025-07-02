import React from 'react';

interface LogoutSectionProps {
  handleLogout: () => void;
}

const LogoutSection: React.FC<LogoutSectionProps> = ({ handleLogout }) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center bg-red-50 p-6 rounded-xl border-2 border-red-200">
        <div className="w-16 sm:w-24 h-16 sm:h-24 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-2xl sm:text-4xl mx-auto animate-pulse shadow-lg">
          🚪
        </div>
        <h2 className="text-lg sm:text-2xl font-bold text-red-800 mt-4">Đăng xuất trọng tài</h2>
        <p className="text-red-700 text-xs sm:text-base mb-6 font-medium">Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?</p>
        <button
          className="px-4 sm:px-8 py-2 sm:py-4 bg-white text-red-700 font-bold rounded-xl border-2 border-red-300 hover:bg-red-50 hover:border-red-400 transition-all duration-300 transform hover:scale-105 shadow-lg text-[11px] sm:text-lg min-w-[120px] sm:min-w-[160px]"
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