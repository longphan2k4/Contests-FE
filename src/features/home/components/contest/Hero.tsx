import { useState, useEffect } from 'react';
import { BoltIcon, StarIcon, EyeIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
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
  );
};

export default HeroSection;