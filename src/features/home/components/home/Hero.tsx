import React, { useState, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ArrowRightIcon, PlayIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import type { HeroSlide } from '../../types/home/HeroSlide';

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<Slider>(null);

  const heroSlides: HeroSlide[] = [
    {
      title: 'Trường Cao đẳng Kỹ Thuật Cao Thắng',
      subtitle: 'Khoa Công nghệ Thông tin',
      description: 'Đào tạo nguồn nhân lực chất lượng cao trong lĩnh vực Công nghệ Thông tin',
      image: 'https://caothang.edu.vn/uploads/images/Tin_Tuc/tin_cao_thang/2020/CaoThang_HSSV-gioi-nghe-2020_2.jpg',
      cta: 'Khám phá ngay',
    },
    {
      title: 'Chương trình đào tạo hiện đại',
      subtitle: 'Theo chuẩn quốc tế',
      description: 'Trang bị kiến thức và kỹ năng thực tế để sinh viên sẵn sàng cho thị trường lao động',
      image: 'https://caothang.edu.vn/uploads/images/Tin_Tuc/Tin_Giao_Duc/LaptrinhAI_CT_1.jpg',
      cta: 'Tìm hiểu thêm',
    },
    {
      title: 'Cơ sở vật chất tiên tiến',
      subtitle: 'Phòng lab hiện đại',
      description: 'Hệ thống phòng thí nghiệm và thiết bị học tập đáp ứng yêu cầu đào tạo chất lượng cao',
      image: 'https://cntt.caothang.edu.vn/uploads/media/Ho%E1%BA%A1t%20%C4%91%E1%BB%99ng/KyNangTinHocVP2425/TongQuan3.png',
      cta: 'Xem cơ sở vật chất',
    },
    {
      title: 'Kết nối doanh nghiệp',
      subtitle: 'Cơ hội việc làm',
      description: 'Hợp tác với hơn 50 doanh nghiệp hàng đầu để đảm bảo cơ hội việc làm cho sinh viên',
      image: 'https://caothang.edu.vn/uploads/images/Tin_Tuc/Tin_Giao_Duc/LaptrinhAI_CT_3.jpg',
      cta: 'Xem cơ hội việc làm',
    },
    {
      title: 'Tuyển sinh 2025',
      subtitle: 'Đăng ký ngay',
      description: 'Nhiều chính sách ưu đãi hấp dẫn dành cho tân sinh viên năm học 2025-2026',
      image: 'https://caothang.edu.vn/uploads/images/Tin_Tuc/Tin_Giao_Duc/LaptrinhAI_CT_2.jpg',
      cta: 'Đăng ký tư vấn',
    },
  ];

  const sliderSettings = {
    dots: false, // Tắt dots mặc định vì chúng ta có custom dots
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000, // Tự động chuyển slide mỗi 5 giây
    arrows: false, // Tắt arrows mặc định vì chúng ta có custom arrows
    fade: true,
    pauseOnHover: true, // Tạm dừng khi hover
    pauseOnFocus: true, // Tạm dừng khi focus
    pauseOnDotsHover: true, // Tạm dừng khi hover vào dots
    afterChange: (index: number) => setCurrentSlide(index),
  };

  // Hàm trả về style cho background hình ảnh
  const getBackgroundStyle = (image: string) => ({
    backgroundImage: `url(${image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  });

  // Hàm chuyển slide
  const goToNext = () => {
    sliderRef.current?.slickNext();
  };

  const goToPrev = () => {
    sliderRef.current?.slickPrev();
  };

  const goToSlide = (index: number) => {
    sliderRef.current?.slickGoTo(index);
    setCurrentSlide(index);
  };

  return (
    <section id="hero" className="relative h-screen overflow-hidden">
      <Slider ref={sliderRef} {...sliderSettings}>
        {heroSlides.map((slide, index) => (
          <div key={index} className="relative h-screen">
            <div className="absolute inset-0" style={getBackgroundStyle(slide.image)}>
                <div 
                    className="absolute inset-0" 
                    style={{backgroundColor: 'rgba(0, 0, 0, 0.4)'}}
                ></div>
            </div>
            <div className="relative h-full flex items-center justify-center text-center text-white px-4">
              <div className="max-w-4xl animate-fade-in">
                <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">{slide.title}</h1>
                <h2 className="text-2xl md:text-3xl mb-6 text-blue-100">{slide.subtitle}</h2>
                <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed">{slide.description}</p>
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

      {/* Navigation Arrows */}
      <button
        onClick={goToPrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2  bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm z-10"
        aria-label="Previous slide"
      >
        <ChevronLeftIcon className="w-6 h-6" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm z-10"
        aria-label="Next slide"
      >
        <ChevronRightIcon className="w-6 h-6" />
      </button>

      {/* Custom Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-white scale-125' : 'bg-white bg-opacity-50'
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;