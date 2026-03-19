import { 
  UsersIcon, 
  CalendarDaysIcon, 
  TrophyIcon, 
  BookOpenIcon,
  PlayIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

const ContestRulesSection = () => {
  const contestInfo = [
    {
      icon: <UsersIcon className="w-8 h-8" />,
      title: "Đối tượng tham gia",
      description: "Tất cả các lớp thuộc khoa CNTT"
    },
    {
      icon: <CalendarDaysIcon className="w-8 h-8" />,
      title: "Thời gian tổ chức",
      description: "24/03 - 30/03: Vòng sơ loại • 31/03 - 13/04: Tứ kết & Bán kết • 14/04 - 20/04: Chung kết"
    },
    {
      icon: <BookOpenIcon className="w-8 h-8" />,
      title: "8 Lĩnh vực kiến thức",
      description: "Lập trình C/C++, CSDL, Phần cứng & Mạng, Ứng dụng CNTT, Thiết kế Website, Công nghệ phần mềm, Tin tức công nghệ, Anh văn chuyên ngành"
    }
  ];

  const rounds = [
    {
      icon: <AcademicCapIcon className="w-6 h-6" />,
      title: "Vòng sơ loại",
      format: "Thi trực tiếp tại lớp",
      details: "30 câu hỏi trắc nghiệm • Chọn 20 thí sinh xuất sắc nhất"
    },
    {
      icon: <PlayIcon className="w-6 h-6" />,
      title: "Tứ kết & Bán kết", 
      format: "Đấu trường số",
      details: "Video giới thiệu đội • 13 câu hỏi 4 mức độ • Chọn 60 thí sinh vào chung kết"
    },
    {
      icon: <TrophyIcon className="w-6 h-6" />,
      title: "Chung kết",
      format: "Đấu trường số",
      details: "Tranh tài quyết liệt • Chọn 3 thí sinh xuất sắc nhất • Cơ hội nhận nút GOLD"
    }
  ];

  const battleArenaLevels = [
    { name: "Alpha", questions: 4, time: "15s", color: "bg-green-100 text-green-800 border-green-200" },
    { name: "Beta", questions: 4, time: "20s", color: "bg-blue-100 text-blue-800 border-blue-200" },
    { name: "RC", questions: 4, time: "30s", color: "bg-purple-100 text-purple-800 border-purple-200" },
    { name: "GOLD", questions: 1, time: "30s", color: "bg-yellow-100 text-yellow-800 border-yellow-200" }
  ];

  const prizes = [
    { rank: "Giải Nhất", amount: "3.000.000đ", icon: "🥇" },
    { rank: "Giải Nhì", amount: "2.000.000đ", icon: "🥈" },
    { rank: "Giải Ba", amount: "1.000.000đ", icon: "🥉" },
    { rank: "Video ấn tượng", amount: "1.000.000đ", icon: "🎬" }
  ];

  return (
    <section className="relative z-10 px-6 py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
            Thể lệ cuộc thi
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Olympic Tin Học 2026 - Đấu Trường Số
          </p>
        </div>

        {/* Contest Basic Info */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {contestInfo.map((info, index) => (
            <div
              key={index}
              className="group bg-white p-8 rounded-2xl border border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all duration-500 hover:transform hover:scale-105 shadow-lg"
            >
              <div className="text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                {info.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                {info.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {info.description}
              </p>
            </div>
          ))}
        </div>

        {/* Rounds */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Các vòng thi
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {rounds.map((round, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="text-blue-600 mr-3">
                    {round.icon}
                  </div>
                  <h4 className="font-bold text-lg text-gray-800">{round.title}</h4>
                </div>
                <div className="mb-3">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {round.format}
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {round.details}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Battle Arena Format */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Hình thức "Đấu trường số"
          </h3>
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {battleArenaLevels.map((level, index) => (
                <div key={index} className={`${level.color} border rounded-lg p-4 text-center`}>
                  <div className="font-bold text-lg mb-2">{level.name}</div>
                  <div className="text-sm">
                    {level.questions} câu hỏi
                  </div>
                  <div className="text-sm font-medium">
                    {level.time}/câu
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center text-gray-600">
              <p className="mb-2">
                <strong>Đặc biệt:</strong> Có tính năng "Cứu trợ hồi sinh" và "Phao cứu trợ"
              </p>
              <p>
                Thí sinh nhận nút <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-bold">GOLD</span> sẽ được vòng nguyệt quế và phần thưởng đặc biệt
              </p>
            </div>
          </div>
        </div>

        {/* Prizes */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Giải thưởng
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {prizes.map((prize, index) => (
              <div key={index} className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200 text-center hover:shadow-lg transition-all duration-300">
                <div className="text-4xl mb-3">{prize.icon}</div>
                <h4 className="font-bold text-lg text-gray-800 mb-2">{prize.rank}</h4>
                <div className="text-2xl font-bold text-orange-600">{prize.amount}</div>
                <div className="text-sm text-gray-600 mt-1">+ Giấy khen</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContestRulesSection;