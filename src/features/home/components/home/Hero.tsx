import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ArrowRightIcon, PlayIcon } from '@heroicons/react/24/outline';
import type { HeroSlide } from '../../types/home/HeroSlide';

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides: HeroSlide[] = [
    {
      title: "Trường Cao đẳng Kỹ Thuật Cao Thắng",
      subtitle: "Khoa Công nghệ Thông tin",
      description: "Đào tạo nguồn nhân lực chất lượng cao trong lĩnh vực Công nghệ Thông tin",
      image: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      cta: "Khám phá ngay"
    },
    {
      title: "Chương trình đào tạo hiện đại",
      subtitle: "Theo chuẩn quốc tế",
      description: "Trang bị kiến thức và kỹ năng thực tế để sinh viên sẵn sàng cho thị trường lao động",
      image: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      cta: "Tìm hiểu thêm"
    },
    {
      title: "Cơ sở vật chất tiên tiến",
      subtitle: "Phòng lab hiện đại",
      description: "Hệ thống phòng thí nghiệm và thiết bị học tập đáp ứng yêu cầu đào tạo chất lượng cao",
      image: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      cta: "Xem cơ sở vật chất"
    },
    {
      title: "Kết nối doanh nghiệp",
      subtitle: "Cơ hội việc làm",
      description: "Hợp tác với hơn 50 doanh nghiệp hàng đầu để đảm bảo cơ hội việc làm cho sinh viên",
      image: "linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)",
      cta: "Xem cơ hội việc làm"
    },
    {
      title: "Tuyển sinh 2025",
      subtitle: "Đăng ký ngay",
      description: "Nhiều chính sách ưu đãi hấp dẫn dành cho tân sinh viên năm học 2025-2026",
      image: "linear-gradient(135deg, #36d1dc 0%, #5b86e5 100%)",
      cta: "Đăng ký tư vấn"
    }
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    fade: true,
    pauseOnHover: true,
    afterChange: (index: number) => setCurrentSlide(index)
  };

  return (
    <section className="relative h-screen overflow-hidden">
      <Slider {...sliderSettings}>
        {heroSlides.map((slide, index) => (
          <div key={index} className="relative h-screen">
            <div 
              className="absolute inset-0"
              style={{ background: slide.image }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50" />
            </div>
            <div className="relative h-full flex items-center justify-center text-center text-white px-4">
              <div className="max-w-4xl animate-fade-in">
                <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
                  {slide.title}
                </h1>
                <h2 className="text-2xl md:text-3xl mb-6 text-blue-200">
                  {slide.subtitle}
                </h2>
                <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
                  {slide.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-white text-gray-800 px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center">
                    {slide.cta} <ArrowRightIcon className="ml-2 w-5 h-5" />
                  </button>
                  {index === 0 && (
                    <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-gray-800 transition-all duration-300 flex items-center justify-center">
                      <PlayIcon className="mr-2 w-5 h-5" /> Video giới thiệu
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-white scale-125' : 'bg-white bg-opacity-50'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;