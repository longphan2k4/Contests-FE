import { useState, useEffect, useRef } from "react";
import { useSocket } from '@/contexts/SocketContext';
import axiosInstance from "@config/axiosInstance";

// Giả định các file âm thanh
import revealSound from "./audio/loading2.mp3"; // Âm thanh khi lộ diện thí sinh
import celebrateSound from "./audio/20winners.mp3"; // Âm thanh chúc mừng

const BASE_URL = import.meta.env.VITE_API_URL;

// Types
interface Contestant {
  contestantId: number;
  fullName: string;
  studentCode: string;
  schoolName: string;
  correctAnswers: number;
  eliminatedAtQuestionOrder: number | null;
  registrationNumber?: string;
}

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  color: string;
  delay: number;
}

const TopWinner = ({ match_id }: { match_id: string | number }) => {
  const { socket } = useSocket();
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState<boolean[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  // Tham chiếu âm thanh
  const revealAudioRef = useRef<HTMLAudioElement>(null);
  const celebrateAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `${BASE_URL}/contestant/completed-contestants/${match_id}`
        );
        const data = response.data;

        if (data.data) {
          console.log(data.data.candidates);
          setContestants(data.data.candidates);
        } else {
          console.warn("Không có dữ liệu");
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [match_id]);

  // Socket listener để nhận dữ liệu Top20 Winner từ admin
  useEffect(() => {
    if (!socket) return;

    const handleTop20Updated = (data: {
      success: boolean;
      data: {
        candidates: Contestant[];
        meta: Record<string, unknown>
      };
      matchId: string | number;
      //limit: number 
    }) => {
      console.log('Nhận dữ liệu Top20 từ socket:', data);

      if (data.success && data.data && data.matchId === match_id) {
        // Reset animation state với số lượng thí sinh động
        const totalContestants = data.data.candidates?.length || 0;
        setRevealed(Array(totalContestants).fill(false));
        setCurrentIndex(0);
        setCompleted(false);
        setCelebrating(false);
        setConfetti([]);

        // Cập nhật dữ liệu mới
        setContestants(data.data.candidates || []);
        setLoading(false);

        // Dừng âm thanh nếu đang phát
        if (celebrateAudioRef.current) {
          celebrateAudioRef.current.pause();
          celebrateAudioRef.current.currentTime = 0;
        }
      }
    };

    const handleTop20Hidden = (data: {
      success: boolean;
      matchId: string | number
    }) => {
      console.log('Top20 Winner đã được ẩn:', data);

      if (data.success && data.matchId === match_id) {
        // Reset về trạng thái ban đầu
        setRevealed([]);
        setCurrentIndex(0);
        setCompleted(false);
        setCelebrating(false);
        setConfetti([]);
        setContestants([]);
        setLoading(true);

        // Dừng âm thanh
        if (celebrateAudioRef.current) {
          celebrateAudioRef.current.pause();
          celebrateAudioRef.current.currentTime = 0;
        }
      }
    };

    socket.on("winner:top20Updated", handleTop20Updated);
    socket.on("winner:top20Hidden", handleTop20Hidden);

    return () => {
      socket.off("winner:top20Updated", handleTop20Updated);
      socket.off("winner:top20Hidden", handleTop20Hidden);
    };
  }, [socket, match_id]);

  useEffect(() => {
    // Reveal contestants one by one with a delay and sound
    const totalContestants = contestants.length;

    if (currentIndex < totalContestants && contestants.length > 0) {
      const timer = setTimeout(() => {
        setRevealed(prev => {
          const newState = [...prev];
          newState[currentIndex] = true;
          return newState;
        });
        // Phát âm thanh khi lộ diện thí sinh
        if (revealAudioRef.current) {
          revealAudioRef.current.currentTime = 0;
          revealAudioRef.current
            .play()
            .catch((error: unknown) => console.error("Lỗi phát âm thanh reveal:", error));
        }
        setCurrentIndex(currentIndex + 1);
      }, 400);
      return () => clearTimeout(timer);
    } else if (currentIndex === totalContestants && !completed && contestants.length > 0) {
      setCompleted(true);
      // Start celebration after a small delay
      setTimeout(() => {
        setCelebrating(true);
        generateConfetti();
        // Phát âm thanh chúc mừng
        if (celebrateAudioRef.current) {
          celebrateAudioRef.current.currentTime = 0;
          celebrateAudioRef.current
            .play()
            .catch((error: unknown) =>
              console.error("Lỗi phát âm thanh celebrate:", error)
            );
        }
      }, 500);
    }
    return undefined; // Explicit return for consistency
  }, [currentIndex, completed, contestants]);

  // Generate confetti pieces for celebration
  const generateConfetti = () => {
    const pieces = [];
    for (let i = 0; i < 100; i++) {
      pieces.push({
        id: i,
        x: Math.random() * 100,
        y: -20 - Math.random() * 80,
        size: 5 + Math.random() * 15,
        rotation: Math.random() * 360,
        color: `hsl(${Math.random() * 360}, 80%, 60%)`,
        delay: Math.random() * 2,
      });
    }
    setConfetti(pieces);
  };

  if (loading && contestants.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center w-full h-screen p-2 sm:p-3 md:p-4 rounded-lg shadow-lg transition-all duration-1000 ${celebrating
          ? "bg-gradient-to-b from-yellow-200 to-white"
          : "bg-gradient-to-b from-blue-200 to-white"
        }`}
    >
      {/* Thêm các phần tử audio */}
      <audio ref={revealAudioRef}>
        <source src={revealSound} type="audio/wav" />
      </audio>
      <audio ref={celebrateAudioRef}>
        <source src={celebrateSound} type="audio/wav" />
      </audio>

      {/* Background grid pattern */}
      <div className="absolute inset-0 overflow-hidden rounded-lg">
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={`grid-${i}`}
              className={`absolute opacity-20 transition-colors duration-1000 ${celebrating ? "bg-yellow-400" : "bg-blue-400"
                }`}
              style={{
                height: "1px",
                width: "100%",
                top: `${i * 10}%`,
              }}
            />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={`grid-v-${i}`}
              className={`absolute opacity-20 transition-colors duration-1000 ${celebrating ? "bg-yellow-400" : "bg-blue-400"
                }`}
              style={{
                width: "1px",
                height: "100%",
                left: `${i * 10}%`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Confetti celebration */}
      {celebrating && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {confetti.map(piece => (
            <div
              key={piece.id}
              className="absolute animate-confetti"
              style={{
                left: `${piece.x}%`,
                top: `${piece.y}%`,
                width: `${piece.size}px`,
                height: `${piece.size}px`,
                backgroundColor: piece.color,
                transform: `rotate(${piece.rotation}deg)`,
                opacity: 0.8,
                animationDelay: `${piece.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Header */}
      <div className="relative z-10 w-full text-center mb-1 sm:mb-2">
        <h1
          className={`text-lg sm:text-xl md:text-3xl font-bold tracking-wider border inline-block px-2 py-1 transition-colors duration-1000 ${celebrating
              ? "text-yellow-900 border-yellow-500 rounded animate-pulse"
              : "text-blue-900 border-blue-500 rounded"
            }`}
        >
          TOP {contestants.length} THÍ SINH ĐIỂM CAO NHẤT
        </h1>
      </div>

      {/* Grid layout - responsive for different numbers of contestants */}
      <div
        className={`grid gap-1 sm:gap-2 max-w-full flex-grow w-full justify-items-center ${contestants.length <= 5 ? 'grid-cols-5' :
            contestants.length <= 10 ? 'grid-cols-5' :
              contestants.length <= 20 ? 'grid-cols-5' :
                contestants.length <= 30 ? 'grid-cols-6' :
                  contestants.length <= 40 ? 'grid-cols-8' :
                    'grid-cols-10'
          }`}
        style={{
          maxHeight: '100vh',
          overflowY: contestants.length > 40 ? 'auto' : 'visible'
        }}
      >
        {contestants.map((contestant, i) => (
          <div
            key={`contestant-${contestant.contestantId}`}
            className={`${contestants.length <= 20 ? 'w-34 h-34' :
                contestants.length <= 40 ? 'w-28 h-28' :
                  'w-30 h-auto'
              } mx-1 flex flex-col items-center justify-center rounded-sm sm:rounded relative overflow-hidden transition-all duration-500 border ${celebrating
                ? "bg-yellow-900 border-yellow-500 " +
                (revealed[i] ? "animate-wiggle" : "")
                : "bg-blue-900 border-blue-700"
              } ${revealed[i]
                ? "shadow-sm " +
                (celebrating ? "shadow-yellow-500/20" : "shadow-blue-500/20")
                : "opacity-40"
              }`}
            style={{
              animationDelay: `${i * 0.05}s`,
            }}
          >
            {/* Tech frame */}
            <div
              className={`absolute top-0 left-0 h-0.5 transition-all duration-1000 ${revealed[i] ? "w-full" : "w-0"
                } ${celebrating ? "bg-yellow-400" : "bg-blue-400"}`}
            />
            <div
              className={`absolute bottom-0 right-0 h-0.5 transition-all duration-1000 ${revealed[i] ? "w-full" : "w-0"
                } ${celebrating ? "bg-yellow-400" : "bg-blue-400"}`}
            />

            {/* Contestant info display */}
            <div
              className={`transition-all duration-700 transform ${revealed[i] ? "opacity-100 scale-100" : "opacity-0 scale-50"
                } flex flex-col items-center justify-center text-center w-full h-full`}
            >
              <span
                className={`${contestants.length <= 20 ? 'text-6xl' :
                    contestants.length <= 40 ? 'text-6xl' :
                      'text-6xl'
                  } font-mono ${celebrating ? "text-yellow-100" : "text-blue-100"
                  }`}
              >
                {contestant.registrationNumber}
              </span>
              {/* Đang ẩn đi vì lỗi hiển thị sai câu bị loại nếu ts gold đã được cứu trước đó */}
              <span
                className={`invisible ${contestants.length <= 20 ? 'text-2xl' :
                    contestants.length <= 40 ? 'text-lg' :
                      'text-sm'
                  } font-mono ${celebrating ? "text-yellow-100" : "text-blue-100"
                  }`}
              >
                câu {contestant.eliminatedAtQuestionOrder || 13}
              </span>

              {/* Scanning effect */}
              {revealed[i] && (
                <div
                  className={`absolute inset-0 bg-gradient-to-b from-transparent to-transparent h-full w-full ${celebrating
                      ? "via-yellow-400/10 animate-scan-fast"
                      : "via-blue-400/10 animate-scan"
                    }`}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="w-full mt-1 sm:mt-2 flex items-center justify-between">
        <div
          className="flex-grow h-1 rounded-full overflow-hidden mr-2 transition-colors duration-1000"
          style={{ backgroundColor: celebrating ? "#FBBF24" : "#1E3A8A" }}
        >
          <div
            className={`h-full transition-all duration-500 ${celebrating ? "bg-yellow-500" : "bg-blue-500"
              }`}
            style={{
              width: `${contestants.length > 0 ? (currentIndex / contestants.length) * 100 : 0}%`
            }}
          />
        </div>
        <div className={`text-sm font-medium ${celebrating ? "text-yellow-800" : "text-blue-800"}`}>
          {currentIndex}/{contestants.length}
        </div>
      </div>

      {/* Add custom animations */}
      <style>{`
        @keyframes scan {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
        @keyframes scan-fast {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }
        .animate-scan-fast {
          animation: scan-fast 1s linear infinite;
        }
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(1000px) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti 4s ease-in-out forwards;
        }
        @keyframes wiggle {
          0%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-5deg);
          }
          75% {
            transform: rotate(5deg);
          }
        }
        .animate-wiggle {
          animation: wiggle 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default TopWinner;
