import { useState, useEffect } from 'react';
import Header from '../../../layouts/HomeLayout/HomeHeader';
import Footer from '../../../layouts/HomeLayout/HomeFooter';
import { 
  CodeBracketIcon, 
  TrophyIcon, 
  UserGroupIcon, 
  CalendarIcon, 
  ChevronRightIcon, 
  StarIcon, 
  BoltIcon, 
  EyeIcon, 
  ChevronLeftIcon,
  PlayIcon,
  CheckCircleIcon,
  ClockIcon,
  UserPlusIcon,
  ComputerDesktopIcon,
  SpeakerWaveIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

const ContestPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
 
  const banners = [
    {
      id: 1,
      title: "Cuộc Thi Lập Trình 2025",
      subtitle: "Thách thức coding hấp dẫn nhất năm",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=400&fit=crop",
      cta: "Đăng ký ngay"
    },
    {
      id: 2,
      title: "Giải Thưởng 100 Triệu VNĐ",
      subtitle: "Cơ hội nhận học bổng và quà tặng giá trị",
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&h=400&fit=crop",
      cta: "Xem chi tiết"
    },
    {
      id: 3,
      title: "Kết Nối Cộng Đồng Dev",
      subtitle: "Gặp gỡ và học hỏi từ các lập trình viên hàng đầu",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=400&fit=crop",
      cta: "Tham gia"
    },
    {
      id: 4,
      title: "Công Nghệ Mới Nhất",
      subtitle: "Thử thách với các framework và tools hiện đại",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=400&fit=crop",
      cta: "Khám phá"
    },
    {
      id: 5,
      title: "Cơ Hội Nghề Nghiệp",
      subtitle: "Mở ra con đường sự nghiệp lập trình viên chuyên nghiệp",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=400&fit=crop",
      cta: "Tìm hiểu"
    }
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const bannerInterval = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(bannerInterval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: <CodeBracketIcon className="w-8 h-8" />,
      title: "Lập trình Sáng tạo",
      description: "Thách thức khả năng tư duy logic và kỹ năng coding của bạn"
    },
    {
      icon: <TrophyIcon className="w-8 h-8" />,
      title: "Giải thưởng Hấp dẫn",
      description: "Cơ hội nhận học bổng và các giải thưởng giá trị"
    },
    {
      icon: <UserGroupIcon className="w-8 h-8" />,
      title: "Cộng đồng Mạnh mẽ",
      description: "Kết nối với các lập trình viên tài năng trên cả nước"
    }
  ];

  const stats = [
    { number: "1000+", label: "Thí sinh tham gia" },
    { number: "16+", label: "Lớp từ các khoa" },
    { number: "10M+", label: "Tổng giải thưởng" },
    { number: "95%", label: "Tỷ lệ hài lòng" }
  ];

  const timeline = [
  {
    date: "03/04/2025",
    title: "Tứ kết 1 - Tứ kết 2",
    description: "...",
    status: "completed",
    icon: "registration"
  },
  {
    date: "04/04/2025",
    title: "Tứ kết 3 - Tứ kết 4",
    description: "...",
    status: "completed",
    icon: "deadline"
  },
  {
    date: "09/04/2025",
    title: "Bán kết 1- Bán kết 2 - bán kết 3",
    description: "...",
    status: "completed",
    icon: "online"
  },
  {
    date: "17/04/2025",
    title: "Vòng chung kết",
    description: "Thi đấu trực tiếp tại trường, tranh tài các giải thưởng",
    status: "completed",
    icon: "final"
  },
  {
    date: "17/04/2025",
    title: "Lễ trao giải",
    description: "Trao giải thưởng và chứng nhận cho các thí sinh xuất sắc",
    status: "completed",
    icon: "award"
  }
];
  const nextBanner = () => {
    setCurrentBanner(prev => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBanner(prev => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 text-gray-800 overflow-hidden pt-20">
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Mouse follower effect */}
      <div
        className="fixed w-4 h-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full pointer-events-none mix-blend-screen opacity-70 transition-all duration-100 ease-out z-50"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
          transform: 'translate3d(0, 0, 0)'
        }}
      />

      {/* Header */}
      <Header />

      {/* Banner Slideshow */}
      <section className="relative z-10 overflow-hidden px-6 py-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[68%_30%] gap-6">
          {/* Left Column - Slideshow */}
          <div className="relative w-full aspect-[16/9] lg:h-96">
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-all duration-700 ease-in-out rounded-2xl overflow-hidden ${
                  index === currentBanner 
                    ? 'opacity-100 scale-100' 
                    : 'opacity-0 scale-105 pointer-events-none'
                }`}
              >
                <div 
                  className="w-full h-full bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${banner.image})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-blue-800/50"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center max-w-4xl px-6">
                      <h2 className="text-2xl md:text-5xl font-bold mb-4 text-white drop-shadow-2xl">
                        {banner.title}
                      </h2>
                      <p className="text-base md:text-xl text-blue-100 mb-6 drop-shadow-xl">
                        {banner.subtitle}
                      </p>
                      <button className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-2 md:px-8 md:py-3 rounded-full text-sm md:text-base font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-xl">
                        {banner.cta}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Navigation arrows */}
            <button
              onClick={prevBanner}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
            >
              <ChevronLeftIcon className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={nextBanner}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
            >
              <ChevronRightIcon className="w-5 h-5 text-white" />
            </button>
            
            {/* Dots indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBanner(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentBanner === index ? 'bg-blue-400 scale-125' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right Column - Enhanced Video Section */}
          <div className="group relative">
            {/* Video Container with Enhanced Design */}
            <div className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 p-1 rounded-3xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 transform hover:scale-[1.02] hover:-rotate-1">
              <div className="bg-white rounded-2xl overflow-hidden">
                {/* Video Header */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-3 border-b border-blue-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="flex items-center space-x-2 text-blue-600">
                      <PlayIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">Live Stream</span>
                    </div>
                  </div>
                </div>

                {/* Video Content */}
                <div className="relative aspect-video bg-gray-900">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src="https://www.youtube.com/embed/sF3odX1YNOI?si=uwHrzkuLJ_o2CPOD"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  ></iframe>
                  
                  {/* Video Overlay Effects */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-blue-500/10 pointer-events-none"></div>
                </div>

                {/* Video Info Panel */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm">Giới thiệu cuộc thi</h3>
                      <p className="text-xs text-gray-600">Hướng dẫn tham gia chi tiết</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center text-green-500">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
                        <span className="text-xs font-medium">LIVE</span>
                      </div>
                      <SpeakerWaveIcon className="w-4 h-4 text-blue-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <StarIcon className="w-3 h-3 text-white" />
              </div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <BoltIcon className="w-3 h-3 text-white" />
              </div>
            </div>

            {/* Call-to-Action Button */}
            <div className="mt-4">
              <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold text-sm hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25 flex items-center justify-center space-x-2">
                <PlayIcon className="w-4 h-4" />
                <a href="https://www.youtube.com/@OlympicTinh%E1%BB%8DcC%C4%90KTCaoTh%E1%BA%AFng" target='_blank'>Xem thêm video</a>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent leading-tight">
              CUỘC THI OLYMPIC TIN HỌC 2025
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Nơi những tài năng lập trình hội tụ, thách thức bản thân và chinh phục những đỉnh cao công nghệ
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="group bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-blue-500/30 flex items-center space-x-2">
                <span className='text-white'>Tham gia ngay</span>
                <ChevronRightIcon className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="border-2 border-blue-500 text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-500 hover:text-white transition-all duration-300 transform hover:scale-105">
                Tìm hiểu thêm
              </button>
            </div>
          </div>

          {/* Floating elements */}
          <div className="absolute top-20 left-10 animate-bounce" style={{ animationDelay: '0.5s' }}>
            <BoltIcon className="w-8 h-8 text-yellow-400" />
          </div>
          <div className="absolute top-32 right-16 animate-bounce" style={{ animationDelay: '1s' }}>
            <StarIcon className="w-6 h-6 text-blue-300" />
          </div>
          <div className="absolute bottom-20 left-16 animate-bounce" style={{ animationDelay: '1.5s' }}>
            <EyeIcon className="w-7 h-7 text-green-400" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 px-6 py-16 bg-blue-50/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center transform hover:scale-110 transition-all duration-300"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
            Tại sao chọn chúng tôi?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white/80 p-8 rounded-2xl backdrop-blur-sm border border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all duration-500 hover:transform hover:scale-105 shadow-lg"
              >
                <div className="text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 py-20 bg-blue-50/80 backdrop-blur-sm">
  <div className="max-w-7xl mx-auto">
    <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
      Lịch trình cuộc thi
    </h2>
    
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-200 via-blue-400 to-blue-600 rounded-full"></div>
      
      {/* Timeline items */}
      <div className="space-y-12">
        {timeline.map((item, index) => {
          const isLeft = index % 2 === 0;
          
          // Icon selection
          const getIcon = () => {
            switch(item.icon) {
              case 'registration': return <UserPlusIcon className="w-6 h-6" />;
              case 'deadline': return <ClockIcon className="w-6 h-6" />;
              case 'online': return <ComputerDesktopIcon className="w-6 h-6" />;
              case 'announcement': return <SpeakerWaveIcon className="w-6 h-6" />;
              case 'final': return <AcademicCapIcon className="w-6 h-6" />;
              case 'award': return <TrophyIcon className="w-6 h-6" />;
              default: return <CalendarIcon className="w-6 h-6" />;
            }
          };
          
          // Status colors
          const getStatusColor = () => {
            switch(item.status) {
              case 'completed': return 'from-green-400 to-green-600';
              case 'current': return 'from-blue-400 to-blue-600';
              case 'upcoming': return 'from-gray-300 to-gray-500';
              default: return 'from-gray-300 to-gray-500';
            }
          };
          
          const getStatusBg = () => {
            switch(item.status) {
              case 'completed': return 'bg-green-200 border-green-400';
              case 'current': return 'bg-blue-50 border-blue-200';
              case 'upcoming': return 'bg-gray-50 border-gray-200';
              default: return 'bg-gray-50 border-gray-200';
            }
          };
          
          return (
            <div key={index} className={`relative flex items-center ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
              {/* Content */}
              <div className={`w-5/12 ${isLeft ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                <div className={`${getStatusBg()} p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm`}>
                  <div className={`text-sm font-semibold mb-2 ${item.status === 'completed' ? 'text-green-600' : item.status === 'current' ? 'text-blue-600' : 'text-gray-500'}`}>
                    {item.date}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                  
                  {/* Status badge */}
                  <div className="mt-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      item.status === 'completed' ? 'bg-green-100 text-green-800' :
                      item.status === 'current' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {item.status === 'completed' && <CheckCircleIcon className="w-3 h-3 mr-1" />}
                      {item.status === 'current' && <ClockIcon className="w-3 h-3 mr-1" />}
                      {item.status === 'upcoming' && <CalendarIcon className="w-3 h-3 mr-1" />}
                      {item.status === 'completed' ? 'Hoàn thành' : 
                       item.status === 'current' ? 'Đang diễn ra' : 'Sắp diễn ra'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Center icon */}
              <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                <div className={`w-16 h-16 bg-gradient-to-r ${getStatusColor()} rounded-full flex items-center justify-center shadow-lg border-4 border-white`}>
                  <div className="text-white">
                    {getIcon()}
                  </div>
                </div>
                
                {/* Pulse effect for current item */}
                {item.status === 'current' && (
                  <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20"></div>
                )}
              </div>
              
              {/* Empty space for the other side */}
              <div className="w-5/12"></div>
            </div>
          );
        })}
      </div>
      
      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-lg"></div>
      </div>
    </div>
  </div>
</section>

      {/* Call to Action */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
            Sẵn sàng thách thức bản thân?
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Đăng ký ngay hôm nay và trở thành một phần của cộng đồng lập trình viên hàng đầu Việt Nam
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group bg-gradient-to-r from-blue-500 to-blue-600 px-10 py-4 rounded-full text-lg font-bold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/30 flex items-center justify-center space-x-2">
              <CalendarIcon className="w-5 h-5" />
              <span>Đăng ký thi đấu</span>
            </button>
            <button className="border-2 border-blue-500 text-blue-600 px-10 py-4 rounded-full text-lg font-bold hover:bg-blue-500 hover:text-white transition-all duration-300 transform hover:scale-105">
              Xem lịch thi
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ContestPage;