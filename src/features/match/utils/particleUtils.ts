import type { Particle } from '../types';

export const createParticles = (id: number): Particle[] => {
  const particleCount = 10;
  return Array.from({ length: particleCount }, (_, i) => ({
    id: `${id}-${i}`,
    size: Math.random() * 6 + 2,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    tx: `${(Math.random() - 0.5) * 100}px`,
    ty: `${(Math.random() - 0.5) * 100}px`,
    rotate: `${Math.random() * 360}deg`,
  }));
};