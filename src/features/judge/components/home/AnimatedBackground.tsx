import React from 'react';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient nền chính */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-100"></div>
      
      {/* Các hình tròn trang trí */}
      <div className="absolute top-1/4 left-1/6 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply opacity-10 animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/6 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply opacity-8 animate-pulse delay-1000"></div>
      <div className="absolute top-2/3 left-1/3 w-48 h-48 bg-blue-300 rounded-full mix-blend-multiply opacity-12 animate-pulse delay-500"></div>
      
      {/* Các đường cong trang trí */}
      <div className="absolute -top-20 -right-20 w-96 h-96 border border-blue-200 rounded-full opacity-20"></div>
      <div className="absolute -bottom-20 -left-20 w-80 h-80 border border-blue-300 rounded-full opacity-25"></div>
    </div>
  );
};

export default AnimatedBackground;