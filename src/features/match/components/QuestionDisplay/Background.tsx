import React, { useState, useEffect, useRef, type JSX } from "react";
import banner from "../MatchHeader/images/ManHinhCho.png";

// Define interfaces for sparkle and VIP effect objects
interface Sparkle {
  id: number;
  left: string;
  top: string;
  size: string;
  duration: string;
}

interface VipEffect {
  id: number;
  type: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
  duration: number;
  color: string;
}

// Define interface for particle objects
interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
}

interface BackgroundProps {
  url: string | null;
}

const Background: React.FC<BackgroundProps> = ({ url }) => {
  const [scanlineActive, _setScanlineActive] = useState<boolean>(true);
  const [overlayOpacity, setOverlayOpacity] = useState<number>(0.3);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const [vipEffects, setVipEffects] = useState<VipEffect[]>([]);

  // Hiệu ứng overlay thay đổi độ mờ
  useEffect(() => {
    const overlayInterval = setInterval(() => {
      setOverlayOpacity(prev => (prev === 0.3 ? 0.4 : 0.3));
    }, 3000);

    return () => {
      clearInterval(overlayInterval);
    };
  }, []);

  // Tạo hiệu ứng lấp lánh
  useEffect(() => {
    const createSparkle = () => {
      const sparkle: Sparkle = {
        id: Math.random(),
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: `${Math.random() * 10 + 2}px`,
        duration: `${Math.random() * 2 + 0.5}s`,
      };

      setSparkles(prevSparkles => [...prevSparkles, sparkle]);

      setTimeout(() => {
        setSparkles(prevSparkles =>
          prevSparkles.filter(s => s.id !== sparkle.id)
        );
      }, parseFloat(sparkle.duration) * 1000);
    };

    const sparkleInterval = setInterval(createSparkle, 300);

    return () => clearInterval(sparkleInterval);
  }, []);

  // Tạo hiệu ứng VIP ngẫu nhiên
  useEffect(() => {
    const createRandomVipEffect = () => {
      const effectTypes = ["circle", "square", "triangle", "hexagon"];
      const effectType =
        effectTypes[Math.floor(Math.random() * effectTypes.length)];

      const margin = 100;
      const width = window.innerWidth - margin * 2;
      const height = window.innerHeight - margin * 2;

      const x = Math.random() * width + margin;
      const y = Math.random() * height + margin;

      const effect: VipEffect = {
        id: Math.random(),
        type: effectType,
        x,
        y,
        size: Math.random() * 30 + 20,
        rotation: Math.random() * 360,
        duration: Math.random() * 5 + 5,
        color: `rgba(${Math.random() * 100 + 100}, ${Math.random() * 100 + 150
          }, ${Math.random() * 100 + 200}, 0.4)`,
      };

      setVipEffects(prevEffects => [...prevEffects, effect]);

      setTimeout(() => {
        setVipEffects(prevEffects =>
          prevEffects.filter(e => e.id !== effect.id)
        );
      }, effect.duration * 1000);
    };

    const vipEffectInterval = setInterval(createRandomVipEffect, 2000);

    return () => clearInterval(vipEffectInterval);
  }, []);

  // Hiệu ứng particle network VIP
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const createParticles = () => {
      const particleCount = 100;
      const newParticles: Particle[] = [];

      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          color: `rgba(${Math.random() * 50 + 100}, ${Math.random() * 50 + 150
            }, ${Math.random() * 50 + 200}, ${Math.random() * 0.5 + 0.3})`,
        });
      }

      particlesRef.current = newParticles;
    };

    createParticles();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, index) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX *= -1;
        }

        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY *= -1;
        }

        particlesRef.current.forEach((otherParticle, otherIndex) => {
          if (index !== otherIndex) {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(100, 150, 255, ${0.1 * (1 - distance / 100)
                })`;
              ctx.lineWidth = 0.5;
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.stroke();
            }
          }
        });
      });

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const renderVipEffects = () => {
    return vipEffects.map(effect => {
      let effectElement: JSX.Element | null = null;

      switch (effect.type) {
        case "circle":
          effectElement = (
            <div
              key={effect.id}
              className="absolute rounded-full border-2 border-blue-300"
              style={{
                left: effect.x,
                top: effect.y,
                width: effect.size,
                height: effect.size,
                transform: `translate(-50%, -50%) rotate(${effect.rotation}deg)`,
                boxShadow: `0 0 15px ${effect.color}`,
                animation: `vipFadeInOut ${effect.duration}s ease-in-out`,
              }}
            />
          );
          break;
        case "square":
          effectElement = (
            <div
              key={effect.id}
              className="absolute border-2 border-blue-300"
              style={{
                left: effect.x,
                top: effect.y,
                width: effect.size,
                height: effect.size,
                transform: `translate(-50%, -50%) rotate(${effect.rotation}deg)`,
                boxShadow: `0 0 15px ${effect.color}`,
                animation: `vipFadeInOut ${effect.duration}s ease-in-out`,
              }}
            />
          );
          break;
        case "triangle":
          effectElement = (
            <div
              key={effect.id}
              className="absolute"
              style={{
                left: effect.x,
                top: effect.y,
                width: 0,
                height: 0,
                borderLeft: `${effect.size / 2}px solid transparent`,
                borderRight: `${effect.size / 2}px solid transparent`,
                borderBottom: `${effect.size}px solid ${effect.color}`,
                transform: `translate(-50%, -50%) rotate(${effect.rotation}deg)`,
                filter: "drop-shadow(0 0 5px rgba(100, 150, 255, 0.5))",
                animation: `vipFadeInOut ${effect.duration}s ease-in-out`,
              }}
            />
          );
          break;
        case "hexagon":
          effectElement = (
            <div
              key={effect.id}
              className="absolute"
              style={{
                left: effect.x,
                top: effect.y,
                width: effect.size,
                height: effect.size * 0.866,
                clipPath:
                  "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                backgroundColor: effect.color,
                transform: `translate(-50%, -50%) rotate(${effect.rotation}deg)`,
                boxShadow: `0 0 15px ${effect.color}`,
                animation: `vipFadeInOut ${effect.duration}s ease-in-out`,
              }}
            />
          );
          break;
        default:
          return null;
      }

      return effectElement;
    });
  };

  const renderRandomLightRays = () => {
    const lightRays: JSX.Element[] = [];
    for (let i = 0; i < 4; i++) {
      const rayX = Math.random() * 100;
      const rayY = Math.random() * 100;
      const angle = Math.random() * Math.PI * 2;
      const length = 50 + Math.random() * 100;

      const rayStyle: React.CSSProperties = {
        position: "absolute",
        top: `${rayY}%`,
        left: `${rayX}%`,
        width: `${length}%`,
        height: "2px",
        background:
          "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(100, 200, 255, 0.3) 50%, rgba(255,255,255,0) 100%)",
        transform: `translate(-50%, -50%) rotate(${angle}rad)`,
        opacity: 0.4,
        animation: `rayPulse 8s ease-in-out infinite ${i * 1.3}s`,
      };
      lightRays.push(<div key={`ray-${i}`} style={rayStyle} />);
    }
    return lightRays;
  };

  return (
    <div className="relative w-full h-screen overflow-hidden z-1000">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ opacity: 0.7 }}
      />

      <style>{`
        @keyframes rayPulse {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.6;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes scanline {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(100%);
          }
        }

        @keyframes sparkle {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(0);
            opacity: 0;
          }
        }

        @keyframes ripple {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        @keyframes vipFadeInOut {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8) rotate(0deg);
          }
          20% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
          }
          80% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1) rotate(360deg);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8) rotate(360deg);
          }
        }
      `}</style>

      <div className="absolute inset-0">
        <img
          src={url || banner}
          alt="Tech Banner"
          className="w-full h-full object-cover"
        />
      </div>

      <div
        className="absolute inset-0 bg-blue-500 mix-blend-overlay"
        style={{ opacity: overlayOpacity }}
      ></div>

      <div className="absolute inset-0 pointer-events-none">
        {renderRandomLightRays()}
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {vipEffects.map(effect =>
          effect.type === "circle" && Math.random() > 0.7 ? (
            <div
              key={`ripple-${effect.id}`}
              className="absolute rounded-full border border-blue-300 opacity-0"
              style={{
                left: effect.x,
                top: effect.y,
                width: effect.size * 2,
                height: effect.size * 2,
                transform: "translate(-50%, -50%)",
                animation: `ripple ${effect.duration * 0.7}s linear infinite`,
              }}
            />
          ) : null
        )}
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {renderVipEffects()}
      </div>

      {scanlineActive && (
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="w-full h-full bg-gradient-to-b from-transparent via-black to-transparent opacity-5"
            style={{
              backgroundSize: "100% 2px",
              backgroundImage:
                "linear-gradient(to bottom, transparent, rgba(0,0,0,0.5), transparent)",
              animation: "scanline 8s linear infinite",
            }}
          ></div>
        </div>
      )}

      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

      {sparkles.map(sparkle => (
        <div
          key={sparkle.id}
          className="absolute rounded-full animate-pulse"
          style={{
            left: sparkle.left,
            top: sparkle.top,
            width: sparkle.size,
            height: sparkle.size,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            boxShadow: "0 0 10px 2px rgba(255, 255, 255, 0.8)",
            animation: `sparkle ${sparkle.duration} linear`,
            opacity: 0,
          }}
        />
      ))}

      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-70"></div>
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-70"></div>
      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-transparent via-blue-400 to-transparent opacity-70"></div>
      <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-transparent via-blue-400 to-transparent opacity-70"></div>
    </div>
  );
};

export default Background;
