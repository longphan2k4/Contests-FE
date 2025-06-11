import { CalendarIcon } from '@heroicons/react/24/outline';

const CallToActionSection = () => {
  return (
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
  );
};

export default CallToActionSection;