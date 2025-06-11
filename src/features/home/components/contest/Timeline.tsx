import { UserPlusIcon, ClockIcon, ComputerDesktopIcon, SpeakerWaveIcon, AcademicCapIcon, TrophyIcon, CheckCircleIcon, CalendarIcon } from '@heroicons/react/24/outline';

 const timeline = [
  {
    date: "03/04/2025",
    title: "Tứ kết 1 - Tứ kết 2",
    description: "...",
    status: "completed",
    icon: "registration"
  },
  {
    date: "04/04/2025",
    title: "Tứ kết 3 - Tứ kết 4",
    description: "...",
    status: "completed",
    icon: "deadline"
  },
  {
    date: "09/04/2025",
    title: "Bán kết 1- Bán kết 2 - bán kết 3",
    description: "...",
    status: "completed",
    icon: "online"
  },
  {
    date: "17/04/2025",
    title: "Vòng chung kết",
    description: "Thi đấu trực tiếp tại trường, tranh tài các giải thưởng",
    status: "completed",
    icon: "final"
  },
  {
    date: "17/04/2025",
    title: "Lễ trao giải",
    description: "Trao giải thưởng và chứng nhận cho các thí sinh xuất sắc",
    status: "completed",
    icon: "award"
  }
];

const TimelineSection = () => {
  const getIcon = (icon: string) => {
    switch(icon) {
      case 'registration': return <UserPlusIcon className="w-6 h-6" />;
      case 'deadline': return <ClockIcon className="w-6 h-6" />;
      case 'online': return <ComputerDesktopIcon className="w-6 h-6" />;
      case 'announcement': return <SpeakerWaveIcon className="w-6 h-6" />;
      case 'final': return <AcademicCapIcon className="w-6 h-6" />;
      case 'award': return <TrophyIcon className="w-6 h-6" />;
      default: return <CalendarIcon className="w-6 h-6" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'from-green-400 to-green-600';
      case 'current': return 'from-blue-400 to-blue-600';
      case 'upcoming': return 'from-gray-300 to-gray-500';
      default: return 'from-gray-300 to-gray-500';
    }
  };

  const getStatusBg = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-200 border-green-400';
      case 'current': return 'bg-blue-50 border-blue-200';
      case 'upcoming': return 'bg-gray-50 border-gray-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <section className="relative z-10 px-6 py-20 bg-blue-50/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
          Lịch trình cuộc thi
        </h2>
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-200 via-blue-400 to-blue-600 rounded-full"></div>
          <div className="space-y-12">
            {timeline.map((item, index) => {
              const isLeft = index % 2 === 0;
              return (
                <div key={index} className={`relative flex items-center ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-5/12 ${isLeft ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className={`${getStatusBg(item.status)} p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm`}>
                      <div className={`text-sm font-semibold mb-2 ${item.status === 'completed' ? 'text-green-600' : item.status === 'current' ? 'text-blue-600' : 'text-gray-500'}`}>
                        {item.date}
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-gray-800">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="mt-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === 'completed' ? 'bg-green-100 text-green-800' :
                          item.status === 'current' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {item.status === 'completed' && <CheckCircleIcon className="w-3 h-3 mr-1" />}
                          {item.status === 'current' && <ClockIcon className="w-3 h-3 mr-1" />}
                          {item.status === 'upcoming' && <CalendarIcon className="w-3 h-3 mr-1" />}
                          {item.status === 'completed' ? 'Hoàn thành' : 
                           item.status === 'current' ? 'Đang diễn ra' : 'Sắp diễn ra'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                    <div className={`w-16 h-16 bg-gradient-to-r ${getStatusColor(item.status)} rounded-full flex items-center justify-center shadow-lg border-4 border-white`}>
                      <div className="text-white">
                        {getIcon(item.icon)}
                      </div>
                    </div>
                    {item.status === 'current' && (
                      <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20"></div>
                    )}
                  </div>
                  <div className="w-5/12"></div>
                </div>
              );
            })}
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-lg"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;