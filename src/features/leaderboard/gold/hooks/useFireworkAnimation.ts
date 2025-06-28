import { useEffect, useRef } from "react";
import { Firework } from "../types/Firework";
import { Particle } from "../types/Particle";
import { createParticles } from "../utils/canvasUtils";
import { random } from "../utils/randomUtils";

export function useFireworkAnimation(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const fireworks = useRef<Firework[]>([]);
  const particles = useRef<Particle[]>([]);
  const hue = useRef<number>(120);
  const limiterTotal = useRef<number>(5);
  const limiterTick = useRef<number>(0);
  const timerTotal = useRef<number>(80);
  const timerTick = useRef<number>(0);
  const mousedown = useRef<boolean>(false);
  const mx = useRef<number>(0);
  const my = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let cw = window.innerWidth;
    let ch = window.innerHeight;
    canvas.width = cw;
    canvas.height = ch;

    function loop() {
      window.requestAnimationFrame(loop);
      hue.current = random(0, 360);
      if (!ctx) return;
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(0, 0, cw, ch);
      ctx.globalCompositeOperation = "lighter";

      let i = fireworks.current.length;
      while (i--) {
        fireworks.current[i].draw(ctx, hue.current);
        fireworks.current[i].update(
          i,
          (x: number, y: number, type: number) => createParticles(x, y, type, particles.current),
          fireworks.current
        );
      }

      i = particles.current.length;
      while (i--) {
        particles.current[i].draw(ctx);
        particles.current[i].update(i, particles.current);
      }

      if (timerTick.current >= timerTotal.current) {
        if (!mousedown.current) {
          const numFireworks = Math.floor(random(5, 11));
          for (let j = 0; j < numFireworks; j++) {
            const type = Math.floor(random(0, 4));
            fireworks.current.push(
              new Firework(cw / 2, ch, random(0, cw), random(0, ch / 2), type)
            );
          }
          timerTick.current = 0;
        }
      } else {
        timerTick.current++;
      }

      if (limiterTick.current >= limiterTotal.current) {
        if (mousedown.current) {
          const numFireworks = Math.floor(random(5, 11));
          for (let j = 0; j < numFireworks; j++) {
            const type = Math.floor(random(0, 4));
            fireworks.current.push(new Firework(cw / 2, ch, mx.current, my.current, type));
          }
          limiterTick.current = 0;
        }
      } else {
        limiterTick.current++;
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mx.current = e.clientX - rect.left;
      my.current = e.clientY - rect.top;
    };

    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      mousedown.current = true;
    };

    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      mousedown.current = false;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);

    loop();

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, [canvasRef]);
}