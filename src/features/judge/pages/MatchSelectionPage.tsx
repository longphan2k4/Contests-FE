import React, { useEffect } from 'react';
import AnimatedBackground from '../components/selection/AnimatedBackground';
import MatchCard from '../components/selection/MatchCard';
import MatchSelector from '../components/selection/MatchSelector';
import { useMatchSelection } from '../hooks/useMatchSelection';

const MatchSelectionPage: React.FC = () => {
  const { matches, selectedMatch, setSelectedMatch, isEntering, mounted, handleEnterRoom, selectedMatchData } = useMatchSelection();

  // Thêm title cho tab
  useEffect(() => {
    document.title = 'Chọn Trận Đấu - Giám khảo';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4 relative overflow-hidden">
      <AnimatedBackground />
      <div className={`relative z-10 w-full max-w-lg transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <MatchCard selectedMatchData={selectedMatchData} isEntering={isEntering} handleEnterRoom={handleEnterRoom}>
          <MatchSelector matches={matches} selectedMatch={selectedMatch} onSelectMatch={setSelectedMatch} />
        </MatchCard>
      </div>
      {isEntering && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 text-center shadow-2xl">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-700 font-semibold">Đang kết nối...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchSelectionPage;