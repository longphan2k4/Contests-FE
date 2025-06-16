import React, { useState, useEffect } from 'react';

// Định nghĩa type cho trận đấu
interface Match {
  id: number;
  match_name: string;
  start_time: string;
}

const SelectedMatch: React.FC = () => {
  // State quản lý mock data
  const [matches] = useState<Match[]>([
    { id: 1, match_name: 'Trận 1', start_time: '2025-06-13T10:00:00' },
    { id: 2, match_name: 'Trận 2', start_time: '2025-06-13T14:00:00' },
    { id: 3, match_name: 'Trận chung kết', start_time: '2025-06-13T18:00:00' },
  ]);
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);
  const [isEntering, setIsEntering] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Xử lý vào phòng
  const handleEnterRoom = () => {
    if (!selectedMatch) {
      // Custom alert với animation
      const alertDiv = document.createElement('div');
      alertDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce';
      alertDiv.textContent = 'Vui lòng chọn một trận đấu!';
      document.body.appendChild(alertDiv);
      setTimeout(() => {
        alertDiv.remove();
      }, 3000);
      return;
    }
    
    setIsEntering(true);
    setTimeout(() => {
      window.alert(`Đang chuyển hướng đến trận đấu ${selectedMatch}`);
      // window.location.href = `/judge/${selectedMatch}`;
    }, 2000);
  };

  const selectedMatchData = matches.find(m => m.id === selectedMatch);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-30 animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          ></div>
        ))}
      </div>

      <div className={`relative z-10 w-full max-w-lg transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent mb-2">
                Chọn trận đấu
              </h2>
              <p className="text-white/70 text-sm">
                Lựa chọn trận đấu để bắt đầu chấm điểm
              </p>
            </div>

            {/* Match Selection */}
            <div className="mb-8">
              <label className="block text-white font-semibold mb-4 text-lg">
                Trận đấu:
              </label>
              <div className="relative">
                <select
                  className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer hover:bg-white/20"
                  value={selectedMatch ?? ''}
                  onChange={(e) => setSelectedMatch(Number(e.target.value))}
                >
                  <option value="" disabled className="bg-gray-800 text-white">
                    Chọn một trận đấu
                  </option>
                  {matches.map((match) => (
                    <option key={match.id} value={match.id} className="bg-gray-800 text-white">
                      {match.match_name} - {new Date(match.start_time).toLocaleString('vi-VN')}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Selected Match Preview */}
            {selectedMatchData && (
              <div className={`mb-6 p-4 bg-gradient-to-r from-green-400/20 to-blue-500/20 rounded-2xl border border-green-400/30 transition-all duration-500 ${selectedMatchData ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-white font-semibold">{selectedMatchData.match_name}</p>
                    <p className="text-white/70 text-sm">
                      {new Date(selectedMatchData.start_time).toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Enter Button */}
            <button
              className={`w-full relative overflow-hidden group transition-all duration-300 ${
                isEntering 
                ? 'bg-green-500 scale-95' 
                : 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 hover:scale-105'
              } text-white font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transform ${
                selectedMatch ? 'cursor-pointer' : 'opacity-70 cursor-not-allowed'
              }`}
              onClick={handleEnterRoom}
              disabled={isEntering}
            >
              <div className="relative z-10 flex items-center justify-center space-x-2">
                {isEntering ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang vào phòng...</span>
                  </>
                ) : (
                  <>
                    <span className="text-lg">Vào phòng</span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </div>
              
              {/* Button ripple effect */}
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
            </button>
          </div>

          {/* Bottom decoration */}
          <div className="h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"></div>
        </div>

        {/* Loading overlay */}
        {isEntering && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 text-center shadow-2xl">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-700 font-semibold">Đang kết nối...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectedMatch;