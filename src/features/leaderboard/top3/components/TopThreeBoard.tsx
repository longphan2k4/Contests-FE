import React, { useState, useEffect } from 'react';
import { TrophyIcon } from '@heroicons/react/24/solid';
import type { Contestant } from '../types/Contestant';
import type { CardStyles } from '../types/CardStyles';
import { useRevealAnimation } from '../hooks/useRevealAnimation';
import { useParticles } from '../hooks/useParticles';
import ContestantCard from './ContestantCard';
import LoadingSpinner from './LoadingSpinner';

const TopThreeBoard: React.FC = () => {
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [revealRank, setRevealRank] = useState<number>(0);
  const [revealMode, setRevealMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [revealedContestants, setRevealedContestants] = useState<number[]>([]);
  const { startReveal, resetAnimation, isMuted, setIsMuted, lottieContainerRef, showAnimation } = useRevealAnimation(
    revealRank,
    setRevealMode,
    setRevealRank,
    setRevealedContestants
  );
  const particlesRef = React.useRef<HTMLDivElement>(null);
  useParticles(particlesRef);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sampleData: Contestant[] = [
          { id: 1, fullname: 'Nguyễn Văn A', score: 98.5 },
          { id: 2, fullname: 'Trần Thị B', score: 97.8 },
          { id: 3, fullname: 'Lê Minh C', score: 80 },
        ];
        setContestants(sampleData.sort((a, b) => b.score - a.score));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const getCardStyles = (actualRank: number): CardStyles => ({
    border: actualRank === 1
      ? 'border-yellow-500'
      : actualRank === 2
      ? 'border-gray-400'
      : 'border-amber-700',
    bg: actualRank === 1
      ? 'from-yellow-400 to-yellow-600'
      : actualRank === 2
      ? 'from-gray-300 to-gray-500'
      : 'from-amber-600 to-amber-800',
    text: actualRank === 1
      ? 'text-yellow-700'
      : actualRank === 2
      ? 'text-gray-700'
      : 'text-amber-900',
    badge: actualRank === 1
      ? 'bg-yellow-200 text-yellow-800'
      : actualRank === 2
      ? 'bg-gray-200 text-gray-800'
      : 'bg-amber-200 text-amber-900',
  });

  const getBackgroundGradient = (rank: number): string => {
    if (rank === 1) return 'bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-400';
    if (rank === 2) return 'bg-gradient-to-br from-gray-100 via-gray-200 to-gray-400';
    if (rank === 3) return 'bg-gradient-to-br from-amber-100 via-amber-200 to-amber-400';
    return 'bg-gradient-to-br from-gray-100 via-yellow-100 to-amber-100';
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const displayOrder: number[] = [1, 0, 2];

  return (
    <div
      className={`relative min-h-screen flex items-center justify-center ${getBackgroundGradient(
        revealRank
      )} overflow-hidden p-4 transition-all duration-1000`}
    >
      <div id="particles-js" ref={particlesRef} className="absolute inset-0 z-0 pointer-events-none"></div>
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none hexagon-grid"></div>
      <div
        id="digital-container"
        className="absolute inset-0 z-10 pointer-events-none opacity-0 transition-opacity duration-500"
      ></div>
      <div
        className={`absolute inset-0 z-0 pointer-events-none bg-glow ${
          revealRank === 1 ? 'gold-glow' : revealRank === 2 ? 'silver-glow' : revealRank === 3 ? 'bronze-glow' : ''
        }`}
      ></div>
      <div className="absolute inset-0 z-0 pointer-events-none tech-background">
        <div className="circuit-line animate-circuit-flow"></div>
      </div>
      {revealMode && <div className="absolute inset-0 z-0 pointer-events-none floating-icons"></div>}
      {showAnimation && (
        <div
          ref={lottieContainerRef}
          className="absolute inset-0 z-30 pointer-events-none flex justify-center items-center"
        ></div>
      )}
      {revealRank === 1 && (
        <div className="absolute inset-0 z-10 pointer-events-none animate-lens-flare">
          <div className="w-20 h-20 bg-yellow-300 rounded-full opacity-30 blur-xl"></div>
        </div>
      )}
      <div className="relative z-20 w-full max-w-6xl mx-auto p-4 md:p-8">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 pb-2 relative inline-block">
            TOP 3 THÍ SINH
            <div className="absolute -inset-1 bg-yellow-300 opacity-20 blur-md rounded-lg z-0"></div>
          </h1>
          <p className="mt-2 md:mt-4 text-gray-600 italic font-extrabold md:text-3xl">
            Cuộc thi Olympic Tin học 2025
          </p>
        </div>
        {!revealMode ? (
          <div className="flex flex-col items-center justify-center space-y-6 md:space-y-8">
            <div className="h-64 md:h-80 w-full flex justify-center items-center">
              <div className="text-center text-gray-600">
                <div className="flex justify-center mb-6 md:mb-8">
                  <div className="relative">
                    <div className="absolute -inset-12 md:-inset-16 rounded-full bg-yellow-100 animate-ping-slow opacity-30"></div>
                    <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center">
                      <TrophyIcon className="h-24 w-24 md:h-32 md:w-32 text-white" />
                    </div>
                  </div>
                </div>
                <p className="text-xl md:text-2xl mt-4">Bấm nút để công bố kết quả!</p>
              </div>
            </div>
            <button
              onClick={startReveal}
              className="relative overflow-hidden px-8 py-4 md:px-10 md:py-5 bg-gradient-to-r from-yellow-400 to-amber-600 text-white text-lg md:text-2xl font-bold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              aria-label="Công bố kết quả top 3"
            >
              <span className="absolute inset-0 w-full h-full bg-white opacity-30 shine-effect"></span>
              <span className="relative z-10 inline-flex items-center">
                CÔNG BỐ KẾT QUẢ
                <TrophyIcon className="h-6 w-6 md:h-8 md:w-8 ml-2 text-white animate-bounce" />
              </span>
            </button>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-gray-400 to-gray-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              aria-label={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            >
              {isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            </button>
          </div>
        ) : (
          <>
            {revealRank === 0 && (
              <div className="h-64 flex items-center justify-center">
                <div className="text-6xl md:text-8xl font-bold text-yellow-600 animate-countdown">
                  Chuẩn bị...
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mt-6 md:mt-12 justify-items-center">
              {displayOrder.map((displayIndex) => {
                const contestant = contestants[displayIndex];
                const actualRank = displayIndex + 1;
                const isRevealed = revealedContestants.includes(actualRank);
                const styles = getCardStyles(actualRank);

                return (
                  <ContestantCard
                    key={contestant.id}
                    contestant={contestant}
                    actualRank={actualRank}
                    isRevealed={isRevealed}
                    styles={styles}
                  />
                );
              })}
            </div>
            {revealRank === 1 && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={resetAnimation}
                  className="px-8 py-4 bg-gradient-to-r from-blue-400 to-blue-600 text-white text-lg font-bold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                  aria-label="Reset kết quả"
                >
                  RESET KẾT QUẢ
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TopThreeBoard;