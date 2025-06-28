export class Particle {
  x: number;
  y: number;
  type: number;
  coordinates: [number, number][];
  coordinateCount: number;
  angle: number;
  speed: number;
  friction: number;
  gravity: number;
  hue: number;
  brightness: number;
  alpha: number;
  decay: number;

  constructor(x: number, y: number, type: number, hue: number) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.coordinates = [];
    this.coordinateCount = 5;
    while (this.coordinateCount--) {
      this.coordinates.push([this.x, this.y]);
    }
    this.angle = this.random(0, Math.PI * 2);
    this.speed = this.random(1, 10);
    this.friction = 0.95;
    this.gravity = 1;
    this.hue = this.random(hue - 50, hue + 50);
    this.brightness = this.random(50, 80);
    this.alpha = 1;
    this.decay = this.random(0.015, 0.03);
    if (this.type === 1) {
      this.speed = this.random(2, 12);
      this.gravity = 1.5;
    } else if (this.type === 2) {
      this.hue = this.random(0, 360);
    } else if (this.type === 3) {
      this.speed = this.random(1, 5);
      this.gravity = 0.5;
    }
  }

  update(index: number, particles: Particle[]) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);
    this.speed *= this.friction;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.alpha -= this.decay;
    if (this.alpha <= this.decay) {
      particles.splice(index, 1);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.moveTo(
      this.coordinates[this.coordinates.length - 1][0],
      this.coordinates[this.coordinates.length - 1][1]
    );
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
    ctx.stroke();
  }

  private random(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }
}