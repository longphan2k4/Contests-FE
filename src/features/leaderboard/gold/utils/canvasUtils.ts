
import { Particle } from "../types/Particle";

export function createParticles(x: number, y: number, type: number, particles: Particle[]): void {
  let particleCount: number;
  if (type === 0) {
    particleCount = 30;
  } else if (type === 1) {
    particleCount = 50;
  } else if (type === 2) {
    particleCount = 20;
  } else if (type === 3) {
    particleCount = 40;
  } else {
    particleCount = 0;
  }
  while (particleCount--) {
    particles.push(new Particle(x, y, type, Math.random() * 360));
  }
}