import React from 'react';
import { AcademicCapIcon, UserGroupIcon, TrophyIcon, BookOpenIcon } from '@heroicons/react/24/outline';

const Stats: React.FC = () => {
  const stats = [
    { number: "15+", label: "Năm đào tạo", icon: <AcademicCapIcon className="w-8 h-8" /> },
    { number: "5000+", label: "Sinh viên", icon: <UserGroupIcon className="w-8 h-8" /> },
    { number: "95%", label: "Có việc làm", icon: <TrophyIcon className="w-8 h-8" /> },
    { number: "50+", label: "Đối tác doanh nghiệp", icon: <BookOpenIcon className="w-8 h-8" /> }
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-2">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;