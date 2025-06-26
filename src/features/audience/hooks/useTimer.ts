import { useState, useEffect } from "react";

export const useTimer = (initialTime: number, isPaused: boolean) => {
  const [timeLeft, setTimeLeft] = useState<number>(initialTime);

  useEffect(() => {
    setTimeLeft(initialTime);
  }, [initialTime]);

  useEffect(() => {
    if (timeLeft > 0 && !isPaused) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
    return () => {}; // Cleanup function to clear the timer
  }, [timeLeft, isPaused]);

  return { timeLeft, setTimeLeft };
};
