import { useState, useEffect } from 'react';
import { 
  CodeBracketIcon, 
  TrophyIcon, 
  UserGroupIcon, 
  CalendarIcon, 
  ChevronRightIcon, 
  StarIcon, 
  BoltIcon, 
  EyeIcon, 
  ChevronLeftIcon 
} from '@heroicons/react/24/outline';

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Banner data
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
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Banner slideshow effect - every 5 seconds
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
    { number: "5000+", label: "Thí sinh tham gia" },
    { number: "50+", label: "Trường đại học" },
    { number: "100M+", label: "Tổng giải thưởng" },
    { number: "95%", label: "Tỷ lệ hài lòng" }
  ];

  const testimonials = [
    {
      name: "Nguyễn Văn A",
      school: "ĐH Bách Khoa Hà Nội",
      text: "Cuộc thi đã giúp tôi phát triển kỹ năng lập trình và mở ra nhiều cơ hội nghề nghiệp."
    },
    {
      name: "Trần Thị B",
      school: "ĐH Khoa học Tự nhiên",
      text: "Môi trường thi đấu chuyên nghiệp và thử thách thực sự thú vị!"
    },
    {
      name: "Lê Minh C",
      school: "ĐH FPT",
      text: "Tôi đã học được rất nhiều từ các bài toán và đối thủ xuất sắc."
    }
  ];

  const nextBanner = () => {
    setCurrentBanner(prev => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBanner(prev => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 text-gray-800 overflow-hidden">
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

      {/* Navigation */}
      <nav className="relative z-10 p-6 bg-white/90 backdrop-blur-sm border-b border-blue-200 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <CodeBracketIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              CodeChallenge
            </span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">Trang chủ</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">Cuộc thi</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">Quy định</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">Liên hệ</a>
          </div>
          <button className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-2 rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25 text-white">
            Đăng ký ngay
          </button>
        </div>
      </nav>

      {/* Banner Slideshow */}
      <section className="relative z-10 h-96 overflow-hidden">
        <div className="relative w-full h-full">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-all duration-1000 ${
                index === currentBanner 
                  ? 'opacity-100 translate-x-0' 
                  : index < currentBanner 
                    ? 'opacity-0 -translate-x-full' 
                    : 'opacity-0 translate-x-full'
              }`}
            >
              <div 
                className="w-full h-full bg-cover bg-center relative"
                style={{ backgroundImage: `url(${banner.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-blue-800/50"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center max-w-4xl px-6">
                    <h2 className="text-4xl md:text-6xl font-bold mb-4 text-white drop-shadow-2xl">
                      {banner.title}
                    </h2>
                    <p className="text-xl md:text-2xl text-blue-100 mb-8 drop-shadow-xl">
                      {banner.subtitle}
                    </p>
                    <button className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-xl">
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
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
          >
            <ChevronLeftIcon className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={nextBanner}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
          >
            <ChevronRightIcon className="w-6 h-6 text-white" />
          </button>
          
          {/* Dots indicator */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentBanner === index ? 'bg-blue-400 scale-125' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent leading-tight">
              CUỘC THI TIN HỌC
              <br />
              <span className="text-4xl md:text-6xl block mt-2 animate-pulse">2025</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Nơi những tài năng lập trình hội tụ, thách thức bản thân và chinh phục những đỉnh cao công nghệ
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="group bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-blue-500/30 flex items-center space-x-2">
                <span>Tham gia ngay</span>
                <ChevronRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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

      {/* Testimonials Section */}
      <section className="relative z-10 px-6 py-20 bg-blue-50/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
            Lời chứng thực
          </h2>
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <div className="bg-white/90 p-8 rounded-2xl backdrop-blur-sm border border-blue-200 max-w-2xl mx-auto shadow-lg">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4">
                        <StarIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-gray-800">{testimonial.name}</h4>
                        <p className="text-blue-600 text-sm">{testimonial.school}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 italic text-lg leading-relaxed">
                      "{testimonial.text}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentSlide === index ? 'bg-blue-600 scale-125' : 'bg-blue-300'
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
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
      <footer className="relative z-10 bg-white/90 backdrop-blur-sm px-6 py-12 border-t border-blue-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <CodeBracketIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                CodeChallenge 2025
              </span>
            </div>
            <div className="text-gray-600 text-sm">
              © 2025 CodeChallenge. Tất cả quyền được bảo lưu.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;