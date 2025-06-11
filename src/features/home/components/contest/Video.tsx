import { PlayIcon, StarIcon, BoltIcon, SpeakerWaveIcon } from '@heroicons/react/24/outline';

const VideoSection = () => {
  return (
    <div className="group relative py-8">
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 p-1 rounded-3xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 transform hover:scale-[1.02] hover:-rotate-1">
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-3 border-b border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <div className="flex items-center space-x-2 text-blue-600">
                <PlayIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Live Stream</span>
              </div>
            </div>
          </div>
          <div className="relative aspect-video bg-gray-900">
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/sF3odX1YNOI?si=uwHrzkuLJ_o2CPOD"
              title="YouTube video player"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-blue-500/10 pointer-events-none"></div>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-800 text-sm">Giới thiệu cuộc thi</h3>
                <p className="text-xs text-gray-600">Hướng dẫn tham gia chi tiết</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center text-green-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
                  <span className="text-xs font-medium">LIVE</span>
                </div>
                <SpeakerWaveIcon className="w-4 h-4 text-blue-500" />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
          <StarIcon className="w-3 h-3 text-white" />
        </div>
        <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
          <BoltIcon className="w-3 h-3 text-white" />
        </div>
      </div>
      <div className="mt-4">
        <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold text-sm hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25 flex items-center justify-center space-x-2">
          <PlayIcon className="w-4 h-4" />
          <a href="https://www.youtube.com/@OlympicTinh%E1%BB%8DcC%C4%90KTCaoTh%E1%BA%AFng" target='_blank'>Xem thêm video</a>
        </button>
      </div>
    </div>
  );
};

export default VideoSection;