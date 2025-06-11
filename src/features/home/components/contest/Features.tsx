import { CodeBracketIcon, TrophyIcon, UserGroupIcon } from '@heroicons/react/24/outline';

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

const FeaturesSection = () => {
  return (
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
  );
};

export default FeaturesSection;