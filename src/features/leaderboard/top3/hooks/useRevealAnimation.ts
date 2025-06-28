import { useState, useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import confetti from 'canvas-confetti';
import { playSound } from '../utils/soundUtils';    
import { createRipple } from '../utils/rippleUtils';
import { confettiBurst } from '../utils/animationUtils';

export const useRevealAnimation = (
  revealRank: number,
  setRevealMode: (mode: boolean) => void,
  setRevealRank: (rank: number) => void,
  setRevealedContestants: React.Dispatch<React.SetStateAction<number[]>>
) => {
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const lottieContainerRef = useRef<HTMLDivElement>(null);
  const [showAnimation, setShowAnimation] = useState<boolean>(false);

  const startReveal = () => {
    setRevealMode(true);
    setRevealRank(0);
    setRevealedContestants([]);
    playSound('countdown', isMuted);

    const digitalContainer = document.getElementById('digital-container');
    if (digitalContainer) {
      digitalContainer.classList.add('active');
    }

    setTimeout(() => {
      setRevealRank(3);
      setRevealedContestants((prev) => [...prev, 3]);
      playSound('reveal', isMuted);
      createRipple('amber');
    }, 2000);

    setTimeout(() => {
      setRevealRank(2);
      setRevealedContestants((prev) => [...prev, 2]);
      playSound('reveal', isMuted);
      createRipple('gray');
    }, 5000);

    setTimeout(() => {
      setRevealRank(1);
      setRevealedContestants((prev) => [...prev, 1]);
      playSound('win', isMuted);

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

  const resetAnimation = () => {
    setRevealMode(false);
    setRevealRank(0);
    setRevealedContestants([]);
    setShowAnimation(false);
  };

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

  return { startReveal, resetAnimation, isMuted, setIsMuted, lottieContainerRef, showAnimation };
};