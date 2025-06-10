import  { useState, useEffect } from 'react';
import { CalendarIcon, ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const News = () => {
  const news = [
    {
      id: 1,
      title: "Sinh viên công nghệ thông tin ''lập trình'' tư duy để làm chủ AI",
      date: "17/04/2025",
      image: "https://caothang.edu.vn/uploads/images/Tin_Tuc/Tin_Giao_Duc/LaptrinhAI_CT_1.jpg",
      excerpt: "(NLĐO) - Chuyên gia tại ngày hội 'Công nghệ AI' đã chia sẻ nhiều góc khuất liên quan...",
      link: "https://cntt.caothang.edu.vn/tin-tuc/sinh-vien-lap-trinh-ai"
    },
    {
      id: 2,
      title: "Nvidia hợp tác với Cao đẳng Kỹ thuật Cao Thắng thúc đẩy ứng dụng AI",
      date: "18/04/2025",
      image: "https://caothang.edu.vn/uploads/images/Tin_Tuc/Tin_Giao_Duc/Nvidia_CaoThang.jpg",
      excerpt: "Trường cao đẳng Kỹ thuật Cao Thắng và Nvidia Việt Nam vừa ký kết biên bản ghi nhớ hợp tác...",
      link: "https://cntt.caothang.edu.vn/tin-tuc/nvidia-hop-tac-cao-thang"
    },
    {
      id: 3,
      title: "KẾT NỐI DOANH NGHIỆP – NÂNG TẦM TRI THỨC, MỞ RA CƠ HỘI",
      date: "15/03/2025",
      image: "https://scontent.fsgn5-9.fna.fbcdn.net/v/t39.30808-6/493307266_1200128022123632_3222795843794633181_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHqyI3qpu3nSjYiWoZdiXGQLcPOnVlDABYtw86dWUMAFozejyHKdJKogaz1GDI2REapyOnI3tBytVTQ0DhtCj9m&_nc_ohc=_XKaaw6jfwsQ7kNvwGSVlNZ&_nc_oc=AdmDgONCijGUiljNzUNw_qW4eGtJerQGzTlAz7BxrdXmo7Oh9hqSyP8V8vUV073tWUA&_nc_zt=23&_nc_ht=scontent.fsgn5-9.fna&_nc_gid=QmHBNO4NqMfwv-SjkMUffw&oh=00_AfNnn8eA6a_cJkX8li2a34EKtjodQmmiBi9gAS4NXW7bfw&oe=684DBF84",
      excerpt: "Trong thời đại công nghệ phát triển mạnh mẽ, sự kết nối giữa đào tạo và thực tiễn ngày càng...",
      link: "https://cntt.caothang.edu.vn/tin-tuc/ket-noi-doanh-nghiep"
    },
    {
      id: 4,
      title: "Quán quân Olympic Tin học Cao Thắng 2025 chính thức lộ diện",
      date: "18/04/2025",
      image: "https://caothang.edu.vn/uploads/images/Tin_Tuc/Tin_Giao_Duc/Olympic_TinHoc_CT_1.jpg",
      excerpt: "Ngày 17/4, vòng chung kết cuộc thi “Olympic Tin học 2025 - Đấu trường số” tại Trường Cao đẳng Kỹ thuật Cao Thắng (TP. Hồ Chí Minh) đã khép lại...",
      link: "https://caothang.edu.vn/Quan-quan-Olympic-Tin-hoc-Cao-Thang-2025-chinh-thuc-lo-dien.html#:~:text=Nguy%E1%BB%85n%20V%C4%83n%20%C4%90%E1%BB%A9c%20-%20sinh%20vi%C3%AAn%20Cao%20%C4%91%E1%BA%B3ng,%E2%80%9COlympic%20Tin%20h%E1%BB%8Dc%202025%20-%20%C4%90%E1%BA%A5u%20tr%C6%B0%E1%BB%9Dng%20s%E1%BB%91%E2%80%9D."
    },
    {
      id: 5,
      title: "Trường CĐ Kỹ thuật Cao Thắng TP HCM tuyển sinh với nhiều học bổng",
      date: "06/05/2025",
      image: "https://caothang.edu.vn/uploads/images/Tin_Tuc/Tin_Giao_Duc/NDL_CT_TS_2025.jpg",
      excerpt: "(NLĐO) - Sau khi Bộ GD-ĐT ban hành hướng dẫn tuyển sinh, Trường CĐ Kỹ thuật Cao Thắng đã có thông báo tuyển sinh chính thức...",
      link: "https://caothang.edu.vn/Truong-CD-Ky-thuat-Cao-Thang-TP-HCM-tuyen-sinh-voi-nhieu-hoc-bong.html"
    },
     {
      id: 6,
      title: "Sinh viên TP HCM xem kể chuyện sử để nhớ về hào khí dân tộc",
      date: "09/04/2025",
      image: "https://caothang.edu.vn/uploads/images/Tin_Tuc/Tin_Giao_Duc/ke_su_qua_phim_1.jpg",
      excerpt: "Cuộc thi quy mô lớn nhất năm dành cho sinh viên IT vớNgày 8-4, hơn 130 sinh viên đến từ...",
      link: "https://caothang.edu.vn/Sinh-vien-TP-HCM-xem-ke-chuyen-su-de-nho-ve-hao-khi-dan-toc.html"
    }

  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = Math.ceil(news.length / 3);

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(interval);
  }, [totalSlides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  

  return (
    <section id="news" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Tin tức & Sự kiện</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Cập nhật những thông tin mới nhất về hoạt động đào tạo và các sự kiện tại khoa
          </p>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-blue-50 group"
            aria-label="Previous news"
          >
            <ChevronLeftIcon className="w-6 h-6 text-gray-600 group-hover:text-blue-600" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-blue-50 group"
            aria-label="Next news"
          >
            <ChevronRightIcon className="w-6 h-6 text-gray-600 group-hover:text-blue-600" />
          </button>

          {/* News Grid */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid md:grid-cols-3 gap-8 px-8">
                    {news.slice(slideIndex * 3, slideIndex * 3 + 3).map((item) => (
                      <article 
                        key={item.id} 
                        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
                      >
                        <a 
                          href={item.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block cursor-pointer"
                        >
                          <div className="h-48 relative overflow-hidden">
                            <img 
                              src={item.image} 
                              alt={item.title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0  group-hover:bg-opacity-10 transition-all duration-300" />
                            <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full">
                              <span className="text-sm font-semibold text-gray-800 flex items-center">
                                <CalendarIcon className="w-4 h-4 mr-1" />
                                {item.date}
                              </span>
                            </div>
                          </div>
                          <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                              {item.title}
                            </h3>
                            <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">{item.excerpt}</p>
                            <div className="text-blue-600 font-semibold hover:text-blue-800 transition-colors flex items-center">
                              Đọc thêm <ArrowRightIcon className="ml-2 w-4 h-4" />
                            </div>
                          </div>
                        </a>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-blue-600 w-8' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default News;