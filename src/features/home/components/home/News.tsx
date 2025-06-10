import React from 'react';
import { CalendarIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import type { NewsItem } from '../../types/home/NewsItem';
const News: React.FC = () => {
  const news: NewsItem[] = [
    {
      id: 1,
      title: "Tuyển sinh Cao đẳng năm 2025 - Nhiều ưu đãi hấp dẫn",
      date: "15/05/2025",
      image: "linear-gradient(45deg, #ff6b6b, #ee5a24)",
      excerpt: "Thông báo tuyển sinh các ngành đào tạo năm học 2025-2026 với nhiều chính sách ưu đãi..."
    },
    {
      id: 2,
      title: "Hội thảo 'Xu hướng Công nghệ 4.0 trong Giáo dục'",
      date: "10/05/2025",
      image: "linear-gradient(45deg, #74b9ff, #0984e3)",
      excerpt: "Sự kiện quy tụ các chuyên gia hàng đầu trong lĩnh vực công nghệ và giáo dục..."
    },
    {
      id: 3,
      title: "Sinh viên CNTT đạt giải Nhất cuộc thi Hackathon 2025",
      date: "05/05/2025",
      image: "linear-gradient(45deg, #00b894, #00a085)",
      excerpt: "Đội thi của khoa CNTT xuất sắc giành giải Nhất với dự án ứng dụng AI..."
    }
  ];

  return (
    <section id="news" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Tin tức & Sự kiện</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Cập nhật những thông tin mới nhất về hoạt động đào tạo và các sự kiện tại khoa
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {news.map((item) => (
            <article key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div 
                className="h-48 relative"
                style={{ background: item.image }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300" />
                <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full">
                  <span className="text-sm font-semibold text-gray-800 flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    {item.date}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{item.excerpt}</p>
                <button className="text-blue-600 font-semibold hover:text-blue-800 transition-colors flex items-center">
                  Đọc thêm <ArrowRightIcon className="ml-2 w-4 h-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default News;