import React, { useState } from 'react';
import { 
  ArrowDownTrayIcon, 
  CalendarDaysIcon, 
  UsersIcon, 
  TrophyIcon, 
  DocumentTextIcon, 
  GlobeAltIcon, 
  CircleStackIcon, 
  CodeBracketIcon, 
  DevicePhoneMobileIcon, 
  Cog6ToothIcon, 
  PaintBrushIcon, 
  LanguageIcon, 
  ChevronDownIcon, 
  ChevronRightIcon, 
  StarIcon, 
  GiftIcon 
} from '@heroicons/react/24/outline';
import doc from './assets/doc/thelethidau_20250311_final.pdf';

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const OlympicIT2025Rules: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
    setActiveSection(sectionId);
  };

  const downloadFile = () => {
    const fileUrl = doc;
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = 'thelethidau_20250311_final.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const sections: Section[] = [
    {
      id: 'overview',
      title: 'Tổng Quan',
      icon: <GlobeAltIcon className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-100">
            <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
              <TrophyIcon className="w-6 h-6 mr-2 text-yellow-500" />
              Olympic Tin Học 2025 - Đấu Trường Số
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <UsersIcon className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">Đối tượng: Tất cả các lớp thuộc khóa CNTT</span>
              </div>
              <div className="flex items-center space-x-3">
                <GlobeAltIcon className="w-5 h-5 text-blue-600" />
                <a href="https://www.facebook.com/olympicit.caothang/" 
                   className="text-blue-600 hover:text-blue-800 transition-colors">
                  Fanpage chính thức
                </a>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
              <div className="flex items-center mb-2">
                <CalendarDaysIcon className="w-5 h-5 text-green-600 mr-2" />
                <h4 className="font-semibold text-gray-800">Vòng Sơ Loại</h4>
              </div>
              <p className="text-sm text-gray-600">24/03/2025 - 30/03/2025</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
              <div className="flex items-center mb-2">
                <CalendarDaysIcon className="w-5 h-5 text-yellow-600 mr-2" />
                <h4 className="font-semibold text-gray-800">Tứ Kết & Bán Kết</h4>
              </div>
              <p className="text-sm text-gray-600">31/03/2025 - 13/04/2025</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-500">
              <div className="flex items-center mb-2">
                <CalendarDaysIcon className="w-5 h-5 text-red-600 mr-2" />
                <h4 className="font-semibold text-gray-800">Chung Kết</h4>
              </div>
              <p className="text-sm text-gray-600">14/04/2025 - 20/04/2025</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'content',
      title: 'Nội Dung Thi',
      icon: <DocumentTextIcon className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: <CodeBracketIcon className="w-5 h-5" />, title: 'LẬP TRÌNH (C/C++)', color: 'blue', desc: 'Biểu diễn thuật toán, cấu trúc chương trình, kiểu dữ liệu, OOP' },
              { icon: <GlobeAltIcon className="w-5 h-5" />, title: 'TIN TỨC - CÔNG NGHỆ', color: 'green', desc: 'Thông tin công nghệ 2025 từ các website uy tín' },
              { icon: <CircleStackIcon className="w-5 h-5" />, title: 'CƠ SỞ DỮ LIỆU', color: 'purple', desc: 'Mô hình quan hệ, T-SQL, thiết kế CSDL' },
              { icon: <Cog6ToothIcon className="w-5 h-5" />, title: 'PHẦN CỨNG & MẠNG', color: 'orange', desc: 'Cấu tạo máy tính, mạng LAN/WAN, OSI/TCP-IP' },
              { icon: <DevicePhoneMobileIcon className="w-5 h-5" />, title: 'ỨNG DỤNG CNTT', color: 'cyan', desc: 'MS Office 2016, Word, Excel, PowerPoint' },
              { icon: <PaintBrushIcon className="w-5 h-5" />, title: 'THIẾT KẾ WEBSITE', color: 'pink', desc: 'HTML, CSS, Layout, Responsive Design' },
              { icon: <DocumentTextIcon className="w-5 h-5" />, title: 'CÔNG NGHỆ PHẦN MỀM', color: 'indigo', desc: 'Waterfall, Agile, Scrum, Git, Trello, Jira' },
              { icon: <LanguageIcon className="w-5 h-5" />, title: 'ANH VĂN CHUYÊN NGÀNH', color: 'red', desc: 'Thuật ngữ IT, đọc hiểu, nghe hiểu chuyên ngành' }
            ].map((item, index) => (
              <div key={index} className={`bg-white p-4 rounded-lg shadow-md border-l-4 border-${item.color}-500 hover:shadow-lg transition-shadow`}>
                <div className={`flex items-center mb-2 text-${item.color}-600`}>
                  {item.icon}
                  <h4 className="font-semibold ml-2 text-gray-800">{item.title}</h4>
                </div>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'format',
      title: 'Hình Thức Thi',
      icon: <TrophyIcon className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
            <h3 className="text-lg font-bold text-blue-800 mb-4">Hình Thức "Đấu Trường Số"</h3>
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              {[
                { name: 'Alpha', questions: 4, time: '15s', color: 'green', desc: 'Pha kiểm thử đầu tiên' },
                { name: 'Beta', questions: 4, time: '20s', color: 'blue', desc: 'Phiên bản dùng thử' },
                { name: 'Release Candidate', questions: 4, time: '30s', color: 'yellow', desc: 'Thử nghiệm cuối' },
                { name: 'GOLD', questions: 1, time: '30s', color: 'red', desc: 'Phiên bản chính thức' }
              ].map((phase, index) => (
                <div key={index} className={`bg-white p-4 rounded-lg border-2 border-${phase.color}-200`}>
                  <div className={`text-${phase.color}-600 font-bold text-center mb-2`}>{phase.name}</div>
                  <div className="text-center text-sm space-y-1">
                    <div>{phase.questions} câu hỏi</div>
                    <div className={`text-${phase.color}-500 font-semibold`}>{phase.time}</div>
                    <div className="text-gray-600 text-xs">{phase.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <StarIcon className="w-5 h-5 text-yellow-500 mr-2" />
                Tính Năng Đặc Biệt
              </h4>
              <div className="space-y-2 text-sm text-gray-700">
                <div>• <strong>Cứu trợ "hồi sinh":</strong> Có thể hồi sinh thí sinh bị loại (câu 1-5: tối đa 1/3, câu 6-10: tối đa 10 người)</div>
                <div>• <strong>"Phao cứu trợ":</strong> Khi chỉ còn 1 thí sinh, có thể nhờ khán giả hỗ trợ trả lời</div>
                <div>• <strong>Câu hỏi GOLD:</strong> Giành quyền trả lời bằng cách đưa tay nhanh nhất</div>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h4 className="font-semibold text-gray-800 mb-2">Vòng Loại</h4>
              <p className="text-sm text-gray-600">Thi trực tiếp tại lớp học, 30 câu hỏi trắc nghiệm, chọn 20 thí sinh xuất sắc nhất</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h4 className="font-semibold text-gray-800 mb-2">Tứ Kết & Bán Kết</h4>
              <p className="text-sm text-gray-600">Trực tiếp trên sân khấu, format "Đấu trường số", có video giới thiệu đội</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h4 className="font-semibold text-gray-800 mb-2">Chung Kết</h4>
              <p className="text-sm text-gray-600">60 thí sinh thi đấu, chọn ra 3 thí sinh xuất sắc nhất để trao giải</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'prizes',
      title: 'Giải Thưởng',
      icon: <TrophyIcon className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: 'Giải Nhất', amount: '3.000.000 đồng', color: 'yellow', icon: <TrophyIcon className="w-6 h-6" />, desc: 'Cho cá nhân xuất sắc + giấy khen' },
              { title: 'Giải Nhì', amount: '2.000.000 đồng', color: 'gray', icon: <TrophyIcon className="w-6 h-6" />, desc: 'Cho cá nhân xuất sắc + giấy khen' },
              { title: 'Giải Ba', amount: '1.000.000 đồng', color: 'orange', icon: <TrophyIcon className="w-6 h-6" />, desc: 'Cho cá nhân xuất sắc + giấy khen' },
              { title: 'Giải Video Ấn Tượng', amount: '1.000.000 đồng', color: 'blue', icon: <DocumentTextIcon className="w-6 h-6" />, desc: 'Cho tập thể lớp + giấy khen' }
            ].map((prize, index) => (
              <div key={index} className={`bg-gradient-to-r from-${prize.color}-50 to-${prize.color}-100 p-6 rounded-xl border border-${prize.color}-200`}>
                <div className={`flex items-center mb-3 text-${prize.color}-600`}>
                  {prize.icon}
                  <h3 className="font-bold text-lg ml-2 text-gray-800">{prize.title}</h3>
                </div>
                <div className={`text-2xl font-bold text-${prize.color}-600 mb-2`}>{prize.amount}</div>
                <p className="text-sm text-gray-700">{prize.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
            <h3 className="font-bold text-lg text-purple-800 mb-4 flex items-center">
              <GiftIcon className="w-6 h-6 mr-2" />
              Giải Thưởng Khác
            </h3>
            <div className="space-y-2 text-gray-700">
              <div>• <strong>Nút GOLD các vòng đấu:</strong> Phần quà và giấy khen</div>
              <div>• <strong>Thí sinh vào chung kết:</strong> Giấy chứng nhận</div>
              <div>• <strong>Đặc quyền khóa 2022:</strong> Được vào thẳng vòng bán kết</div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header với hiệu ứng parallax */}
      <div 
        className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-800 text-white overflow-hidden"
      >
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-cyan-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-12 h-12 bg-white rounded-full opacity-10 animate-bounce"></div>
        </div>
        
        <div className="relative container mx-auto px-6 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <TrophyIcon className="w-16 h-16 text-yellow-400" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
              OLYMPIC TIN HỌC 2025
            </h1>
            <p className="text-xl md:text-2xl text-cyan-200 mb-8">ĐẤU TRƯỜNG SỐ</p>
            <button
              onClick={downloadFile}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center mx-auto"
            >
              <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
              Tải Thể Lệ Chi Tiết
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="sticky top-0 bg-white shadow-lg z-50 border-b border-blue-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center space-x-1 py-4">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => toggleSection(section.id)}
                className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeSection === section.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                {section.icon}
                <span className="ml-2 hidden sm:inline">{section.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-8 py-6 text-left hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                      {section.icon}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">{section.title}</h2>
                  </div>
                  {expandedSections.has(section.id) ? (
                    <ChevronDownIcon className="w-6 h-6 text-gray-500" />
                  ) : (
                    <ChevronRightIcon className="w-6 h-6 text-gray-500" />
                  )}
                </div>
              </button>
              
              {expandedSections.has(section.id) && (
                <div className="px-8 pb-8 animate-in slide-in-from-top duration-300">
                  {section.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-900 to-cyan-800 text-white py-8 mt-16">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center items-center mb-4">
            <TrophyIcon className="w-8 h-8 text-yellow-400 mr-3" />
            <h3 className="text-xl font-bold">Olympic Tin Học 2025</h3>
          </div>
          <p className="text-blue-200 mb-4">Đấu Trường Số - Nơi tài năng IT tỏa sáng</p>
          <div className="flex justify-center space-x-4">
            <a href="https://www.facebook.com/olympicit.caothang/" 
               className="text-blue-300 hover:text-white transition-colors">
              <GlobeAltIcon className="w-6 h-6" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OlympicIT2025Rules;