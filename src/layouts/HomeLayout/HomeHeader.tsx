import React from 'react';
import { AcademicCapIcon } from '@heroicons/react/24/outline';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <AcademicCapIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">CĐ Kỹ Thuật Cao Thắng</h1>
              <p className="text-sm text-gray-600">Khoa CNTT</p>
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            {['Trang chủ', 'Giới thiệu', 'Đào tạo', 'Tin tức', 'Liên hệ'].map((item) => (
              <a href="#" key={item} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300">
              Tuyển sinh 2025
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;