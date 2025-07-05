import React, { useEffect, useState } from "react";
import { Box, Typography, Fade, Zoom } from "@mui/material";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

// 🎆 Keyframes cho pháo hoa
const fireworkExplode = keyframes`
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: scale(1) rotate(180deg);
    opacity: 1;
  }
  100% {
    transform: scale(1.5) rotate(360deg);
    opacity: 0;
  }
`;

const sparkle = keyframes`
  0% {
    transform: scale(0);
    opacity: 1;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0);
    opacity: 0;
  }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
  }
`;

const rainbow = keyframes`
  0% { color: #ff0000; }
  16% { color: #ff8000; }
  33% { color: #ffff00; }
  50% { color: #00ff00; }
  66% { color: #00ffff; }
  83% { color: #8000ff; }
  100% { color: #ff0000; }
`;

// 🎇 Styled Components
const FullScreenOverlay = styled(Box)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  overflow: hidden;
`;

const Firework = styled.div<{ delay: number; left: string; top: string }>`
  position: absolute;
  left: ${(props) => props.left};
  top: ${(props) => props.top};
  width: 4px;
  height: 4px;
  background: radial-gradient(circle, #fff 0%, transparent 70%);
  border-radius: 50%;
  animation: ${fireworkExplode} 2s ease-out ${(props) => props.delay}s infinite;

  &::before {
    content: "";
    position: absolute;
    top: -20px;
    left: -20px;
    width: 40px;
    height: 40px;
    border: 2px solid #fff;
    border-radius: 50%;
    animation: ${fireworkExplode} 2s ease-out ${(props) => props.delay}s
      infinite;
  }
`;

const Sparkle = styled.div<{
  delay: number;
  left: string;
  top: string;
  color: string;
}>`
  position: absolute;
  left: ${(props) => props.left};
  top: ${(props) => props.top};
  width: 8px;
  height: 8px;
  background: ${(props) => props.color};
  border-radius: 50%;
  animation: ${sparkle} 1.5s ease-out ${(props) => props.delay}s infinite;
  box-shadow: 0 0 10px ${(props) => props.color};
`;

const CelebrationText = styled(Typography)`
  animation: ${bounce} 2s ease-in-out infinite, ${rainbow} 3s linear infinite;
  text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px #ff00de,
    0 0 35px #ff00de, 0 0 40px #ff00de;
  font-weight: bold;
  margin-bottom: 20px;
`;

interface RescueAnimationProps {
  isVisible: boolean;
  onAnimationComplete?: () => void;
  rescueMessage?: string;
}

const RescueAnimation: React.FC<RescueAnimationProps> = ({
  isVisible,
  onAnimationComplete,
}) => {
  const [showFireworks, setShowFireworks] = useState(false);
  const [showText, setShowText] = useState(false);
  const [audioPlayed, setAudioPlayed] = useState(false);

  // 🎵 Tạo âm thanh rescue
  const playRescueSound = () => {
    if (audioPlayed) return;

    try {
      // Tạo âm thanh celebration bằng Web Audio API
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

      // Âm thanh "ding" cao
      const oscillator1 = audioContext.createOscillator();
      const gainNode1 = audioContext.createGain();

      oscillator1.connect(gainNode1);
      gainNode1.connect(audioContext.destination);

      oscillator1.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator1.frequency.exponentialRampToValueAtTime(
        1200,
        audioContext.currentTime + 0.3
      );

      gainNode1.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode1.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.5
      );

      oscillator1.start(audioContext.currentTime);
      oscillator1.stop(audioContext.currentTime + 0.5);

      // Âm thanh "whoosh" sau 0.2s
      setTimeout(() => {
        const oscillator2 = audioContext.createOscillator();
        const gainNode2 = audioContext.createGain();

        oscillator2.connect(gainNode2);
        gainNode2.connect(audioContext.destination);

        oscillator2.frequency.setValueAtTime(400, audioContext.currentTime);
        oscillator2.frequency.exponentialRampToValueAtTime(
          100,
          audioContext.currentTime + 0.8
        );

        gainNode2.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode2.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.8
        );

        oscillator2.start(audioContext.currentTime);
        oscillator2.stop(audioContext.currentTime + 0.8);
      }, 200);

      setAudioPlayed(true);
    } catch (error) {
      console.warn("Không thể phát âm thanh rescue:", error);
    }
  };

  // 🎆 Tạo pháo hoa random
  const generateFireworks = () => {
    const fireworks = [];
    for (let i = 0; i < 15; i++) {
      fireworks.push({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: Math.random() * 2,
      });
    }
    return fireworks;
  };

  // ✨ Tạo sparkles random
  const generateSparkles = () => {
    const sparkles = [];
    const colors = [
      "#ff0080",
      "#00ff80",
      "#8000ff",
      "#ff8000",
      "#00ffff",
      "#ffff00",
    ];

    for (let i = 0; i < 30; i++) {
      sparkles.push({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    return sparkles;
  };

  const [fireworks] = useState(generateFireworks);
  const [sparkles] = useState(generateSparkles);

  useEffect(() => {
    if (isVisible) {
      // Play sound immediately
      playRescueSound();

      // Show fireworks first
      setShowFireworks(true);

      // Show text after 0.5s
      setTimeout(() => {
        setShowText(true);
      }, 500);

      // Auto complete after 5s
      setTimeout(() => {
        onAnimationComplete?.();
      }, 5000);
    } else {
      // Reset states
      setShowFireworks(false);
      setShowText(false);
      setAudioPlayed(false);
    }
  }, [isVisible, onAnimationComplete]);

  if (!isVisible) return null;

  return (
    <FullScreenOverlay>
      {/* 🎆 Pháo hoa */}
      {showFireworks &&
        fireworks.map((fw) => (
          <Firework key={fw.id} delay={fw.delay} left={fw.left} top={fw.top} />
        ))}

      {/* ✨ Sparkles */}
      {showFireworks &&
        sparkles.map((sp) => (
          <Sparkle
            key={sp.id}
            delay={sp.delay}
            left={sp.left}
            top={sp.top}
            color={sp.color}
          />
        ))}

      {/* 🎉 Main content */}
      <Fade in={showText} timeout={1000}>
        <Box textAlign="center">
          <Zoom in={showText} timeout={1000}>
            <div>
              <CelebrationText variant="h2">
                CỨU TRỢ
                <br />
                🎉
              </CelebrationText>
            </div>
          </Zoom>
        </Box>
      </Fade>
    </FullScreenOverlay>
  );
};

export default RescueAnimation;
