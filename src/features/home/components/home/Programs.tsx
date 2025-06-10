import React from 'react';
import { CodeBracketIcon, CircleStackIcon, ComputerDesktopIcon, DevicePhoneMobileIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import type { ProgramItem } from '../../types/home/ProgramItem';

const Programs: React.FC = () => {
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
    <section id="programs"className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Chương trình Đào tạo</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Các ngành đào tạo chất lượng cao, được thiết kế để đáp ứng nhu cầu của thị trường lao động hiện đại
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {programs.map((program) => (
            <div key={program.id} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
              <div className="text-blue-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                {program.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{program.name}</h3>
              <p className="text-blue-600 font-semibold mb-4">Thời gian: {program.duration}</p>
              <p className="text-gray-600 mb-6 leading-relaxed">{program.description}</p>
              <button className="text-blue-600 font-semibold hover:text-blue-800 transition-colors flex items-center">
                Tìm hiểu thêm <ArrowRightIcon className="ml-2 w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Programs;