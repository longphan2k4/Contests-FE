export const playSound = (type: string, isMuted: boolean) => {
  if (!isMuted) {
    const audio = new Audio(`/audio/${type}.mp3`);
    audio.play().catch((err) => console.error('Audio error:', err));
  }
};