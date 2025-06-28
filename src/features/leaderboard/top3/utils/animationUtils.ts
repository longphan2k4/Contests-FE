import confetti from 'canvas-confetti';

export const confettiBurst = () => {
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