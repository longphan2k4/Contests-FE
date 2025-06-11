const stats = [
  { number: "1000+", label: "Thí sinh tham gia" },
  { number: "16+", label: "Lớp từ các khoa" },
  { number: "10M+", label: "Tổng giải thưởng" },
  { number: "95%", label: "Tỷ lệ hài lòng" }
];
const StatsSection = () => {
  return (
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
  );
};

export default StatsSection;