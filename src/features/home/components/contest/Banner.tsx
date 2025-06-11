import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

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

const BannerSlideshow = () => {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const bannerInterval = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(bannerInterval);
  }, []);

  const nextBanner = () => setCurrentBanner(prev => (prev + 1) % banners.length);
  const prevBanner = () => setCurrentBanner(prev => (prev - 1 + banners.length) % banners.length);

  return (
    <section className="relative z-10 overflow-hidden px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="relative w-full aspect-[16/9] lg:h-96">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-all duration-700 ease-in-out rounded-2xl overflow-hidden ${
                index === currentBanner ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
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
      </div>
    </section>
  );
};

export default BannerSlideshow;