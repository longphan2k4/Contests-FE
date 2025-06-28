declare global {
  interface Window {
    particlesJS: any;
    pJSDom: any[];
  }
}

import React, { useState, useEffect, useRef } from 'react';
import { TrophyIcon, StarIcon, FireIcon } from '@heroicons/react/24/solid';
import confetti from 'canvas-confetti';
import lottie from 'lottie-web';

// Define the Contestant interface
interface Contestant {
  id: number;
  fullname: string;
  score: number;
}

// Define return type for getCardStyles
interface CardStyles {
  border: string;
  bg: string;
  text: string;
  badge: string;
}

const TopThreeBoard: React.FC = () => {
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [revealRank, setRevealRank] = useState<number>(0);
  const [revealMode, setRevealMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [revealedContestants, setRevealedContestants] = useState<number[]>([]);
  const [showAnimation, setShowAnimation] = useState<boolean>(false);
  const lottieContainerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (revealRank === 1 && lottieContainerRef.current) {
      lottie.loadAnimation({
        container: lottieContainerRef.current,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        path: 'https://assets10.lottiefiles.com/packages/lf20_m3mwsn3k.json',
      });
      setShowAnimation(true);
      setTimeout(() => setShowAnimation(false), 3000);
    }
  }, [revealRank]);

  useEffect(() => {
    if (particlesRef.current) {
      initParticles();
    }

    return () => {
      if (window.pJSDom && window.pJSDom.length > 0) {
        window.pJSDom[0].pJS.fn.vendors.destroypJS();
        window.pJSDom = [];
      }
    };
  }, []);

  const initParticles = () => {
    if (typeof window !== 'undefined' && window.particlesJS) {
      window.particlesJS('particles-js', {
        particles: {
          number: { value: 50, density: { enable: true, value_area: 800 } },
          color: { value: "#f1c40f" },
          shape: {
            type: "circle",
            stroke: { width: 0, color: "#000000" },
            polygon: { nb_sides: 5 }
          },
          opacity: {
            value: 0.2,
            random: true,
            anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false }
          },
          size: {
            value: 4,
            random: true,
            anim: { enable: true, speed: 2, size_min: 0.1, sync: false }
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: "#f1c40f",
            opacity: 0.1,
            width: 1
          },
          move: {
            enable: true,
            speed: 1,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "bounce",
            bounce: false,
            attract: { enable: false, rotateX: 600, rotateY: 1200 }
          }
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: { enable: true, mode: "bubble" },
            onclick: { enable: true, mode: "push" },
            resize: true
          },
          modes: {
            bubble: { distance: 200, size: 6, duration: 2, opacity: 0.4, speed: 3 },
            push: { particles_nb: 4 },
            remove: { particles_nb: 2 }
          }
        },
        retina_detect: true
      });
    }
  };

  const playSound = (type: string) => {
    if (!isMuted) {
      const audio = new Audio(`/audio/${type}.mp3`);
      audio.play().catch((err) => console.error('Audio error:', err));
    }
  };

  const startReveal = () => {
    setRevealMode(true);
    setRevealRank(0);
    setRevealedContestants([]);
    playSound('countdown');

    const digitalContainer = document.getElementById('digital-container');
    if (digitalContainer) {
      digitalContainer.classList.add('active');
    }

    setTimeout(() => {
      setRevealRank(3);
      setRevealedContestants((prev) => [...prev, 3]);
      playSound('reveal');
      createRipple('amber');
    }, 2000);

    setTimeout(() => {
      setRevealRank(2);
      setRevealedContestants((prev) => [...prev, 2]);
      playSound('reveal');
      createRipple('gray');
    }, 5000);

    setTimeout(() => {
      setRevealRank(1);
      setRevealedContestants((prev) => [...prev, 1]);
      playSound('win');

      if (digitalContainer) {
        digitalContainer.classList.remove('active');
      }

      createRipple('yellow');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FF4500', '#00CED1'],
      });

      setTimeout(() => {
        confettiBurst();
      }, 300);
    }, 8000);
  };

  const confettiBurst = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#FFD700', '#FFA500', '#FFFF00']
      });

      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#FFD700', '#FFA500', '#FFFF00']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const createRipple = (color: string) => {
    const rippleContainer = document.createElement('div');
    rippleContainer.className = `ripple-container ${color}-ripple`;
    document.body.appendChild(rippleContainer);

    setTimeout(() => {
      document.body.removeChild(rippleContainer);
    }, 2000);
  };

  const resetAnimation = () => {
    setRevealMode(false);
    setRevealRank(0);
    setRevealedContestants([]);
    setShowAnimation(false);
  };

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
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="relative animate-bounce">
          <TrophyIcon className="h-16 w-16 text-yellow-500" />
          <div className="absolute bottom-0 left-0 w-full h-2 bg-yellow-300 animate-pulse rounded-full"></div>
        </div>
      </div>
    );
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
            TOP 3 THÍ SINH XUẤT SẮC
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
                  <div
                    key={contestant.id}
                    className={`relative overflow-hidden transition-all duration-1000 ease-out transform ${
                      isRevealed ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                    } ${actualRank === 1 && isRevealed ? 'animate-wiggle' : ''}`}
                  >
                    {isRevealed && (
                      <div
                        className={`absolute -top-32 left-1/2 transform -translate-x-1/2 w-24 h-64 bg-gradient-to-b ${
                          actualRank === 1
                            ? 'from-yellow-100'
                            : actualRank === 2
                            ? 'from-gray-100'
                            : 'from-amber-100'
                        } to-transparent opacity-40 animate-spotlight`}
                      ></div>
                    )}
                    {actualRank === 1 && isRevealed && (
                      <div className="absolute inset-0 rounded-full bg-yellow-300 opacity-30 animate-aura"></div>
                    )}
                    <div
                      className={`relative p-4 md:p-6 rounded-full flex flex-col justify-center items-center text-center border-8 bg-gradient-to-b ${styles.border} ${
                        styles.bg
                      } ${
                        actualRank === 1
                          ? 'w-72 h-72 md:w-80 md:h-80'
                          : actualRank === 2
                          ? 'w-60 h-60 md:w-72 md:h-72'
                          : 'w-52 h-52 md:w-64 md:h-64'
                      }`}
                    >
                      {isRevealed && (
                        <div
                          className="absolute inset-0 bg-white opacity-20 rounded-full animate-glow"
                          style={{ animationDelay: `${actualRank * 0.2}s` }}
                        ></div>
                      )}
                      <div className="relative z-10 flex flex-col items-center justify-center h-full">
                        {isRevealed && (
                          <>
                            <div className={`mb-2 md:mb-4 animate-bounce`} style={{ animationDuration: '1s' }}>
                              {actualRank === 1 ? (
                                <TrophyIcon className="h-14 w-14 md:h-16 md:w-16 text-yellow-300 mx-auto" />
                              ) : actualRank === 2 ? (
                                <StarIcon className="h-12 w-12 md:h-14 md:w-14 text-gray-300 mx-auto" />
                              ) : (
                                <FireIcon className="h-10 w-10 md:h-12 md:w-12 text-amber-400 mx-auto" />
                              )}
                            </div>
                            <h3 className={`text-2xl md:text-3xl font-extrabold mb-1 md:mb-2 ${styles.text}`}>
                              {actualRank === 1 ? 'Hạng Nhất' : actualRank === 2 ? 'Hạng Nhì' : 'Hạng Ba'}
                            </h3>
                            <h4 className="text-lg md:text-xl font-bold mb-1 text-white drop-shadow-md">
                              {contestant.fullname}
                            </h4>
                            <div
                              className={`px-4 py-1 md:px-6 md:py-2 rounded-full font-bold text-base md:text-lg ${styles.badge} shadow-md`}
                            >
                              {contestant.score} điểm
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
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

const styles = `
  @keyframes circuit-flow {
    0% { background-position: 0 0; }
    100% { background-position: 100px 100px; }
  }
  .circuit-line {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, transparent 49%, rgba(0, 255, 255, 0.15) 50%, transparent 51%);
    background-size: 100px 100px;
    opacity: 0.2;
  }
  .animate-circuit-flow { animation: circuit-flow 10s linear infinite; }
  @keyframes glow {
    0%, 100% { opacity: 0.2; }
    50% { opacity: 0.5; }
  }
  .animate-glow { animation: glow 2s infinite; }
  @keyframes wiggle {
    0%, 100% { transform: rotate(-2deg); }
    50% { transform: rotate(2deg); }
  }
  .animate-wiggle { animation: wiggle 0.8s ease-in-out; }
  @keyframes countdown {
    0% { transform: scale(0.5); opacity: 0; }
    10% { transform: scale(1.2); opacity: 1; }
    90% { transform: scale(1); opacity: 1; }
    100% { transform: scale(1.5); opacity: 0; }
  }
  .animate-countdown { animation: countdown 2s ease-in-out; }
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  .animate-bounce { animation: bounce 1s infinite; }
  @keyframes ping-slow {
    0% { transform: scale(1); opacity: 0.3; }
    50% { transform: scale(1.5); opacity: 0.2; }
    100% { transform: scale(1); opacity: 0.3; }
  }
  .animate-ping-slow { animation: ping-slow 3s ease-in-out infinite; }
  @keyframes aura {
    0% { box-shadow: 0 0 20px 5px rgba(255, 215, 0, 0.5); }
    50% { box-shadow: 0 0 30px 10px rgba(255, 215, 0, 0.7); }
    100% { box-shadow: 0 0 20px 5px rgba(255, 215, 0, 0.5); }
  }
  .animate-aura { animation: aura 2s ease-in-out infinite; }
  @keyframes lens-flare {
    0% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
    50% { transform: translate(-50%, -50%) scale(1.5); opacity: 0.5; }
    100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
  }
  .animate-lens-flare { animation: lens-flare 3s ease-in-out infinite; }
  .tech-background {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  @keyframes shine {
    0% { left: -100%; }
    100% { left: 100%; }
  }
  .shine-effect {
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255,255,255,0) 0%,
      rgba(255,255,255,0.5) 50%,
      rgba(255,255,255,0) 100%
    );
    animation: shine 2s infinite;
  }
  .hexagon-grid {
    background: 
      linear-gradient(60deg, transparent 25%, rgba(255, 215, 0, 0.05) 25.5%, rgba(255, 215, 0, 0.05) 75%, transparent 75%),
      linear-gradient(120deg, transparent 25%, rgba(255, 215, 0, 0.05) 25.5%, rgba(255, 215, 0, 0.05) 75%, transparent 75%);
    background-size: 60px 100px;
  }
  #digital-container {
    overflow: hidden;
  }
  #digital-container.active {
    opacity: 0.1;
    background-image: 
      repeating-linear-gradient(0deg, rgba(255, 215, 0, 0.05) 0px, rgba(255, 215, 0, 0.05) 1px, transparent 1px, transparent 30px),
      repeating-linear-gradient(90deg, rgba(255, 215, 0, 0.05) 0px, rgba(255, 215, 0, 0.05) 1px, transparent 1px, transparent 30px);
  }
  .floating-icons {
    background-image: 
      radial-gradient(circle at 10% 20%, rgba(255, 215, 0, 0.05) 5px, transparent 5px),
      radial-gradient(circle at 20% 40%, rgba(192, 192, 192, 0.05) 4px, transparent 4px),
      radial-gradient(circle at 30% 60%, rgba(205, 127, 50, 0.05) 6px, transparent 6px),
      radial-gradient(circle at 40% 80%, rgba(255, 215, 0, 0.05) 3px, transparent 3px),
      radial-gradient(circle at 50% 10%, rgba(192, 192, 192, 0.05) 5px, transparent 5px),
      radial-gradient(circle at 60% 30%, rgba(205, 127, 50, 0.05) 4px, transparent 4px),
      radial-gradient(circle at 70% 50%, rgba(255, 215, 0, 0.05) 6px, transparent 6px),
      radial-gradient(circle at 80% 70%, rgba(192, 192, 192, 0.05) 3px, transparent 3px),
      radial-gradient(circle at 90% 90%, rgba(205, 127, 50, 0.05) 5px, transparent 5px);
    animation: floating-icons 15s linear infinite;
  }
  @keyframes floating-icons {
    0% { background-position: 0% 0%; }
    100% { background-position: 100% 100%; }
  }
  @keyframes spotlight {
    0% { opacity: 0; transform: translateX(-50%) rotate(0deg); }
    50% { opacity: 0.4; transform: translateX(-50%) rotate(15deg); }
    100% { opacity: 0; transform: translateX(-50%) rotate(0deg); }
  }
  .animate-spotlight {
    animation: spotlight 5s ease-in-out infinite;
  }
  .bg-glow {
    transition: all 1s ease-in-out;
  }
  .gold-glow {
    box-shadow: inset 0 0 150px 30px rgba(255, 215, 0, 0.15);
  }
  .silver-glow {
    box-shadow: inset 0 0 150px 30px rgba(192, 192, 192, 0.15);
  }
  .bronze-glow {
    box-shadow: inset 0 0 150px 30px rgba(205, 127, 50, 0.15); 
  }
  .ripple-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 10px;
    height: 10px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 999;
  }
  .ripple-container::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    animation: ripple 2s ease-out;
  }
  @keyframes ripple {
    0% { 
      transform: scale(0); 
      opacity: 0.4; 
    }
    100% { 
      transform: scale(100); 
      opacity: 0; 
    }
  }
  .yellow-ripple::before { background-color: rgba(255, 215, 0, 0.2); }
  .gray-ripple::before { background-color: rgba(192, 192, 192, 0.2); }
  .amber-ripple::before { background-color: rgba(205, 127, 50, 0.2); }
`;

const TopThreeReveal: React.FC = () => {
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.particlesJS) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/particles.js/2.0.0/particles.min.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <TopThreeBoard />
    </>
  );
};

export default TopThreeReveal;