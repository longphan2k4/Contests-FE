import React from 'react';
import { AcademicCapIcon } from '@heroicons/react/24/outline';
import type { ProgramItem } from '../../features/home/types/home/ProgramItem';
import { CodeBracketIcon, CircleStackIcon, ComputerDesktopIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';

const Footer: React.FC = () => {
  const programs: ProgramItem[] = [
    {
      id: 1,
      name: "Công nghệ Phần mềm",
      duration: "3 năm",
      description: "Đào tạo chuyên gia phát triển phần mềm, ứng dụng web và mobile",
      icon: <CodeBracketIcon className="w-8 h-8" />
    },
    {
      id: 2,
      name: "Hệ thống Thông tin",
      duration: "3 năm", 
      description: "Quản trị và phát triển hệ thống thông tin doanh nghiệp",
      icon: <CircleStackIcon className="w-8 h-8" />
    },
    {
      id: 3,
      name: "Mạng máy tính",
      duration: "3 năm",
      description: "Thiết kế, vận hành và bảo mật hệ thống mạng",
      icon: <ComputerDesktopIcon className="w-8 h-8" />
    },
    {
      id: 4,
      name: "Ứng dụng Di động",
      duration: "3 năm",
      description: "Phát triển ứng dụng trên nền tảng iOS, Android và Cross-platform",
      icon: <DevicePhoneMobileIcon className="w-8 h-8" />
    }
  ];

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <AcademicCapIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold">CĐ Kỹ Thuật Cao Thắng</h3>
                <p className="text-sm text-gray-400">Khoa CNTT</p>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Đào tạo nguồn nhân lực chất lượng cao trong lĩnh vực Công nghệ Thông tin
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Liên kết nhanh</h4>
            <ul className="space-y-2 text-gray-400">
              {['Trang chủ', 'Giới thiệu', 'Đào tạo', 'Tuyển sinh'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Chương trình</h4>
            <ul className="space-y-2 text-gray-400">
              {programs.map((program) => (
                <li key={program.id}>
                  <a href="#" className="hover:text-white transition-colors">{program.name}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Theo dõi chúng tôi</h4>
            <div className="flex space-x-4">
              {[
                { icon: 'f', color: 'bg-blue-600 hover:bg-blue-700' },
                { icon: 't', color: 'bg-blue-400 hover:bg-blue-500' },
                { icon: 'y', color: 'bg-red-600 hover:bg-red-700' }
              ].map((social, index) => (
                <a key={index} href="#" className={`w-10 h-10 ${social.color} rounded-full flex items-center justify-center transition-colors`}>
                  <span className="text-sm font-semibold">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© 2025 Trường Cao đẳng Kỹ Thuật Cao Thắng - Khoa Công nghệ Thông tin. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;