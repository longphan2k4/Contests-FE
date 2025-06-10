import React, { useState } from 'react';
import { StarIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const About: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Về Khoa Công nghệ Thông tin
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Khoa Công nghệ Thông tin - Trường Cao đẳng Kỹ Thuật Cao Thắng được thành lập với sứ mệnh 
                đào tạo nguồn nhân lực chất lượng cao trong lĩnh vực CNTT, đáp ứng nhu cầu phát triển 
                của xã hội và hội nhập quốc tế.
              </p>
              <p>
                Với đội ngũ giảng viên giàu kinh nghiệm, cơ sở vật chất hiện đại và chương trình đào tạo 
                theo chuẩn quốc tế, chúng tôi cam kết mang đến môi trường học tập tốt nhất cho sinh viên.
              </p>
            </div>

            <div className="mt-8 flex space-x-4">
              {['overview', 'mission'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === tab 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab === 'overview' ? 'Tổng quan' : 'Sứ mệnh'}
                </button>
              ))}
            </div>

            <div className="mt-6 p-6 bg-gray-50 rounded-lg">
              {activeTab === 'overview' && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Điểm nổi bật</h3>
                  <ul className="space-y-2 text-gray-600">
                    {[
                      'Chương trình đào tạo chuẩn quốc tế',
                      'Đội ngũ giảng viên có trình độ cao',
                      'Cơ sở vật chất hiện đại',
                      'Tỷ lệ có việc làm cao sau tốt nghiệp'
                    ].map((item, index) => (
                      <li key={index} className="flex items-center">
                        <StarIcon className="w-4 h-4 text-yellow-500 mr-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {activeTab === 'mission' && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Sứ mệnh của chúng tôi</h3>
                  <p className="text-gray-600">
                    Đào tạo thế hệ kỹ sư công nghệ thông tin có tay nghề cao, tư duy sáng tạo, 
                    có khả năng thích ứng với sự phát triển nhanh chóng của công nghệ và đóng góp 
                    tích cực cho sự phát triển của đất nước.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-2xl text-white">
              <h3 className="text-2xl font-bold mb-6">Tại sao chọn chúng tôi?</h3>
              <div className="space-y-4">
                {[
                  { title: 'Đào tạo thực tế', desc: 'Kết hợp lý thuyết với thực hành, gắn liền với doanh nghiệp' },
                  { title: 'Hỗ trợ việc làm', desc: 'Kết nối với mạng lưới doanh nghiệp đối tác' },
                  { title: 'Học phí hợp lý', desc: 'Chất lượng cao với mức học phí phù hợp' }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-8 h-8  bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <ChevronRightIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="text-blue-100">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;